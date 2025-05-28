package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyectoweb.appweb.entidades.Rol;
import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.servicios.RolServicio;
import com.proyectoweb.appweb.servicios.UsuarioServicio;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/usuarios")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private RolServicio rolServicio;

    // Listar todos los usuarios
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioServicio.listarTodos();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public Usuario obtenerPorId(@PathVariable Long id) {
        return usuarioServicio.obtenerPorId(id);
    }

    // Guardar un nuevo usuario
    @PostMapping("/guardar")
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioServicio.guardar(usuario);
    }

    // Eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioServicio.eliminar(id);
    }

    // Login simple
    // @PostMapping("/login")
    // public ResponseEntity<?> autenticar(@RequestBody Usuario credenciales) {
    //     Usuario usuario = usuarioServicio.obtenerPorUserYPassword(credenciales.getUsername(),
    //             credenciales.getPassword());
    //     if (usuario != null) {
    //         return ResponseEntity.ok(usuario); // Retorna el usuario autenticado
    //     }
    //     // Retorna un mensaje de error con el código 401
    //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //             .body(Map.of("error", "Credenciales inválidas"));
    // }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> autenticar(@RequestBody Usuario credenciales) {
        Usuario usuario = usuarioServicio.obtenerPorUserYPassword(
                credenciales.getUsername(),
                credenciales.getPassword());

        if (usuario != null) {
            // Crear respuesta estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", usuario);
            response.put("redirect", obtenerRedireccionPorRol(usuario.getRol().getNombre()));

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "success", false,
                        "error", "Credenciales inválidas"));
    }

    private String obtenerRedireccionPorRol(String rol) {
        return switch (rol.toLowerCase()) {
            case "administrador" -> "/admin";
            case "domiciliario" -> "/delivery";
            default -> "/"; // Cliente
        };
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario nuevoUsuario) {
        if (usuarioServicio.existeUsername(nuevoUsuario.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        // Buscar el rol de cliente
        Rol rolCliente = rolServicio.obtenerPorNombre("cliente");
        if (rolCliente == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "El rol de cliente no está configurado"));
        }

        nuevoUsuario.setRol(rolCliente);
        Usuario usuarioGuardado = usuarioServicio.guardar(nuevoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
    }

    @PostMapping("/registrar-domiciliario")
    public ResponseEntity<?> registrarDomiciliario(@RequestBody Usuario nuevoUsuario) {
        try {
            // Verificar si el username ya existe
            if (usuarioServicio.existeUsername(nuevoUsuario.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El nombre de usuario ya está en uso"));
            }

            // Buscar el rol de domiciliario
            Rol rolDomiciliario = rolServicio.obtenerPorNombre("domiciliario");
            if (rolDomiciliario == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "El rol de domiciliario no está configurado"));
            }

            // Asignar el rol al usuario
            nuevoUsuario.setRol(rolDomiciliario);

            // Guardar el usuario
            Usuario usuarioGuardado = usuarioServicio.guardar(nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor: " + e.getMessage()));
        }
    }
}