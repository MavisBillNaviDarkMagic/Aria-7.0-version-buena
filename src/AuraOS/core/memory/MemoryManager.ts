
// src/AuraOS/core/memory/MemoryManager.ts
import { PageReplacementAlgorithm } from '@/src/AuraOS/core/memory/PageReplacementAlgorithm';

/**
 * Gestiona la memoria virtual y física de AuraOS.
 * Simula la paginación, el reemplazo de páginas y la asignación de memoria.
 */
export class MemoryManager {
  private replacementAlgorithm: PageReplacementAlgorithm;
  private physicalMemory: (number | null)[]; // Simula marcos de página físicos. El valor es la página virtual que contiene.
  private pageTable: Map<number, number>; // Mapa de página virtual a marco físico
  private readonly physicalMemorySize: number;

  constructor(algorithm: PageReplacementAlgorithm, physicalMemorySize: number) {
    this.replacementAlgorithm = algorithm;
    this.physicalMemorySize = physicalMemorySize;
    this.physicalMemory = new Array(physicalMemorySize).fill(null);
    this.pageTable = new Map<number, number>();
    console.log(`MemoryManager: Listo. Memoria física: ${physicalMemorySize} marcos.`);
  }

  /**
   * Solicita acceso a una página de memoria para un proceso.
   * @param virtualPageNumber El número de página virtual a la que se quiere acceder.
   * @returns Un string describiendo el resultado de la operación.
   */
  accessPage(virtualPageNumber: number): string {
    // 1. Verificar si la página ya está en memoria (Acierto de página)
    if (this.pageTable.has(virtualPageNumber)) {
      const frameNumber = this.pageTable.get(virtualPageNumber)!;
      this.replacementAlgorithm.onPageAccess(frameNumber);
      return `Acierto de página: La página virtual ${virtualPageNumber} ya está en el marco ${frameNumber}.`;
    }

    // 2. Si no está, es un Fallo de página.
    // Buscar un marco de página libre.
    const freeFrameIndex = this.physicalMemory.findIndex(frame => frame === null);

    if (freeFrameIndex !== -1) {
      // 2a. Hay un marco libre.
      this.physicalMemory[freeFrameIndex] = virtualPageNumber;
      this.pageTable.set(virtualPageNumber, freeFrameIndex);
      this.replacementAlgorithm.onPageLoad(freeFrameIndex);
      return `Fallo de página: Página ${virtualPageNumber} cargada en el marco libre ${freeFrameIndex}.`;
    } else {
      // 2b. No hay marcos libres. Se necesita reemplazo.
      const victimFrame = this.replacementAlgorithm.findVictimFrame();
      if (victimFrame === -1) {
        return "Error: No hay marcos libres y el algoritmo de reemplazo no pudo seleccionar una víctima.";
      }

      // Encontrar qué página virtual estaba usando el marco víctima
      const oldVirtualPage = this.physicalMemory[victimFrame];
      if(oldVirtualPage !== null) {
          this.pageTable.delete(oldVirtualPage);
      }

      // Poner la nueva página en el marco víctima
      this.physicalMemory[victimFrame] = virtualPageNumber;
      this.pageTable.set(virtualPageNumber, victimFrame);
      this.replacementAlgorithm.onPageAccess(victimFrame); // Tratarlo como un acceso para actualizar su estado

      return `Fallo de página: Memoria llena. Página ${oldVirtualPage} (en marco ${victimFrame}) reemplazada por página ${virtualPageNumber}.`;
    }
  }

  /**
   * Obtiene el estado actual de la memoria.
   * @returns Un objeto con el estado de la memoria física y la tabla de páginas.
   */
  getMemoryStatus(): object {
    return {
      algorithm: this.replacementAlgorithm.getName(),
      algorithmStatus: this.replacementAlgorithm.getStatus(),
      physicalMemory: this.physicalMemory,
      pageTable: Object.fromEntries(this.pageTable),
    };
  }
}
