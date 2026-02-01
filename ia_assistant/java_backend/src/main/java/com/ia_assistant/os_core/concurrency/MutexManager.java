package com.ia_assistant.os_core.concurrency;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Gestiona la creación y el ciclo de vida de los objetos Mutex en el sistema.
 */
public class MutexManager {

    private final Map<Integer, Mutex> mutexMap = new ConcurrentHashMap<>();
    private final AtomicInteger nextMutexId = new AtomicInteger(0);

    /**
     * Crea un nuevo Mutex y lo registra en el sistema.
     * @return El Mutex recién creado.
     */
    public Mutex createMutex() {
        int id = nextMutexId.getAndIncrement();
        Mutex mutex = new Mutex();
        mutexMap.put(id, mutex);
        System.out.printf("MutexManager: Mutex %d creado.\n", id);
        return mutex;
    }

    /**
     * Busca un Mutex por su ID.
     * @param mutexId El ID del mutex a buscar.
     * @return Un Optional que contiene el Mutex si se encuentra.
     */
    public Optional<Mutex> getMutex(int mutexId) {
        return Optional.ofNullable(mutexMap.get(mutexId));
    }

    /**
     * Elimina un mutex del sistema.
     * En un sistema real, esto requeriría una lógica cuidadosa para asegurarse
     * de que ningún hilo esté usando o esperando el mutex.
     * @param mutexId El ID del mutex a eliminar.
     */
    public void destroyMutex(int mutexId) {
        Mutex removed = mutexMap.remove(mutexId);
        if (removed != null) {
            System.out.printf("MutexManager: Mutex %d destruido.\n", mutexId);
        } else {
            System.out.printf("MutexManager: Intento de destruir un mutex inexistente (ID: %d).\n", mutexId);
        }
    }
    
    public Map<Integer, Mutex> getAllMutexes() {
        return new ConcurrentHashMap<>(mutexMap);
    }
}
