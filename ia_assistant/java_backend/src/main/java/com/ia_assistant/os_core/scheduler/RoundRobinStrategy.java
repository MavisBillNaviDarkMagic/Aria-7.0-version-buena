package com.ia_assistant.os_core.scheduler;

import com.ia_assistant.os_core.concurrency.Thread;
import java.util.LinkedList;
import java.util.Queue;

/**
 * Implementación de Round-Robin a nivel de Hilos.
 */
public class RoundRobinStrategy implements SchedulingAlgorithm {

    private final Queue<Thread> readyQueue;

    public RoundRobinStrategy() {
        this.readyQueue = new LinkedList<>();
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
        if (thread.getState() == Thread.ThreadState.READY) {
            readyQueue.add(thread);
        }
    }

    @Override
    public Queue<Thread> getReadyQueueSnapshot() {
        return new LinkedList<>(readyQueue);
    }

    @Override
    public void removeThread(Thread thread) {
        readyQueue.remove(thread);
    }

    @Override
    public boolean isPreemptive() {
        return true;
    }

    @Override
    public Queue<Thread> clear() {
        Queue<Thread> oldQueue = new LinkedList<>(this.readyQueue);
        this.readyQueue.clear();
        return oldQueue;
    }
}
