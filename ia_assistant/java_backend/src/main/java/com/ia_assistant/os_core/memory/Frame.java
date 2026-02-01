package com.ia_assistant.os_core.memory;

/**
 * Representa un marco de página (frame) en la memoria física (RAM).
 * Un marco es un bloque de tamaño fijo de memoria física al que se puede asignar una página de un proceso.
 */
public class Frame {

    private boolean isFree;
    private Integer processId; // El ID del proceso que ocupa este marco
    private Integer pageNumber; // El número de página del proceso que está en este marco

    public Frame() {
        this.isFree = true;
        this.processId = null;
        this.pageNumber = null;
    }

    /**
     * Ocupa el marco con una página de un proceso específico.
     * @param processId El ID del proceso.
     * @param pageNumber El número de la página.
     */
    public void allocate(int processId, int pageNumber) {
        this.isFree = false;
        this.processId = processId;
        this.pageNumber = pageNumber;
    }

    /**
     * Libera el marco, marcándolo como disponible.
     */
    public void free() {
        this.isFree = true;
        this.processId = null;
        this.pageNumber = null;
    }

    public boolean isFree() {
        return isFree;
    }

    public Integer getProcessId() {
        return processId;
    }

    public Integer getPageNumber() {
        return pageNumber;
    }

    @Override
    public String toString() {
        if (isFree) {
            return "[ Free ]";
        } else {
            return String.format("[P%d, Page %d]", processId, pageNumber);
        }
    }
}
