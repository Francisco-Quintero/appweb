package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectoweb.appweb.entidades.Suministro;
import com.proyectoweb.appweb.repositorio.SuministroRepositorio;

@Service
public class SuministroServicio {
    
    @Autowired
    private SuministroRepositorio suministroRepositorio;

    public List<Suministro> listarTodos() {
        return suministroRepositorio.findAll();
    }

    public Suministro obtenerPorId(Long id) {
        return suministroRepositorio.findById(id).orElse(null);
    }

    public Suministro guardar(Suministro suministro) {
        return suministroRepositorio.save(suministro);
    }
    
    public List<Suministro> guardarTodos(List<Suministro> suministros) {
        return suministroRepositorio.saveAll(suministros);
    }

    public void eliminar(Long id) {
        suministroRepositorio.deleteById(id);
    }
}
