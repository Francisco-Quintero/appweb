package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectoweb.appweb.entidades.Usuario;

public interface UsuarioRepositorio extends JpaRepository <Usuario, Long> {
    Usuario findByUserAndPassword(String user, String password);

}
