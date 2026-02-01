package com.ia_assistant.os_core;

import com.ia_assistant.os_core.concurrency.Thread;
import com.ia_assistant.os_core.memory.MemoryManager;
import com.ia_assistant.os_core.scheduler.RoundRobinStrategy;
import com.ia_assistant.os_core.scheduler.Scheduler;
import com.ia_assistant.os_core.scheduler.ShortestJobFirstStrategy;
import com.ia_assistant.os_core.scheduler.SchedulingAlgorithm;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Gestiona el ciclo de vida de los procesos y delega la planificación de hilos al Scheduler.
 */
public class ProcessManager {

    private final List<Process> processList; // Lista maestra de todos los procesos
    private final Scheduler scheduler;
    private final MemoryManager memoryManager;
    private int nextProcessId = 1;

    public ProcessManager(MemoryManager memoryManager) {
        this.processList = new ArrayList<>();
        this.memoryManager = memoryManager;
        this.scheduler = new Scheduler(new RoundRobinStrategy(), 4);
        System.out.println("ProcessManager: Listo. Scheduler inicializado.");
    }

    // Getter para exponer el Scheduler al Kernel
    public Scheduler getScheduler() {
        return this.scheduler;
    }

    public Process createProcess(String name, int burstTime, int virtualSizeInMB) {
        int newPid = nextProcessId++;
        Process newProcess = new Process(newPid, name, burstTime, virtualSizeInMB);
        processList.add(newProcess);
        scheduler.admitProcessThreads(newProcess);
        System.out.printf("ProcessManager: Proceso '%s' (PID %d) creado y sus hilos admitidos en el scheduler.\n", name, newProcess.getPid());
        return newProcess;
    }

    public void runSchedulerCycles(int cycles) {
        System.out.println("--- Iniciando " + cycles + " ciclo(s) de planificador ---");
        for (int i = 0; i < cycles; i++) {
            System.out.println("\n--- Ciclo de Planificador #" + (i + 1) + " ---");
            scheduler.runCycle();
            cleanupTerminatedProcesses();
        }
        System.out.println("\n--- Simulación de ciclos completada ---");
        listAllProcesses();
    }

    private void cleanupTerminatedProcesses() {
        for (Process p : new ArrayList<>(processList)) {
            if (!p.hasActiveThreads()) {
                System.out.printf("ProcessManager: Proceso %s (PID %d) no tiene hilos activos. Liberando memoria.\n", p.getName(), p.getPid());
                memoryManager.releaseProcessMemory(p);
                processList.remove(p);
            }
        }
    }

    public boolean terminateProcess(int pid) {
        Optional<Process> pOpt = findProcessById(pid);
        if(pOpt.isPresent()) {
            Process p = pOpt.get();
            System.out.printf("ProcessManager: Terminando proceso '%s' (PID %d)...\n", p.getName(), pid);
            p.getThreads().forEach(scheduler::terminateThread);
            p.terminate();
            cleanupTerminatedProcesses();
            return true;
        } else {
             System.out.println("ProcessManager: No se encontró ningún proceso con PID " + pid + ".");
            return false;
        }
    }
    
    public void terminateAllProcesses() {
        System.out.println("ProcessManager: Terminando todos los procesos...");
        new ArrayList<>(processList).forEach(p -> terminateProcess(p.getPid()));
    }

    public boolean setSchedulingStrategy(String strategyName) {
        SchedulingAlgorithm newStrategy;
        if ("rr".equalsIgnoreCase(strategyName)) {
            newStrategy = new RoundRobinStrategy();
        } else if ("sjf".equalsIgnoreCase(strategyName)) {
            newStrategy = new ShortestJobFirstStrategy();
        } else {
            return false;
        }
        scheduler.setStrategy(newStrategy);
        return true;
    }

    public Optional<Process> findProcessById(int pid) {
        return processList.stream().filter(p -> p.getPid() == pid).findFirst();
    }

    public Optional<Thread> findThreadInProcess(int pid, int tid) {
        Optional<Process> pOpt = findProcessById(pid);
        if (pOpt.isPresent()) {
            return pOpt.get().getThreads().stream().filter(t -> t.getThreadId() == tid).findFirst();
        }
        return Optional.empty();
    }

    public void listAllProcesses() {
        System.out.println("--- Estado de Todos los Procesos y sus Hilos ---");
        if (processList.isEmpty()) {
            System.out.println("No hay procesos activos.");
        } else {
            for (Process p : processList) {
                System.out.println(p.toString());
                p.getThreads().forEach(t -> System.out.println("  -> " + t.toString()));
            }
        }
        System.out.println("\n--- Cola de Hilos Listos (Ready Queue) ---");
        List<String> queueInfo = scheduler.getReadyQueueSnapshot().stream()
                                        .map(t -> String.format("TID-%d(PID-%d)", t.getThreadId(), t.getParentProcess().getPid()))
                                        .collect(Collectors.toList());
        System.out.println("Estrategia actual: " + scheduler.getStrategyName());
        System.out.println(queueInfo.isEmpty() ? "(vacía)" : queueInfo);
        System.out.println("------------------------------------");
    }
}
