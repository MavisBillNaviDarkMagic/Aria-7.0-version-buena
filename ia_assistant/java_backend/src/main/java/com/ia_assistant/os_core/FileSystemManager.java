
package com.ia_assistant.os_core;

import com.ia_assistant.os_core.user.User;
import com.ia_assistant.os_core.user.UserManager;

import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

/**
 * Manages a simulated file system with ownership and permissions.
 * Now decoupled from the Kernel during construction.
 */
public class FileSystemManager {

    private final Node root;
    private final UserManager userManager; // Direct reference to UserManager

    // --- Node Classes (unchanged) ---

    private abstract static class Node {
        String name;
        User owner;
        int permissions; // 4: read, 2: write. 6 = rw, 4 = r, 0 = --

        Node(String name, User owner, int permissions) {
            this.name = name;
            this.owner = owner;
            this.permissions = permissions;
        }
        abstract boolean isDirectory();
    }

    private static class FileNode extends Node {
        StringBuilder content;
        FileNode(String name, User owner) {
            super(name, owner, 6); // Default: read/write for owner
            this.content = new StringBuilder();
        }
        @Override boolean isDirectory() { return false; }
    }

    private static class DirectoryNode extends Node {
        Map<String, Node> children;
        DirectoryNode(String name, User owner) {
            super(name, owner, 7); // Default: rwx for owner (7 for consistency)
            this.children = new TreeMap<>();
        }
        @Override boolean isDirectory() { return true; }
    }

    // --- Constructor: Receives dependencies instead of fetching them --- 

    public FileSystemManager(UserManager userManager) {
        this.userManager = userManager;
        // The owner of the root directory is the 'root' superuser
        User rootUser = this.userManager.findUserByName("root")
            .orElseThrow(() -> new IllegalStateException("Root user not found during FS initialization."));
        this.root = new DirectoryNode("/", rootUser);
        System.out.println("FileSystemManager: Ready. Ownership and permissions enabled.");
    }

    // --- Permission Logic (uses the direct userManager reference) ---

    private boolean hasPermission(Node node, User user, int requiredPermission) {
        if (user.getUsername().equals("root")) {
            return true;
        }
        if (node.owner.getUid() == user.getUid()) {
            return (node.permissions & requiredPermission) == requiredPermission;
        }
        return false;
    }

    private String formatPermissions(int perms) {
        StringBuilder sb = new StringBuilder();
        sb.append((perms & 4) == 4 ? 'r' : '-');
        sb.append((perms & 2) == 2 ? 'w' : '-');
        sb.append((perms & 1) == 1 ? 'x' : '-'); // Placeholder for execute
        return sb.toString();
    }

    // --- File System Commands (now use the local userManager) ---

    public void listDirectory(String path) {
        User currentUser = userManager.getCurrentUser().orElse(null);
        if (currentUser == null) { 
             System.out.println("Error: No user is currently logged in.");
             return;
        }

        System.out.println("Contents of '" + path + "':");
        Node node = findNode(path);
        if (node == null || !node.isDirectory()) {
            System.out.println("Error: Path does not exist or is not a directory.");
            return;
        }

        DirectoryNode dir = (DirectoryNode) node;
        if (dir.children.isEmpty()) {
            System.out.println("(directory is empty)");
        } else {
            System.out.printf("%-10s %-8s %s%n", "Permissions", "Owner", "Name");
            System.out.println("--------------------------------");
            dir.children.forEach((name, child) -> {
                String type = child.isDirectory() ? "/" : "";
                System.out.printf("%-10s %-8s %s%s%n", 
                    formatPermissions(child.permissions), 
                    child.owner.getUsername(), 
                    name, 
                    type);
            });
        }
    }

    public boolean createFile(String path) {
        User currentUser = userManager.getCurrentUser().orElse(null);
        if (currentUser == null) { 
            System.out.println("Error: No user is currently logged in.");
            return false;
        }

        int lastSlash = path.lastIndexOf('/');
        if (lastSlash == -1) return false;
        String parentPath = (lastSlash == 0) ? "/" : path.substring(0, lastSlash);
        String fileName = path.substring(lastSlash + 1);

        Node parentNode = findNode(parentPath);
        if (parentNode == null || !parentNode.isDirectory()) {
            System.out.println("Error: The parent directory does not exist.");
            return false;
        }

        if (!hasPermission(parentNode, currentUser, 2)) { // Write permission needed in parent
            System.out.println("Error: Permission denied to write in '" + parentPath + "'.");
            return false;
        }

        DirectoryNode parentDir = (DirectoryNode) parentNode;
        if (parentDir.children.containsKey(fileName)) {
            System.out.println("Error: A file or directory with that name already exists.");
            return false;
        }

        parentDir.children.put(fileName, new FileNode(fileName, currentUser));
        System.out.println("File created: " + path);
        return true;
    }

    public void writeFile(String path, String content) {
        User currentUser = userManager.getCurrentUser().orElse(null);
        if (currentUser == null) return;

        Node node = findNode(path);
        if (node == null || node.isDirectory()) {
            System.out.println("Error: File does not exist or is a directory.");
            return;
        }
        if (!hasPermission(node, currentUser, 2)) { // Write permission
            System.out.println("Error: Permission denied to write to '" + path + "'.");
            return;
        }
        ((FileNode) node).content = new StringBuilder(content);
        System.out.println("Content written to " + path);
    }

    public void readFile(String path) {
        User currentUser = userManager.getCurrentUser().orElse(null);
        if (currentUser == null) return;

        Node node = findNode(path);
        if (node == null || node.isDirectory()) {
            System.out.println("Error: File does not exist or is a directory.");
            return;
        }
        if (!hasPermission(node, currentUser, 4)) { // Read permission
            System.out.println("Error: Permission denied to read '" + path + "'.");
            return;
        }
        System.out.println("--- Contents of " + path + " ---");
        System.out.println(((FileNode) node).content.toString());
        System.out.println("-------------------------");
    }
    
    public void changePermissions(String path, int newPerms) {
        User currentUser = userManager.getCurrentUser().orElse(null);
        if (currentUser == null) return;

        Node node = findNode(path);
        if (node == null) {
            System.out.println("Error: File does not exist.");
            return;
        }
        if (!node.owner.getUsername().equals(currentUser.getUsername()) && !currentUser.getUsername().equals("root")) {
            System.out.println("Error: Permission denied. Only the owner or root can change permissions.");
            return;
        }
        node.permissions = newPerms;
        System.out.println("Permissions for '" + path + "' changed to " + newPerms);
    }

    private Node findNode(String path) {
        if (path.equals("/")) return root;
        String[] parts = path.startsWith("/") ? path.substring(1).split("/") : path.split("/");
        Node current = root;
        for (String part : parts) {
            if (part.isEmpty()) continue;
            if (current == null || !current.isDirectory()) return null;
            current = ((DirectoryNode) current).children.get(part);
        }
        return current;
    }
}
