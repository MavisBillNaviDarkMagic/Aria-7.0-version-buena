
// src/AuraOS/core/memory/PageReplacementAlgorithm.ts

/**
 * Define el contrato para los algoritmos de reemplazo de páginas.
 * Inspirado en la arquitectura de backend de Java.
 */
export interface PageReplacementAlgorithm {
  /**
   * Encuentra un marco "víctima" para reemplazar según la estrategia del algoritmo.
   * @returns El número del marco a ser reemplazado.
   */
  findVictimFrame(): number;

  /**
   * Notifica al algoritmo que una página nueva ha sido cargada en un marco.
   * @param frameNumber El número del marco donde se cargó la página.
   */
  onPageLoad(frameNumber: number): void;

  /**
   * Notifica al algoritmo que se ha accedido a una página que ya estaba en memoria.
   * Esencial para algoritmos como LRU.
   * @param frameNumber El número del marco al que se accedió.
   */
  onPageAccess(frameNumber: number): void;

  /**
   * Notifica al algoritmo que un marco ha sido liberado.
   * @param frameNumber El número del marco liberado.
   */
  onFrameFree(frameNumber: number): void;

  /**
   * Obtiene el nombre de la estrategia (ej. "FIFO", "LRU").
   * @returns El nombre del algoritmo.
   */
  getName(): string;

  /**
   * Devuelve una representación del estado interno del algoritmo (ej. la cola o lista).
   * @returns Un string que describe el estado.
   */
  getStatus(): string;
}
