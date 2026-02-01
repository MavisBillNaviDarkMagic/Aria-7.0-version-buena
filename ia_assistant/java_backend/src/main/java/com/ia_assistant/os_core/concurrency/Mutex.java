package com.ia_assistant.os_core.concurrency;

import java.util.concurrent.atomic.AtomicBoolean;

public class Mutex {

    private final AtomicBoolean locked = new AtomicBoolean(false);

    public void acquire() {
        while (!locked.compareAndSet(false, true)) {
            // Explicitly call java.lang.Thread.yield() to avoid ambiguity
            java.lang.Thread.yield();
        }
    }

    public void release() {
        locked.set(false);
    }

    public boolean isLocked() {
        return locked.get();
    }
}
