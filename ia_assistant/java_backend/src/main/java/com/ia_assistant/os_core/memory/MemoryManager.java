package com.ia_assistant.os_core.memory;

import com.ia_assistant.os_core.Process;
import java.util.LinkedList;
import java.util.Optional;
import java.util.Queue;

/**
 * Gestiona la memoria virtual utilizando paginación bajo demanda.
 */
public class MemoryManager {

    private final Frame[] physicalMemory; // Simula la RAM física como un array de marcos
    private final Queue<Integer> freeFrames; // Cola para encontrar marcos libres rápidamente
    private final Queue<Integer> pageReplacementQueue; // Cola para el algoritmo de reemplazo FIFO

    public MemoryManager(int totalMemoryMB) {
        int numFrames = (int) Math.floor((double) totalMemoryMB * 1024 / Process.PAGE_SIZE_KB);
        this.physicalMemory = new Frame[numFrames];
        this.freeFrames = new LinkedList<>();
        this.pageReplacementQueue = new LinkedList<>();

        for (int i = 0; i < numFrames; i++) {
            physicalMemory[i] = new Frame();
            freeFrames.add(i);
        }

        System.out.println("MemoryManager (Paginación): Listo. Memoria física: " + numFrames + " marcos de " + Process.PAGE_SIZE_KB + " KB c/u.");
    }

    /**
     * Simula el acceso a una dirección de memoria virtual por un proceso.
     * Este es el punto de entrada principal para la lógica de memoria virtual.
     *
     * @param process El proceso que solicita el acceso a memoria.
     * @param virtualAddress La dirección virtual a la que se quiere acceder.
     * @return true si el acceso fue exitoso (directamente o después de manejar una falta de página),
     *         false si el acceso es inválido (fuera de los límites del proceso).
     */
    public boolean accessMemory(Process process, int virtualAddress) {
        int pageNumber = virtualAddress / (Process.PAGE_SIZE_KB * 1024);

        // Verificación de seguridad: ¿El acceso está dentro del espacio de direcciones del proceso?
        if (pageNumber < 0 || pageNumber >= process.getVirtualSizeInPages()) {
            System.out.printf("ERROR de Memoria (PID %d): Acceso a dirección virtual %d inválida. Segmento fuera de límites.\n", process.getPid(), virtualAddress);
            return false;
        }

        System.out.printf("MEM-ACCESS (PID %d): Accediendo a dirección virtual %d (página %d)...\n", process.getPid(), virtualAddress, pageNumber);

        // Traducción de Dirección: ¿Está la página en memoria?
        Optional<Integer> frameNumberOpt = process.getPageTable().getFrameNumber(pageNumber);

        if (frameNumberOpt.isPresent() && frameNumberOpt.get() != null) {
            // ¡Cache Hit! La página ya está en un marco físico.
            System.out.printf("  -> ¡ÉXITO! Página %d ya está en el marco físico %d.\n", pageNumber, frameNumberOpt.get());
            return true;
        } else {
            // ¡Page Fault! La página no está en memoria. Hay que manejarla.
            System.out.printf("  -> ¡FALTA DE PÁGINA (Page Fault)! La página %d no está en memoria física.\n", pageNumber);
            return handlePageFault(process, pageNumber);
        }
    }
    
    /**
     * Libera todos los marcos de memoria que estaban asignados a un proceso terminado.
     * @param process El proceso que ha terminado.
     */
    public void releaseProcessMemory(Process process) {
        System.out.printf("MEM-RELEASE (PID %d): Liberando todos los marcos de memoria.\n", process.getPid());
        for (int i = 0; i < physicalMemory.length; i++) {
            if (physicalMemory[i].getProcessId() != null && physicalMemory[i].getProcessId() == process.getPid()) {
                // Este marco pertenece al proceso terminado.
                int pageNum = physicalMemory[i].getPageNumber();
                physicalMemory[i].free();
                freeFrames.add(i); // El marco vuelve a estar disponible.
                // Es importante remover la página de la cola de reemplazo para no causar errores.
                pageReplacementQueue.remove(Integer.valueOf(i)); 
                // Invalida la página en la tabla del proceso para reflejar que ya no está en memoria.
                process.getPageTable().invalidatePage(pageNum);
                 System.out.printf("  -> Marco %d (contenía página %d) liberado.\n", i, pageNum);
            }
        }
    }

