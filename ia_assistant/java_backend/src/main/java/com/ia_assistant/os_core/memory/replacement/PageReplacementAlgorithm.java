package com.ia_assistant.os_core.memory.replacement;

/**
 * Interfaz para las estrategias de reemplazo de páginas.
 * Esto permite que el MemoryManager utilice diferentes algoritmos (FIFO, LRU, etc.) de forma intercambiable.
 */
public interface PageReplacementAlgorithm {

    /**
     * Se llama cuando se produce un fallo de página y no hay marcos libres.
     * El algoritmo debe decidir qué marco de página debe ser la "víctima".
     * @return El número del marco físico que ha sido seleccionado para reemplazo.
     */
    Integer findVictimFrame();

    /**
     * Notifica al algoritmo que una página ha sido cargada en un marco.
     * El algoritmo debe empezar a rastrear este marco.
     * @param frameNumber El número del marco que ahora está ocupado.
     */
    void onPageLoad(int frameNumber);

    /**
     * Notifica al algoritmo que se ha accedido a una página que ya estaba en memoria.
     * Esencial para algoritmos como LRU, que necesitan saber sobre los accesos.
     * @param frameNumber El número del marco al que se accedió.
     */
    void onPageAccess(int frameNumber);

    /**
     * Notifica al algoritmo que un marco ha sido liberado (ej. cuando un proceso termina).
     * El algoritmo debe dejar de rastrear este marco.
     * @param frameNumber El número del marco que ha sido liberado.
     */
    void onFrameFree(int frameNumber);
    
    /**
     * Obtiene el nombre de la estrategia actual (ej. "FIFO", "LRU").
     * @return El nombre del algoritmo.
     */
    String getName();

     /**
     * Devuelve una representación en String del estado interno del algoritmo (ej. la cola o lista).
     * @return Un String que describe el estado de la cola/lista de reemplazo.
     */
    String getStatus();
}
