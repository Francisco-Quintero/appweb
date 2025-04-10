package com.proyectoweb.appweb.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectoweb.appweb.entidades.DetallePedido;
import com.proyectoweb.appweb.entidades.Inventario;
import com.proyectoweb.appweb.entidades.Pedido;
import com.proyectoweb.appweb.entidades.Producto;
import com.proyectoweb.appweb.entidades.Usuario;
import com.proyectoweb.appweb.repositorio.DetallePedidoRepositorio;
import com.proyectoweb.appweb.repositorio.InventarioRepositorio;
import com.proyectoweb.appweb.repositorio.PedidoRepositorio;
import com.proyectoweb.appweb.repositorio.UsuarioRepositorio;

@Service
public class PedidoServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Autowired
    private InventarioRepositorio inventarioRepositorio;


    public List<Pedido> listarTodos() {
        return pedidoRepositorio.findAll();
    }

    public Pedido obtenerPorId(Long id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }

    public Pedido guardar(Pedido pedido) {
        // Procesar cada detalle del pedido
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();

            // Buscar el inventario del producto
            Inventario inventario = inventarioRepositorio.findByProducto(producto)
                    .orElseThrow(() -> new RuntimeException("Inventario no encontrado para el producto: " + producto.getNombre()));

         // Verificar si hay suficiente stock
         if (inventario.getStock() < detalle.getCantidad()) {
            throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre() +
                    ". Stock disponible: " + inventario.getStock() + ", solicitado: " + detalle.getCantidad());
        }

            // Reducir el stock
            inventario.setStock(inventario.getStock() - detalle.getCantidad());
            inventarioRepositorio.save(inventario);

            // Guardar el detalle del pedido
            detalle.setPedido(pedido);
            detalle.setPrecioUnitario(producto.getPrecioUnitario());
        }

        // Guardar el pedido y sus detalles
        return pedidoRepositorio.save(pedido);
    }

    public void eliminar(Long id) {
        pedidoRepositorio.deleteById(id);
    }

    public List<Pedido> listarPorUsuario(Long id) {
        Usuario usuario = usuarioRepositorio.findById(id).orElse(null);
        return pedidoRepositorio.findByUsuario(usuario);
    }

    public List<Pedido> obtenerPedidosPorEstados(List<String> estados) {
        return pedidoRepositorio.findByEstadoPedidoIn(estados);
    }

    public Pedido asignarDomiciliario(Long idPedido, Long idDomiciliario) {
        // Validar que el ID del domiciliario no sea null
        if (idDomiciliario == null) {
            throw new IllegalArgumentException("El ID del domiciliario no puede ser null");
        }
    
        System.out.println("ID del domiciliario recibido: " + idDomiciliario);
    
        // Buscar el pedido por ID
        Pedido pedido = pedidoRepositorio.findById(idPedido).orElse(null);
        if (pedido == null) {
            throw new RuntimeException("Pedido no encontrado con ID: " + idPedido);
        }
    
        // Buscar el usuario por ID
        Usuario usuario = usuarioRepositorio.findById(idDomiciliario).orElse(null);
        if (usuario == null || !usuario.getRol().getNombre().equalsIgnoreCase("domiciliario")) {
            throw new RuntimeException("El usuario no existe o no tiene el rol de domiciliario");
        }
    
        // Asignar el domiciliario al pedido
        pedido.setDomiciliario(usuario);
    
        // Guardar el pedido actualizado
        return pedidoRepositorio.save(pedido);
    }
}