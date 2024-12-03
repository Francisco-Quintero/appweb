package com.proyectoweb.appweb.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.servicios.UsuarioServicio;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/api/usuarios")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioServicio.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario obtenerPorId(@PathVariable Long id) {
        return usuarioServicio.obtenerPorId(id);
    }

    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioServicio.guardar(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioServicio.eliminar(id);
    }

    @PostMapping("/login")
    public Usuario autenticar(@RequestBody Usuario credenciales) {
    Usuario usuario = usuarioServicio.obtenerPorUserYPassword(credenciales.getUser(), credenciales.getPassword());
    if (usuario != null && "domiciliario".equalsIgnoreCase(usuario.getRol())) {
        return usuario; // Retorna el usuario autenticado
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas o rol no autorizado");
}

}

