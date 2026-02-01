package com.ia_assistant.os_core.memory.replacement;

import java.util.LinkedList;

/**
 * Implementa el algoritmo de reemplazo de páginas Least Recently Used (LRU).
 */
public class LRUStrategy implements PageReplacementAlgorithm {

    // Usamos una LinkedList para mantener el orden de uso. 
    // El principio de la lista es el "menos recientemente usado".
    // El final de la lista es el "más recientemente usado".
    private final LinkedList<Integer> lruList;

    public LRUStrategy() {
        this.lruList = new LinkedList<>();
    }

    @Override
    public Integer findVictimFrame() {
        // La víctima es el primer elemento de la lista (el menos recientemente usado).
        // Lo quitamos de la lista al seleccionarlo.
        if (lruList.isEmpty()) {
            return null;
        }
        return lruList.removeFirst(); 
    }

    @Override
    public void onPageLoad(int frameNumber) {
        // Cuando una página nueva se carga, se convierte en la más recientemente usada.
        // La añadimos al final de la lista.
        lruList.addLast(frameNumber);
    }

    @Override
    public void onPageAccess(int frameNumber) {
        // ¡Esta es la lógica clave de LRU!
        // Cuando se accede a una página que ya está en memoria, debemos marcarla como "muy reciente".
        // Lo logramos moviendo su número de marco al final de la lista.
        
        // Primero, lo quitamos de su posición actual.
        // Usamos remove(Object) para asegurarnos de que trata el int como un elemento a borrar,
        // no como un índice.
        boolean removed = lruList.remove(Integer.valueOf(frameNumber));

        // Si estaba en la lista, lo volvemos a añadir al final.
        if (removed) {
            lruList.addLast(frameNumber);
        }
    }

    @Override
    public void onFrameFree(int frameNumber) {
        // Si un marco se libera, hay que quitarlo de nuestra lista de seguimiento.
        lruList.remove(Integer.valueOf(frameNumber));
    }

    @Override
    public String getName() {
        return "LRU (Least Recently Used)";
    }

    @Override
    public String getStatus() {
        return "Orden de Uso (LRU -> MRU): " + lruList.toString();
    }
}
