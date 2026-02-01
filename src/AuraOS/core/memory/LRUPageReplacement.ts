
// src/AuraOS/core/memory/LRUPageReplacement.ts
import { PageReplacementAlgorithm } from '@/src/AuraOS/core/memory/PageReplacementAlgorithm';

/**
 * Implementación de la estrategia de reemplazo de páginas LRU (Least Recently Used).
 * Mantiene una lista de marcos en memoria, del más reciente al menos reciente.
 */
export class LRUPageReplacement implements PageReplacementAlgorithm {
  private readonly name = "LRU";
  private frameUsage: number[]; // Lista de marcos, el primero es el más reciente.
  private readonly totalFrames: number;

  constructor(totalFrames: number) {
    this.totalFrames = totalFrames;
    this.frameUsage = [];
  }

  onPageLoad(frameNumber: number): void {
    // Cuando una página se carga, se convierte en la más reciente.
    this.frameUsage.unshift(frameNumber);
  }

  onPageAccess(frameNumber: number): void {
    // Cuando se accede a una página, se mueve al frente de la lista (la más reciente).
    const index = this.frameUsage.indexOf(frameNumber);
    if (index > -1) {
      this.frameUsage.splice(index, 1);
      this.frameUsage.unshift(frameNumber);
    }
  }

  findVictimFrame(): number {
    // En LRU, la víctima es la página que está al final de la lista (la menos reciente).
    if (this.frameUsage.length > 0) {
      return this.frameUsage[this.frameUsage.length - 1];
    }
    // Si no hay páginas, teóricamente esto no debería ocurrir si todos los marcos están llenos.
    // Devolvemos -1 o lanzamos un error para indicar una situación inesperada.
    return -1;
  }

  onFrameFree(frameNumber: number): void {
    const index = this.frameUsage.indexOf(frameNumber);
    if (index > -1) {
      this.frameUsage.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getStatus(): string {
    return `LRU Order: [${this.frameUsage.join(', ')}]`;
  }
}
