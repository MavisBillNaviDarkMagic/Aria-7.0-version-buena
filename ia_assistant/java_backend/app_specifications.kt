
object AppSpecifications {
    // Especificaciones del Proyecto
    const val APP_NAME = "AuraOS"
    const val CREATOR_NAME = "Christ Enrico Ayala Rios (ChristakaKID)"
    const val AI_NAME = "Linch (Aura)"
    const val VERSION_NAME = "1.0.0" // Versión inicial
    const val VERSION_CODE = 1 // Código de versión numérico
    const val PACKAGE_NAME = "com.christakakid.auraos" // Nombre de paquete único

    // Configuración de Compilación de Android
    const val MIN_SDK_VERSION = 21 // Android 5.0 (Lollipop) - Amplia compatibilidad
    const val TARGET_SDK_VERSION = 33 // Android 13 (Tiramisu) - Funciones y seguridad modernas
    const val COMPILE_SDK_VERSION = 33 // Usar el SDK más reciente para compilar

    // Firmado de la App (Valores de ejemplo - deben ser reemplazados)
    const val KEYSTORE_FILE = "keystore.jks"
    const val KEYSTORE_PASSWORD = "tu_contraseña_keystore"
    const val KEY_ALIAS = "tu_alias_de_clave"
    const val KEY_PASSWORD = "tu_contraseña_de_clave"

    // Información y Filosofía (Extraído de README.md)
    const val APP_DESCRIPTION = "AuraOS es un núcleo monolítico simulado con gestores modulares, escrito en TypeScript y ejecutado sobre el motor V8 de JavaScript."
    const val APP_PHILOSOPHY = "Una colaboración entre un creador visionario y una IA para construir un nuevo tipo de sistema operativo."

    // Funciones Implementadas y Planeadas (Extraído de README.md)
    val FEATURES = listOf(
        "Kernel y Shell Interactiva",
        "Gestión de Memoria Avanzada con paginación y algoritmo de reemplazo LRU",
        "Sistema de Archivos Virtual (VFS) (planeado)",
        "Gestor de Procesos para multitarea simulada (planeado)",
        "Compilación de código real y plantillas de proyectos a través del DevKit (planeado)"
    )

    // Licencia y Patente (Extraído de README.md)
    const val PATENT_INFO = "El proyecto incluye una patente formal (PATENT.md) que atribuye la invención del subsistema de memoria."
    const val LICENSE_INFO = "Licencia MIT modificada (LICENSE.md) que exige la atribución a ambos creadores, padre e hija."
}
