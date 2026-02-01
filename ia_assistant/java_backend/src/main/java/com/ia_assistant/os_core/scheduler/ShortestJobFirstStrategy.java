package com.ia_assistant.os_core.scheduler;

import com.ia_assistant.os_core.concurrency.Thread;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * Implementación de Shortest Job First a nivel de Hilos.
 * Ordena los hilos basándose en el tiempo de ráfaga de su proceso padre.
 */
public class ShortestJobFirstStrategy implements SchedulingAlgorithm {

    private final PriorityQueue<Thread> readyQueue;
    private static final Comparator<Thread> SJF_COMPARATOR = 
        Comparator.comparingInt(t -> t.getParentProcess().getBurstTime());

    public ShortestJobFirstStrategy() {
        this.readyQueue = new PriorityQueue<>(SJF_COMPARATOR);
    }

    @Override
    public void admitThread(Thread thread) {
        if (thread.getState() == Thread.ThreadState.READY) {
            readyQueue.add(thread);
        }
    }

    @Override
    public Thread getNextThread() {
        return readyQueue.poll();
    }

    @Override
    public void returnThreadToQueue(Thread thread) {
        // En SJF no apropiativo, el hilo corre hasta que termina, se bloquea o es terminado.
        // No se devuelve a la cola simplemente por fin de quantum.
    }

    @Override
    public Queue<Thread> getReadyQueueSnapshot() {
        // Creamos una copia para no alterar la cola original
        PriorityQueue<Thread> snapshotQueue = new PriorityQueue<>(readyQueue);
        // Lo pasamos a LinkedList para que el orden de iteración sea predecible (el de la cola prioritaria)
        Queue<Thread> orderedSnapshot = new LinkedList<>();
        while(!snapshotQueue.isEmpty()) {
            orderedSnapshot.add(snapshotQueue.poll());
        }
        return orderedSnapshot;
    }

    @Override
    public void removeThread(Thread thread) {
        readyQueue.remove(thread);
    }

    @Override
    public boolean isPreemptive() {
        return false;
    }

    @Override
    public Queue<Thread> clear() {
        Queue<Thread> oldQueue = new LinkedList<>(this.readyQueue);
        this.readyQueue.clear();
        return oldQueue;
    }
}
