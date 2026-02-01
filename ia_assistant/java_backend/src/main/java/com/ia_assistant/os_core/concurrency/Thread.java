package com.ia_assistant.os_core.concurrency;

import com.ia_assistant.os_core.Process;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Representa un Hilo de Ejecución, la unidad mínima que el planificador puede gestionar.
 * Un Proceso puede tener uno o más hilos.
 */
public class Thread {

    private static final AtomicInteger threadIdCounter = new AtomicInteger(0);

    public enum ThreadState { READY, RUNNING, BLOCKED, TERMINATED }

    private final int threadId;
    private final Process parentProcess; // El proceso al que pertenece este hilo
    private ThreadState state;

    public Thread(Process parentProcess) {
        this.threadId = threadIdCounter.incrementAndGet();
        this.parentProcess = parentProcess;
        this.state = ThreadState.READY;
        System.out.printf("Thread %d (PID %d): Creado y en estado READY.\n", this.threadId, this.parentProcess.getPid());
    }

    // Getters
    public int getThreadId() {
        return threadId;
    }

    public Process getParentProcess() {
        return parentProcess;
    }

    public ThreadState getState() {
        return state;
    }

    // Setters para cambiar el estado
    public void setState(ThreadState state) {
        if (this.state != state) {
            System.out.printf("Thread %d (PID %d): Cambiando estado de %s a %s.\n", this.threadId, this.parentProcess.getPid(), this.state, state);
            this.state = state;
        }
    }

    @Override
    public String toString() {
        return String.format("Thread[TID=%d, PID=%d, Estado=%s]", threadId, parentProcess.getPid(), state);
    }
}
