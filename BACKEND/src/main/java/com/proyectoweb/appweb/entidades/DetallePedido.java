package com.proyectoweb.appweb.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "detalle_pedido")
@Getter
@Setter
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido; // Relación con el pedido

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto; // Relación con el producto

    @Column(name = "cantidad")
    private int cantidad; // Cantidad comprada de este producto

    @Column(name = "precio_unitario")
    private Double precioUnitario; // Precio unitario en el momento de la compra
}