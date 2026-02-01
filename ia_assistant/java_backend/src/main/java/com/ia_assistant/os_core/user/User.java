package com.ia_assistant.os_core.user;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Representa un usuario dentro de AuraOS.
 * Cada usuario tiene un nombre, un ID de usuario (UID) y un hash de su contraseña.
 */
public class User {

    private static int nextUid = 0;

    private final int uid;
    private final String username;
    private final String passwordHash;

    public User(String username, String password) {
        this.uid = nextUid++;
        this.username = username;
        this.passwordHash = hashPassword(password);
    }

    /**
     * Verifica si la contraseña proporcionada coincide con la del usuario.
     * @param password La contraseña a verificar.
     * @return true si la contraseña es correcta, false en caso contrario.
     */
    public boolean verifyPassword(String password) {
        return this.passwordHash.equals(hashPassword(password));
    }

    /**
     * Un método de hashing simple para ofuscar la contraseña.
     * En un sistema real, se usarían algoritmos más fuertes y "salting".
     */
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            // Esto no debería ocurrir con SHA-256
            throw new RuntimeException(e);
        }
    }

    // Getters
    public int getUid() {
        return uid;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public String toString() {
        return "User[UID=" + uid + ", Username='" + username + "']";
    }
}
