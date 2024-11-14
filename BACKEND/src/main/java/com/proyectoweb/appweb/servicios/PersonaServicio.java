package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Persona;
import com.proyectoweb.appweb.repositorio.PersonaRepositorio;


@Service
public class PersonaServicio {

    @Autowired
    private PersonaRepositorio personaRepositorio;

    public List<Persona> listarTodos() {
        return personaRepositorio.findAll();
    }

    public Persona obtenerPorId(Long id) {
        return personaRepositorio.findById(id).orElse(null);
    }

    public Persona guardar(Persona persona) {
        return personaRepositorio.save(persona);
    }

    public void eliminar(Long id) {
        personaRepositorio.deleteById(id);
    }
}