    /**
     * Orquesta la carga de una página del "disco" a la memoria física.
     *
     * @param process El proceso que sufrió la falta de página.
     * @param pageNumber El número de página que necesita ser cargada.
     * @return true si la página fue cargada exitosamente, false si no.
     */
    private boolean handlePageFault(Process process, int pageNumber) {
        Integer frameToUse;

        if (!freeFrames.isEmpty()) {
            // Caso 1: Hay marcos libres. Es el caso más simple.
            frameToUse = freeFrames.poll();
            System.out.printf("  -> Marco libre encontrado: %d. Cargando página %d en él.\n", frameToUse, pageNumber);
        } else {
            // Caso 2: No hay marcos libres. Se necesita un algoritmo de reemplazo de páginas.
            System.out.println("  -> No hay marcos libres. Se necesita reemplazo de página.");
            frameToUse = runPageReplacementAlgorithm();
            if (frameToUse == null) {
                 System.out.println("  -> ¡ERROR CRÍTICO! El algoritmo de reemplazo no pudo seleccionar un marco.");
                return false; // Situación inesperada
            }
            System.out.printf("  -> Reemplazando página en el marco %d.\n", frameToUse);
        }

        // Carga la página nueva en el marco seleccionado.
        loadPageIntoFrame(process, pageNumber, frameToUse);
        return true;
    }

    /**
     * Implementa el algoritmo de reemplazo de páginas FIFO (First-In, First-Out).
     * @return El número del marco que ha sido liberado para ser reutilizado.
     */
    private Integer runPageReplacementAlgorithm() {
        // FIFO: La primera página que entró, es la primera que sale.
        Integer frameToReplace = pageReplacementQueue.poll();

        if (frameToReplace == null) {
            return null; // La cola estaba vacía, no debería pasar si no hay marcos libres.
        }

        Frame victimFrame = physicalMemory[frameToReplace];
        int oldProcessId = victimFrame.getProcessId();
        int oldPageNumber = victimFrame.getPageNumber();

        System.out.printf("  -> Algoritmo FIFO elige el marco %d para reemplazo (contenía página %d del PID %d).\n", frameToReplace, oldPageNumber, oldProcessId);

        // NOTA: En un SO real, aquí se guardaría la página víctima en disco si ha sido modificada (dirty bit).
        // Aquí simplemente la invalidamos en la tabla de páginas del proceso antiguo.
        // Necesitaríamos una forma de obtener el Proceso a partir de su ID, lo cual requiere una refactorización mayor.
        // Por ahora, asumimos que no podemos notificar al proceso antiguo, lo cual es una simplificación.

        victimFrame.free(); // Se libera el marco, pero no se añade a freeFrames porque se va a usar ya.

        return frameToReplace;
    }

    /**
     * Realiza la acción final de colocar una página en un marco físico.
     * @param process El proceso al que pertenece la página.
     * @param pageNumber El número de página a cargar.
     * @param frameNumber El marco físico donde se cargará la página.
     */
    private void loadPageIntoFrame(Process process, int pageNumber, int frameNumber) {
        // 1. Ocupar el marco físico.
        physicalMemory[frameNumber].allocate(process.getPid(), pageNumber);

        // 2. Actualizar la tabla de páginas del proceso para que apunte al nuevo marco.
        process.getPageTable().mapPageToFrame(pageNumber, frameNumber);

        // 3. Añadir el marco a la cola de reemplazo (para FIFO).
        pageReplacementQueue.add(frameNumber);

        System.out.printf("  -> ¡CARGA COMPLETA! Página %d del PID %d cargada en el marco %d. Tabla de páginas actualizada.\n", pageNumber, process.getPid(), frameNumber);
    }

    /**
     * Muestra el estado actual de la memoria física (los marcos).
     */
    public void showMemoryStatus() {
        System.out.println("--- Estado de la Memoria Física ---");
        System.out.println("Total de Marcos: " + physicalMemory.length + ". Marcos Libres: " + freeFrames.size() + ".");
        System.out.println("Contenido de los marcos (PID:NumPágina):");
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < physicalMemory.length; i++) {
            Frame frame = physicalMemory[i];
            if (frame.isFree()) {
                sb.append(" Vacío ");
            } else {
                sb.append(String.format(" %d:%d ", frame.getProcessId(), frame.getPageNumber()));
            }
            sb.append(i == physicalMemory.length - 1 ? "]" : "|");
        }
        System.out.println(sb.toString());
        System.out.println("Cola de Reemplazo FIFO (orden de salida): " + pageReplacementQueue);
        System.out.println("-----------------------------------");
    }
}
