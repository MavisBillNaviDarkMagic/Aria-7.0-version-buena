package com.ia_assistant.os_core.memory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Representa la tabla de páginas de un proceso.
 * Mapea las páginas virtuales a los marcos (frames) de la memoria física.
 */
public class PageTable {

    // Un mapa de número de página virtual a número de marco físico.
    // Usamos Optional<Integer> para representar si la página está presente en memoria o no.
    // Si el valor es Optional.empty(), la página no está en un marco físico (falta de página).
    private final Map<Integer, Optional<Integer>> pageToFrameMap;

    public PageTable() {
        this.pageToFrameMap = new HashMap<>();
    }

    /**
     * Asocia un número de página virtual con un número de marco físico.
     * @param pageNumber El número de la página virtual.
     * @param frameNumber El número del marco físico.
     */
    public void mapPageToFrame(int pageNumber, int frameNumber) {
        pageToFrameMap.put(pageNumber, Optional.of(frameNumber));
    }

    /**
     * Invalida la entrada de una página, marcándola como no presente en la memoria física.
     * Esto ocurre cuando una página es descargada de un marco a disco.
     * @param pageNumber El número de la página virtual a invalidar.
     */
    public void invalidatePage(int pageNumber) {
        if (pageToFrameMap.containsKey(pageNumber)) {
            pageToFrameMap.put(pageNumber, Optional.empty());
        }
    }
    
    /**
     * Establece que una página existe en el espacio de direcciones virtuales del proceso,
     * pero aún no está en la memoria física.
     * @param pageNumber El número de la página a registrar.
     */
    public void provisionPage(int pageNumber) {
        pageToFrameMap.putIfAbsent(pageNumber, Optional.empty());
    }

    /**
     * Obtiene el número de marco físico para un número de página virtual dado.
     * @param pageNumber El número de la página virtual.
     * @return Un Optional que contiene el número de marco si la página está presente,
     *         o un Optional vacío si no lo está (falta de página).
     */
    public Optional<Integer> getFrameNumber(int pageNumber) {
        return pageToFrameMap.getOrDefault(pageNumber, Optional.empty());
    }

    /**
     * Obtiene una copia del mapa de páginas para visualización o depuración.
     * @return Un mapa inmutable del estado actual de la tabla de páginas.
     */
    public Map<Integer, Optional<Integer>> getMappings() {
        return new HashMap<>(pageToFrameMap);
    }
}
