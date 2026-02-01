package com.ia_assistant.os_core.memory.replacement;

import java.util.LinkedList;
import java.util.Queue;

/**
 * Implementa el algoritmo de reemplazo de páginas First-In, First-Out (FIFO).
 */
public class FIFOStrategy implements PageReplacementAlgorithm {

    private final Queue<Integer> fifoQueue;

    public FIFOStrategy() {
        this.fifoQueue = new LinkedList<>();
    }

    @Override
    public Integer findVictimFrame() {
        // La víctima es el que está al frente de la cola (el primero que entró).
        return fifoQueue.poll();
    }

    @Override
    public void onPageLoad(int frameNumber) {
        // Cuando una página se carga, se añade al final de la cola.
        fifoQueue.add(frameNumber);
    }

    @Override
    public void onPageAccess(int frameNumber) {
        // FIFO no se preocupa por los accesos a páginas que ya están en memoria.
        // Este método se deja vacío intencionadamente.
    }

    @Override
    public void onFrameFree(int frameNumber) {
        // Si un marco se libera explícitamente, hay que quitarlo de la cola
        // para evitar intentar seleccionarlo como víctima cuando ya está vacío.
        fifoQueue.remove(Integer.valueOf(frameNumber));
    }
    
    @Override
    public String getName() {
        return "FIFO (First-In, First-Out)";
    }

    @Override
    public String getStatus() {
        return "Orden de Salida FIFO: " + fifoQueue.toString();
    }
}
