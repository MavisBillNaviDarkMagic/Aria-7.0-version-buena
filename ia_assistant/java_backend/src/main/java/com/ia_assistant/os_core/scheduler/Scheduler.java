package com.ia_assistant.os_core.scheduler;

import com.ia_assistant.os_core.Process;
import com.ia_assistant.os_core.concurrency.Thread;
import java.util.List;
import java.util.Queue;

/**
 * Orquesta la ejecución de hilos utilizando una estrategia de planificación modular.
 */
public class Scheduler {

    private SchedulingAlgorithm strategy;
    private int quantum; // Para algoritmos apropiativos como Round Robin
    private int cyclesRunInQuantum; // Ciclos ejecutados para el hilo actual en su quantum

    private Thread currentThread;

    public Scheduler(SchedulingAlgorithm initialStrategy, int quantum) {
        this.strategy = initialStrategy;
        this.quantum = quantum;
        this.cyclesRunInQuantum = 0;
        this.currentThread = null;
        System.out.println("Scheduler: Listo. Estrategia inicial: " + getStrategyName());
    }

    public void setStrategy(SchedulingAlgorithm newStrategy) {
        System.out.println("Scheduler: Cambiando estrategia de " + getStrategyName() + " a " + newStrategy.getClass().getSimpleName());
        // Transferir hilos de la cola antigua a la nueva
        Queue<Thread> oldQueue = this.strategy.clear();
        this.strategy = newStrategy;
        oldQueue.forEach(this.strategy::admitThread);
        // Si un hilo estaba en medio de un quantum, se resetea la decisión
        if (currentThread != null) {
            this.strategy.admitThread(currentThread);
            this.currentThread = null;
        }
    }
    
    /**
     * Admite todos los hilos iniciales de un proceso en la cola de listos.
     */
    public void admitProcessThreads(Process process) {
        process.getThreads().forEach(strategy::admitThread);
    }

    public void runCycle() {
        // 1. Si no hay hilo en ejecución, obtener el siguiente de la estrategia.
        if (currentThread == null) {
            currentThread = strategy.getNextThread();
            cyclesRunInQuantum = 0; // Resetear contador de quantum
        }

        // Si no hay ningún hilo para ejecutar, no hacer nada.
        if (currentThread == null) {
            System.out.println("Scheduler: No hay hilos en la cola de listos.");
            return;
        }

        // 2. Ejecutar un ciclo del hilo.
        currentThread.setState(Thread.ThreadState.RUNNING);
        System.out.printf("Scheduler: Ejecutando ciclo en Thread %d (PID %d) con estrategia %s.\n", 
                          currentThread.getThreadId(), currentThread.getParentProcess().getPid(), getStrategyName());

        // Simulación de trabajo: Aquí es donde el hilo consumiría tiempo de CPU.
        // En una fase futura, el "burstTime" se gestionaría aquí.
        
        // 3. Verificar si el hilo debe ser desalojado (preemption).
        if (strategy.isPreemptive()) {
            cyclesRunInQuantum++;
            if (cyclesRunInQuantum >= quantum) {
                System.out.printf("Scheduler: Quantum de %d ciclos finalizado para Thread %d.\n", quantum, currentThread.getThreadId());
                currentThread.setState(Thread.ThreadState.READY);
                strategy.returnThreadToQueue(currentThread);
                currentThread = null; // Liberar la CPU para que el planificador elija de nuevo.
            }
        }
        // Si no es apropiativo, el hilo continuará hasta que se bloquee o termine.
    }

    public void blockThread(Thread thread) {
        if (thread != null) {
            thread.setState(Thread.ThreadState.BLOCKED);
            strategy.removeThread(thread);
            if (thread == currentThread) {
                currentThread = null; // Si el hilo bloqueado era el actual, la CPU se libera.
            }
        }
    }

    public void unblockThread(Thread thread) {
        if (thread != null && thread.getState() == Thread.ThreadState.BLOCKED) {
            thread.setState(Thread.ThreadState.READY);
            strategy.admitThread(thread);
        }
    }

    public void terminateThread(Thread thread) {
        if (thread != null) {
            thread.setState(Thread.ThreadState.TERMINATED);
            strategy.removeThread(thread);
             if (thread == currentThread) {
                currentThread = null; // Liberar la CPU.
            }
        }
    }

    // --- Métodos de Información ---
    public String getStrategyName() {
        return strategy.getClass().getSimpleName().replace("Strategy", "");
    }

    public List<Thread> getReadyQueueSnapshot() {
        return new java.util.ArrayList<>(strategy.getReadyQueueSnapshot());
    }
}
