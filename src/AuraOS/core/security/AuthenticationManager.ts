
// src/AuraOS/core/security/AuthenticationManager.ts

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  username: string;
  email?: string; // El email es opcional para usuarios estándar
  role: UserRole;
}

const ADMIN_EMAIL = 'navidnballstarslegends@gmail.com';
const ADMIN_USERNAME = 'ChristakaKID';

/**
 * Gestiona la autenticación, los usuarios y los roles dentro de AuraOS.
 */
export class AuthenticationManager {
  private users: Map<string, User> = new Map();
  private activationDone = false;

  constructor() {
    // Se crea un usuario 'guest' para el estado inicial antes de cualquier login.
    this.users.set('guest', { username: 'guest', role: 'USER' });
    console.log("AuthenticationManager: Listo para gestionar el acceso.");
  }

  activateAdmin(username: string, email: string): boolean {
    if (this.activationDone) {
      return false;
    }
    if (username === ADMIN_USERNAME && email === ADMIN_EMAIL) {
      const adminUser: User = { username, email, role: 'ADMIN' };
      this.users.set(username, adminUser);
      this.activationDone = true;
      return true;
    }
    return false;
  }

  createUser(username: string, creator: User | null): string {
    if (creator?.role !== 'ADMIN') {
      return "Error: Privilegios insuficientes. Solo los administradores pueden crear usuarios.";
    }
    if (!username || this.users.has(username)) {
      return `Error: El nombre de usuario '${username}' ya existe o no es válido.`;
    }
    this.users.set(username, { username, role: 'USER' });
    return `Usuario estándar '${username}' creado con éxito.`;
  }

  getUser(username: string): User | undefined {
    return this.users.get(username);
  }

  isActivationDone(): boolean {
    return this.activationDone;
  }
}
