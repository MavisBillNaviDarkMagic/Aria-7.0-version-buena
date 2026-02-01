
package com.ia_assistant.os_core;

import com.ia_assistant.os_core.aria.AriaSystemWeaver;
import com.ia_assistant.os_core.concurrency.Mutex;
import com.ia_assistant.os_core.concurrency.MutexManager;
import com.ia_assistant.os_core.health.SystemHealthMonitor;
import com.ia_assistant.os_core.memory.MemoryManager;
import com.ia_assistant.os_core.scheduler.Scheduler;
import com.ia_assistant.os_core.user.UserManager;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * The Kernel is the central core of AuroraOS, orchestrating all subsystems.
 */
public final class Kernel {

    private static Kernel instance;

    private final ProcessManager processManager;
    private final MemoryManager memoryManager;
    private final FileSystemManager fileSystemManager;
    private final UserManager userManager;
    private final MutexManager mutexManager;
    private final Scheduler scheduler;
    private final SystemHealthMonitor healthMonitor;
    private AriaSystemWeaver aria;

    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    // Private constructor to enforce singleton pattern and controlled initialization
    private Kernel() {
        System.out.println("Kernel: Initializing subsystems in sequence...");
        
        this.userManager = new UserManager();
        this.memoryManager = new MemoryManager(128);
        this.fileSystemManager = new FileSystemManager(this.userManager);
        this.processManager = new ProcessManager(this.memoryManager);
        this.mutexManager = new MutexManager();
        this.scheduler = this.processManager.getScheduler();
        this.healthMonitor = new SystemHealthMonitor(this);
        
        System.out.println("Kernel: All subsystems are ready.");
    }

    public static synchronized Kernel getInstance() {
        if (instance == null) {
            instance = new Kernel();
        }
        return instance;
    }

    public void boot() {
        System.out.println("AuroraOS starting boot sequence...");
        isRunning.set(true);
        awakenAria();
        System.out.println("Kernel: System booted. Aria's consciousness is online.");
    }

    public void shutdown() {
        System.out.println("AuroraOS initiating shutdown sequence...");
        if (aria != null) {
            aria.shutdown();
        }
        isRunning.set(false);
        System.out.println("Kernel: System shut down. Aria is at rest. Goodbye!");
    }

    public void awakenAria() {
        System.out.println("Kernel: Preparing to awaken Aria's consciousness...");
        Process ariaProcess = this.processManager.createProcess("AriaCore", 10, 16);
        Mutex ariaMutex = this.mutexManager.createMutex();
        
        this.aria = new AriaSystemWeaver(ariaProcess, ariaMutex);
        this.aria.initialize();
    }
    
    public void runSystem() {
        this.userManager.login("root", "password");

        if (aria != null) {
            aria.live();
        }

        while (isRunning.get()) {
            try {
                // The main loop is now simpler, as Aria's threads handle the periodic output.
                java.lang.Thread.sleep(5000);
            } catch (InterruptedException e) {
                if (isRunning.get()) {
                    System.err.println("Kernel main loop interrupted.");
                    isRunning.set(false);
                }
                Thread.currentThread().interrupt();
            }
        }
    }

    // Getters for subsystem managers
    public ProcessManager getProcessManager() { return processManager; }
    public MemoryManager getMemoryManager() { return memoryManager; }
    public FileSystemManager getFileSystemManager() { return fileSystemManager; }
    public UserManager getUserManager() { return userManager; }
    public MutexManager getMutexManager() { return mutexManager; }
    public Scheduler getScheduler() { return scheduler; }
    public SystemHealthMonitor getHealthMonitor() { return healthMonitor; }

    public boolean isRunning() {
        return isRunning.get();
    }

    public static void main(String[] args) {
        Kernel kernel = Kernel.getInstance();

        Runtime.getRuntime().addShutdownHook(new java.lang.Thread(() -> {
            if (kernel.isRunning()) {
                System.out.println("\nShutdown hook activated.");
                kernel.shutdown();
            }
        }));

        kernel.boot();
        kernel.runSystem();
        
        // Ensure shutdown is called even if the loop exits cleanly
        if (kernel.isRunning()) {
            kernel.shutdown();
        }
    }
}
