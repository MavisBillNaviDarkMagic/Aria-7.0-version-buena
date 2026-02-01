package com.ia_assistant.os_core;

import java.util.Scanner;

/**
 * Representa la shell o interfaz de línea de comandos de AuraOS.
 * Permite a los usuarios interactuar con el sistema operativo simulado.
 */
public class AuraOS_Shell {

    private final Kernel kernel; // Referencia al núcleo del sistema operativo

    /**
     * Constructor de la shell.
     * @param kernel El núcleo del sistema operativo.
     */
    public AuraOS_Shell(Kernel kernel) {
        this.kernel = kernel;
    }
    
    /**
     * Inicia el bucle principal de la shell, que espera y procesa los comandos del usuario.
     */
    public void run() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("AuraOS Shell. Escriba 'exit' para salir.");

        while (true) {
            System.out.print("> ");
            String input = scanner.nextLine();

            if ("exit".equalsIgnoreCase(input.trim())) {
                System.out.println("Saliendo de la shell de AuraOS.");
                break;
            }

            if (!input.trim().isEmpty()) {
                executeCommand(input);
            }
        }
        scanner.close();
    }

    /**
     * Ejecuta un comando introducido por el usuario.
     * @param commandString El comando a ejecutar.
     */
    private void executeCommand(String commandString) {
        // Aquí es donde se analizaría el comando y se interactuaría con el Kernel.
        String[] parts = commandString.trim().split("\s+");
        String command = parts[0].toLowerCase();

        switch (command) {
            case "shutdown":
                kernel.shutdown();
                System.exit(0);
                break;
            default:
                System.out.println("Comando no reconocido: " + command);
        }
    }

    /**
     * Punto de entrada para probar la shell de forma independiente.
     */
    public static void main(String[] args) {
        // En una implementación real, el Kernel crearía e iniciaría la Shell.
        System.out.println("Iniciando AuraOS...");
        Kernel kernel = Kernel.getInstance();
        kernel.boot();
        AuraOS_Shell shell = new AuraOS_Shell(kernel);
        shell.run();
    }
}
