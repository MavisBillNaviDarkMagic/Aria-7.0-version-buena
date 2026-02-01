
package com.ia_assistant.os_core;

import com.ia_assistant.os_core.concurrency.Thread;
import com.ia_assistant.os_core.memory.PageTable;

import java.util.ArrayList;
import java.util.List;

public class Process {

    private final int processId;
    private String processName;
    private int priority;
    private int memoryRequirement; // in KB
    private State state;
    private final List<Thread> threads;
    private final PageTable pageTable;
    private final int burstTime;

    public static final int PAGE_SIZE_KB = 4;

    public enum State {
        NEW, RUNNING, WAITING, TERMINATED
    }

    public Process(int processId, String processName, int priority, int memoryRequirement) {
        this.processId = processId;
        this.processName = processName;
        this.priority = priority;
        this.memoryRequirement = memoryRequirement;
        this.state = State.NEW;
        this.threads = new ArrayList<>();
        this.pageTable = new PageTable();
        this.burstTime = 0; // Default burst time
    }

    public int getProcessId() {
        return processId;
    }

    public int getPid() {
        return processId;
    }

    public String getProcessName() {
        return processName;
    }

    public String getName() {
        return processName;
    }

    public int getPriority() {
        return priority;
    }

    public int getMemoryRequirement() {
        return memoryRequirement;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public List<Thread> getThreads() {
        return threads;
    }

    public boolean hasActiveThreads() {
        return !threads.isEmpty();
    }

    public void terminate() {
        this.state = State.TERMINATED;
        threads.clear();
    }

    public int getBurstTime() {
        return burstTime;
    }

    public PageTable getPageTable() {
        return pageTable;
    }

    public int getVirtualSizeInPages() {
        return (int) Math.ceil((double) memoryRequirement / PAGE_SIZE_KB);
    }

    @Override
    public String toString() {
        return "Process{" +
                "processId=" + processId +
                ", processName='" + processName + '\'' +
                ", priority=" + priority +
                ", memoryRequirement=" + memoryRequirement +
                ", state=" + state +
                '}';
    }
}
