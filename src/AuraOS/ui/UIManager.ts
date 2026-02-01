
// src/AuraOS/ui/UIManager.ts

/**
 * UIManager para AuraOS.
 * Responsable de renderizar y gestionar todos los aspectos
 * de la interfaz de usuario, como la consola, ventanas y notificaciones.
 */
export class UIManager {
  private history: string[] = [];

  constructor() {
    // Aquí se inicializarían los componentes de la UI (por ejemplo, usando React o un motor de renderizado nativo)
  }

  /**
   * Renderiza la interfaz base de la consola de AuraOS.
   */
  renderBaseUI() {
    console.log("Renderizando la interfaz principal de AuraOS...");
    // Lógica para mostrar la consola, el prompt, etc.
  }

  /**
   * Muestra el mensaje de bienvenida al arrancar.
   * @param message El mensaje a mostrar.
   */
  showWelcomeMessage(message: string) {
    this.addHistory(message);
    this.addHistory("------------------------------------");
  }

  /**
   * Añade una línea al historial de la consola.
   * @param text El texto para añadir.
   */
  addHistory(text: string) {
    this.history.push(text);
    this.updateConsole();
  }

  /**
   * Limpia el historial de la consola.
   */
  clearHistory() {
    this.history = [];
    this.updateConsole();
  }

  /**
   * Actualiza la vista de la consola en la pantalla.
   * En una implementación real, esto actualizaría el DOM o el estado del framework de UI.
   */
  private updateConsole() {
    console.log("--- Consola de AuraOS ---");
    this.history.forEach(line => console.log(line));
    console.log("-------------------------");
  }
}
