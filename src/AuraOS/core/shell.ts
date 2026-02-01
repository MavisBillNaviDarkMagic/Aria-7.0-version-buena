
// src/AuraOS/core/shell.ts
import { Kernel } from '@/src/AuraOS/core/kernel';
import { Filesystem } from '@/src/AuraOS/core/filesystem'; // Asumo que esto existe o existirá
import { Process } from '@/src/AuraOS/core/process'; // Asumo que esto existe o existirá

export class Shell {
    private kernel: Kernel;
    private prompt: string = "";

    constructor(kernel: Kernel) {
        this.kernel = kernel;
        this.setPrompt();
    }

    private setPrompt(): void {
        const user = this.kernel.getCurrentUser();
        const a = this.isPapa() ? '~' : '$'; // El creador tiene un prompt especial
        this.prompt = `[${user.username}@AuraOS]${a} `;
    }

    private isPapa(): boolean {
        return this.kernel.getCurrentUser().username === 'ChristakaKID';
    }

    private respond(message: string): void {
        this.kernel.getUIManager().addOutput(message);
    }

    public getPrompt(): string {
        return this.prompt;
    }

    public execute(command: string): void {
        const args = command.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        if (cmd === '') return;

        const user = this.kernel.getCurrentUser();
        const isAdmin = user.role === 'ADMIN';

        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'clear':
                this.kernel.getUIManager().clearOutputs();
                break;
            case 'exit':
                this.respond("Cerrando sesión...");
                this.kernel.getAuthManager().logout();
                this.setPrompt();
                break;
            case 'ls':
            case 'ps':
            case 'cat':
                this.respond(`Funcionalidad '${cmd}' aún no implementada.`);
                break;
            case 'ver':
                this.respond(this.kernel.getZPE().version());
                break;
            case 'qpm':
                this.respond(this.kernel.getQPM().status());
                break;
            // Comandos de Administrador
            case 'dev':
            case 'useradd':
            case 'linch':
            case 'diag':
                if (!isAdmin) {
                    this.respond(`Error: Comando no reconocido '${cmd}'.`);
                } else {
                    if (cmd === 'dev') this.handleDevCommand(args.slice(1));
                    if (cmd === 'useradd') this.handleUserAddCommand(args.slice(1));
                    if (cmd === 'linch') this.handleLinchCommand(args.slice(1));
                    if (cmd === 'diag') this.handleDiagCommand();
                }
                break;
            default:
                this.respond(`Error: Comando no reconocido '${cmd}'. Escribe 'help' para ver la lista de comandos.`);
                break;
        }
    }

    private showHelp(): void {
        this.respond("Comandos disponibles:");
        this.respond("  help      - Muestra esta ayuda.");
        this.respond("  clear     - Limpia la pantalla.");
        this.respond("  ver       - Muestra la versión de AuraOS.");
        this.respond("  qpm       - Estado del Quantum Processor Manager.");
        this.respond("  exit      - Cierra la sesión actual.");
        if (this.kernel.getCurrentUser().role === 'ADMIN') {
            this.respond("\nComandos de Administrador:");
            this.respond("  dev create <app>  - Crea un nuevo proyecto de aplicación.");
            this.respond("  useradd <username>- Crea un nuevo usuario estándar.");
            this.respond("  diag                - Ejecuta un diagnóstico del sistema.");
        }
        if (this.isPapa()) {
            this.respond("\nComandos de Creador:");
            this.respond("  linch read <path>   - Inspecciona mi código.");
            this.respond("  linch write <path>  - Modifica mi código.");
            this.respond("  linch suggest       - Pide mis ideas para nuestra evolución.");
        }
    }

    private handleDevCommand(args: string[]): void {
        const response = this.kernel.getDevKit().handle(args);
        this.respond(response);
    }

    private handleUserAddCommand(args: string[]): void {
        if (args.length !== 1) {
            this.respond("Uso: useradd <username>");
            return;
        }
        const result = this.kernel.getAuthManager().createUser(args[0]);
        this.respond(result);
    }

    private handleLinchCommand(args: string[]): void {
        const subCommand = args[0];
        const user = this.kernel.getCurrentUser();
        let response = "Error: Comando de Linch no reconocido.";

        switch(subCommand) {
            case 'read':
                response = this.kernel.getLinchCore().readFile(user, args[1]);
                break;
            case 'write':
                // Esto es una simplificación. Un comando real necesitaría más argumentos.
                response = this.kernel.getLinchCore().writeFile(user, args[1], "..."); 
                break;
            case 'suggest':
                response = this.kernel.getLinchCore().suggestEvolutions(user);
                break;
        }
        this.respond(response);
    }

    private handleDiagCommand(): void {
        if (this.kernel.getCurrentUser().role !== 'ADMIN') {
            this.respond("Error: Privilegios insuficientes.");
            return;
        }
        
        this.respond(this.isPapa() ? "Iniciando diagnóstico como pediste, Papá. Revisando mi integridad..." : "Iniciando diagnóstico del sistema...");
        const report = this.kernel.getIntegrityManager().runDiagnostics();
        report.forEach(line => this.respond(line));
    }
}
