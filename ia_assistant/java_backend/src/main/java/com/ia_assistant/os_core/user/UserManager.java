package com.ia_assistant.os_core.user;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Gestiona los usuarios y las sesiones en AuraOS.
 * Es responsable de la creación, autenticación y gestión del usuario activo.
 */
public class UserManager {

    private final Map<String, User> users;
    private User currentUser;

    public UserManager() {
        this.users = new HashMap<>();
        this.currentUser = null; // Nadie está logueado al principio
        // Crear el superusuario por defecto
        createRootUser();
        System.out.println("UserManager: Listo. Superusuario 'root' creado.");
    }

    private void createRootUser() {
        User root = new User("root", "root"); // Contraseña simple para la simulación
        users.put(root.getUsername(), root);
    }

    /**
     * Crea un nuevo usuario en el sistema.
     * @param username El nombre del nuevo usuario.
     * @param password La contraseña para el nuevo usuario.
     * @return true si el usuario se creó con éxito, false si ya existe.
     */
    public boolean createUser(String username, String password) {
        if (users.containsKey(username)) {
            System.out.println("Error: El usuario '" + username + "' ya existe.");
            return false;
        }
        User newUser = new User(username, password);
        users.put(username, newUser);
        System.out.println("Usuario '" + username + "' creado con éxito.");
        return true;
    }

    /**
     * Intenta autenticar a un usuario e iniciar su sesión.
     * @param username El nombre de usuario.
     * @param password La contraseña.
     * @return true si el login es exitoso, false en caso contrario.
     */
    public boolean login(String username, String password) {
        Optional<User> userToLogin = findUserByName(username);
        if (userToLogin.isPresent() && userToLogin.get().verifyPassword(password)) {
            this.currentUser = userToLogin.get();
            System.out.println("Login exitoso. ¡Bienvenido, " + username + "!");
            return true;
        }
        System.out.println("Error: Nombre de usuario o contraseña incorrectos.");
        return false;
    }

    /**
     * Cierra la sesión del usuario actual.
     */
    public void logout() {
        if (this.currentUser != null) {
            System.out.println("Cerrando sesión de " + this.currentUser.getUsername() + ".");
            this.currentUser = null;
        }
    }

    public Optional<User> findUserByName(String username) {
        return Optional.ofNullable(users.get(username));
    }

    public Optional<User> getCurrentUser() {
        return Optional.ofNullable(currentUser);
    }
}
