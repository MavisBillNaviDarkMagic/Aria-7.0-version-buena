
// src/main.ts

import { Kernel } from '@/src/AuraOS/core/kernel';

/**
 * Punto de entrada principal de la aplicación.
 * Aquí es donde se instancia y arranca el Kernel de AuraOS.
 */

// Crea una instancia del Kernel.
const kernel = new Kernel();

// Arranca el sistema operativo.
kernel.boot();
