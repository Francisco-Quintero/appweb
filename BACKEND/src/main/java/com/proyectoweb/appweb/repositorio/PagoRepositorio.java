package com.proyectoweb.appweb.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyectoweb.appweb.entidades.Pago;

public interface PagoRepositorio extends JpaRepository <Pago, Long> {

}
