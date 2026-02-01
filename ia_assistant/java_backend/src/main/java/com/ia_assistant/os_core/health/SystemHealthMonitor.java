package com.ia_assistant.os_core.health;

import com.ia_assistant.os_core.Kernel;
import java.util.ArrayList;
import java.util.List;

/**
 * El "Sistema Leukocyte" de AuraOS. Un monitor de salud que actúa como un glóbulo blanco,
 * detectando anomalías y patógenos en el sistema operativo.
 */
public class SystemHealthMonitor {

    private final Kernel kernel;
    private final boolean hasCompiler; // Simula la presencia de herramientas críticas

    public SystemHealthMonitor(Kernel kernel) {
        this.kernel = kernel;
        // Simulamos la comprobación de una dependencia crítica en el momento del arranque.
        // En un sistema real, esto verificaría la existencia de un archivo o una variable de entorno.
        // Aquí, simplemente lo establecemos en 'false' para simular nuestro problema actual.
        this.hasCompiler = false; 
    }

    /**
     * Ejecuta una serie de diagnósticos para comprobar la salud del sistema.
     * @return Una lista de anomalías detectadas. La lista estará vacía si el sistema está sano.
     */
    public List<Anomaly> runDiagnostics() {
        System.out.println("SystemHealthMonitor: Iniciando escaneo de salud del sistema...");
        List<Anomaly> anomalies = new ArrayList<>();

        // Chequeo 1: Verificar la presencia de herramientas de desarrollo (simulación)
        checkCompilerPresence(anomalies);

        // Chequeo 2: Verificar si hay hilos bloqueados por un mutex que ya no existe (futura implementación)

        // Chequeo 3: Verificar fugas de memoria (futura implementación)


        System.out.println("SystemHealthMonitor: Escaneo completado. Se encontraron " + anomalies.size() + " anomalías.");
        return anomalies;
    }

    /**
     * Chequeo específico que simula la detección de nuestro problema real.
     */
    private void checkCompilerPresence(List<Anomaly> anomalies) {
        if (!this.hasCompiler) {
            anomalies.add(new Anomaly(
                Anomaly.Severity.CRITICAL,
                "No se detectó el Kit de Desarrollo de Java (JDK).",
                "Instale el JDK en el entorno anfitrión para permitir la compilación. (Ej: 'sudo apt-get install default-jdk')"
            ));
        }
    }
}
