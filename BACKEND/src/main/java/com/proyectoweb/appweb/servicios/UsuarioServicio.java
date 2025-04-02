package com.proyectoweb.appweb.servicios;

import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    public List<Usuario> listarTodos() {
        return usuarioRepositorio.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepositorio.findById(id).orElse(null);
    }

    public Usuario guardar(Usuario usuario) {
        return usuarioRepositorio.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepositorio.deleteById(id);
    }

    public Usuario obtenerPorUserYPassword(String username, String password) {
        System.out.println("Buscando usuario con username: " + username + " y password: " + password);
        Usuario usuario = usuarioRepositorio.findByUsernameAndPassword(username, password).orElse(null);
        if (usuario == null) {
            System.out.println("Usuario no encontrado o credenciales incorrectas");
        } else {
            System.out.println("Usuario encontrado: " + usuario.getUsername());
        }
        return usuario;
    }

    public boolean existeUsername(String username) {
        return usuarioRepositorio.findByUsername(username).isPresent();
    }

}