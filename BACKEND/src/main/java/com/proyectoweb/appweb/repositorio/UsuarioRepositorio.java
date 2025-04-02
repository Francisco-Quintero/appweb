package com.proyectoweb.appweb.repositorio;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyectoweb.appweb.entidades.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    //Optional<Usuario> findByUsernameAndPassword(String username, String password);
    @Query("SELECT u FROM Usuario u WHERE u.username = :username AND u.password = :password")
    Optional<Usuario> findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

    Optional<Usuario> findByUsername(String username);
}

