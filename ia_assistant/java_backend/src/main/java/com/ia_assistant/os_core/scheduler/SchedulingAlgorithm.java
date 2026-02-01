package com.ia_assistant.os_core.scheduler;

import com.ia_assistant.os_core.concurrency.Thread;
import java.util.Queue;

/**
 * Interfaz para las estrategias de planificación de la CPU, ahora centrada en Hilos.
 */
public interface SchedulingAlgorithm {

    /**
     * Añade un hilo a la cola de listos.
     * @param thread El hilo a admitir.
     */
    void admitThread(Thread thread);

    /**
     * Obtiene el siguiente hilo a ejecutar según la estrategia del algoritmo.
     * @return El siguiente hilo, o null si no hay ninguno.
     */
    Thread getNextThread();

    /**
     * Devuelve un hilo a la cola después de que su quantum haya expirado.
     * @param thread El hilo a devolver.
     */
    void returnThreadToQueue(Thread thread);

    /**
     * Obtiene una instantánea de la cola de listos para visualización.
     * @return Una cola que representa el estado actual de los hilos listos.
     */
    Queue<Thread> getReadyQueueSnapshot();

    /**
     * Elimina un hilo específico de la cola (por ejemplo, si se termina o bloquea).
     * @param thread El hilo a eliminar.
     */
    void removeThread(Thread thread);

    /**
     * Indica si el algoritmo es apropiativo (preemptive).
     */
    boolean isPreemptive();
    
    /**
     * Vacía la cola de listos y devuelve todos los hilos que contenía.
     */
    Queue<Thread> clear();
}
