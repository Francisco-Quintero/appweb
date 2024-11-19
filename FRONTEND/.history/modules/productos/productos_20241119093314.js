<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Productos</title>
    <link rel="stylesheet" href="modules/productos/productos.css">
</head>
<body>
    <div class="productos-container">
        <h2>Gestión de Productos</h2>
        
        <div class="acciones-productos">
            <button id="btnAgregarProducto" class="btn btn-primario">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Añadir Producto
            </button>
            <div class="contenedor-busqueda">
                <input type="text" id="busquedaProducto" placeholder="Buscar producto...">
                <button id="btnBuscar" class="btn btn-icon btn-secundario">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
            </div>
        </div>

        <table class="tabla-productos">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Imagen</th>
                    <th>Variantes</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="cuerpoTablaProductos">
                <!-- Los productos se cargarán aquí dinámicamente -->
            </tbody>
        </table>

        <div id="productos-empty" class="productos-empty" style="display: none;">
            <p>No hay productos registrados</p>
        </div>

        <div id="modalProducto" class="modal">
            <div class="contenido-modal">
                <h3 id="tituloModal">Añadir Producto</h3>
                <form id="formularioProducto">
                    <input type="hidden" id="idProducto">
                    <div class="grupo-formulario">
                        <label for="nombreProducto">Nombre:</label>
                        <input type="text" id="nombreProducto" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="descripcionProducto">Descripción:</label>
                        <textarea id="descripcionProducto" required></textarea>
                    </div>
                    <div class="grupo-formulario">
                        <label for="categoriaProducto">Categoría:</label>
                        <input type="text" id="categoriaProducto" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="imagenProducto">URL de la imagen:</label>
                        <input type="url" id="imagenProducto">
                    </div>
                    <div class="acciones-formulario">
                        <button type="submit" class="btn btn-primario">Guardar</button>
                        <button type="button" class="btn btn-secundario" id="btnCancelar">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="modalVariante" class="modal">
            <div class="contenido-modal">
                <h3 id="tituloModalVariante">Añadir Variante</h3>
                <form id="formularioVariante">
                    <input type="hidden" id="idVariante">
                    <input type="hidden" id="idProductoVariante">
                    <div class="grupo-formulario">
                        <label for="descripcionVariante">Descripción:</label>
                        <input type="text" id="descripcionVariante" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="unidadMedida">Unidad de Medida:</label>
                        <input type="text" id="unidadMedida" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="valorMedida">Valor de Medida:</label>
                        <input type="number" id="valorMedida" step="0.01" required>
                    </div>
                    <div class="grupo-formulario">
                        <label for="precioUnitario">Precio Unitario:</label>
                        <input type="number" id="precioUnitario" step="0.01" required>
                    </div>
                    <div class="acciones-formulario">
                        <button type="submit" class="btn btn-primario">Guardar Variante</button>
                        <button type="button" class="btn btn-secundario" id="btnCancelarVariante">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Plantilla para la fila de producto -->
    <template id="plantilla-fila-producto">
        <tr>
            <td>{idProducto}</td>
            <td>{Nombre}</td>
            <td>{Descripcion}</td>
            <td>{categoria}</td>
            <td>
                <img src="{imagenProducto}" alt="{Nombre}" class="producto-imagen" style="max-width: 50px; height: auto;">
            </td>
            <td>{variantes}</td>
            <td>
                <div class="acciones-tabla">
                    <button onclick="window.moduloProductos.editarProducto({idProducto})" 
                            class="btn-icono" title="Editar producto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                        </svg>
                    </button>
                    <button onclick="window.moduloProductos.eliminarProducto({idProducto})" 
                            class="btn-icono btn-icono-eliminar" title="Eliminar producto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            <line x1="10" x2="10" y1="11" y2="17"/>
                            <line x1="14" x2="14" y1="11" y2="17"/>
                        </svg>
                    </button>
                    <button onclick="window.moduloProductos.gestionarVariantes({idProducto})" 
                            class="btn-icono" title="Gestionar variantes">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers">
                            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.91a1 1 0 0 0 0-1.83Z"/>
                            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
                            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    </template>

    <script src="modules/productos/productos.js"></script>
</body>
</html>