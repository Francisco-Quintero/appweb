package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectoweb.appweb.entidades.Persona;

public interface PersonaRepositorio extends JpaRepository <Persona, Long> {

}
