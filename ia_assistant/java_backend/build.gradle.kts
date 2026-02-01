
// Aplicar los plugins de Android y Kotlin
plugins {
    id("com.android.application")
    kotlin("android")
}

// Cargar las especificaciones para usarlas en el script
apply(from = "app_specifications.kt")

android {
    // Usar el SDK de compilación definido en las especificaciones
    compileSdk = AppSpecifications.COMPILE_SDK_VERSION

    // Configuración por defecto de la aplicación
    defaultConfig {
        applicationId = AppSpecifications.PACKAGE_NAME
        minSdk = AppSpecifications.MIN_SDK_VERSION
        targetSdk = AppSpecifications.TARGET_SDK_VERSION
        versionCode = AppSpecifications.VERSION_CODE
        versionName = AppSpecifications.VERSION_NAME

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    // Configuración de los tipos de compilación (ej. release, debug)
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    // Opciones de compilación de Java y Kotlin
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }

    // Es necesario especificar la ubicación de los fuentes, ya que no es un proyecto estándar de Android
    sourceSets {
        getByName("main") {
            java.srcDirs("src/main/java")
        }
    }
}

// Dependencias de la aplicación
dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0") // Ajustar versión según necesidad
    implementation("androidx.core:core-ktx:1.9.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.8.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
