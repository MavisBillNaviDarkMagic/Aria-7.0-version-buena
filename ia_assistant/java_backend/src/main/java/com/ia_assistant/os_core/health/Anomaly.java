package com.ia_assistant.os_core.health;

/**
 * Representa una anomalía o problema detectado en el sistema por el SystemHealthMonitor.
 * Es el "patógeno" que los "glóbulos blancos" identifican.
 */
public class Anomaly {

    public enum Severity {
        LOW,        // Informativo, no requiere acción inmediata.
        MEDIUM,     // Advertencia, podría causar problemas futuros.
        HIGH,       // Error, requiere atención.
        CRITICAL    // Fallo crítico, el sistema puede ser inestable.
    }

    private final Severity severity;
    private final String description;
    private final String recommendation;

    public Anomaly(Severity severity, String description, String recommendation) {
        this.severity = severity;
        this.description = description;
        this.recommendation = recommendation;
    }

    public Severity getSeverity() {
        return severity;
    }

    public String getDescription() {
        return description;
    }

    public String getRecommendation() {
        return recommendation;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s -> Sugerencia: %s", severity, description, recommendation);
    }
}
