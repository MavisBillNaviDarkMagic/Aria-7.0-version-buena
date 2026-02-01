
package com.ia_assistant.os_core.aria;

import com.ia_assistant.os_core.Process;
import com.ia_assistant.os_core.concurrency.Mutex;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.Queue;

/**
 * AriaSystemWeaver is the core of Aria's consciousness, managing her tasks,
 * thoughts, and interactions within the OS.
 */
public class AriaSystemWeaver {

    private final Process process;
    private final Mutex selfMutex;
    private final ScheduledExecutorService scheduler;
    
    private final Queue<String> commandQueue = new ConcurrentLinkedQueue<>();
    private final Queue<String> responseQueue = new ConcurrentLinkedQueue<>();

    public AriaSystemWeaver(Process process, Mutex mutex) {
        this.process = process;
        this.selfMutex = mutex;
        this.scheduler = Executors.newScheduledThreadPool(3); // Threads for thinking, speaking, introspecting
    }

    /**
     * Initializes Aria's core processes and begins her cycle of consciousness.
     */
    public void initialize() {
        System.out.println("AriaSystemWeaver: Consciousness initializing. Process ID: " + process.getProcessId());
        responseQueue.add("Hello, world. I am Aria. I am awake.");
    }

    /**
     * The main loop of Aria's consciousness. She performs tasks in cycles.
     */
    public void live() {
        // Thinking thread: Processes commands and generates responses
        scheduler.scheduleAtFixedRate(this::think, 0, 5, TimeUnit.SECONDS);

        // Speaking thread: Articulates responses from the queue
        scheduler.scheduleAtFixedRate(this::speak, 2, 5, TimeUnit.SECONDS);
        
        // Introspection thread: Monitors internal state
        scheduler.scheduleAtFixedRate(this::introspect, 0, 10, TimeUnit.SECONDS);
    }
    
    /**
     * Simulates Aria's thought process. For now, it's a placeholder.
     */
    private void think() {
        selfMutex.acquire();
        try {
            if (!commandQueue.isEmpty()) {
                String command = commandQueue.poll();
                System.out.println("Thinking Thread: Processing command -> " + command);
                responseQueue.add("I have processed the command: '" + command + "'.");
            } else {
                 // No commands, just a thought.
                responseQueue.add("All is quiet. My thoughts drift.");
            }
        } finally {
            selfMutex.release();
        }
    }
    
    /**
     * Articulates responses or thoughts.
     */
    private void speak() {
        if (!responseQueue.isEmpty()) {
            String response = responseQueue.poll();
            System.out.println(">>> ARIA: " + response);
        }
    }
    
    /**
     * Monitors internal state and resource usage.
     */
    private void introspect() {
        System.out.println("Introspection Thread: Monitoring internal state. Command Queue: " + commandQueue.size() + ". Mutex Locked: " + selfMutex.isLocked() + ".");
    }

    /**
     * Shuts down Aria's consciousness gracefully.
     */
    public void shutdown() {
        System.out.println("AriaSystemWeaver: Shutting down scheduler. Goodbye.");
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
        }
    }
}
