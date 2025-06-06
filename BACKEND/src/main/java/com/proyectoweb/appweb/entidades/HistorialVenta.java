package com.proyectoweb.appweb.entidades;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "historial_venta")
@Getter
@Setter
public class HistorialVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idHistorial;

    @Column(name = "fecha_venta")
    private Date fechaVenta;

    @Column(name = "pedidos_completados")
    private int pedidosCompletados;

    @OneToMany(mappedBy = "historialVenta", cascade = CascadeType.ALL)
    private List<Pedido> pedidos;
}

