(function() {
    console.log('Iniciando carga del módulo de stock');

    function inicializarStock() {
        // Verificar que datosGlobales existe
        if (!window.datosGlobales) {
            console.error('datosGlobales no está definido');
            return;
        }

        // Verificar que el inventario existe
        if (!window.datosGlobales.inventario) {
            console.error('No se encontró el inventario en datosGlobales');
            return;
        }

        console.log('Datos del inventario:', window.datosGlobales.inventario);  

        let inventario = datosGlobales.inventario;

        function cargarInventario() {
            console.log('Cargando inventario en la tabla');
            const cuerpoTabla = document.getElementById('cuerpoTablaStock');
            if (!cuerpoTabla) {
                console.error('No se encontró el elemento cuerpoTablaStock');
                return;
            }

            cuerpoTabla.innerHTML = inventario.map(item => `
                <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                    <td>${item.idInventario}</td>
                    <td>${item.nombreProducto}</td>
                    <td>${item.stock}</td>
                    <td>${item.puntoReorden}</td>
                    <td>${item.fechaActualizacion}</td>
                    <td>
                        <span class="estado-stock ${item.estado.toLowerCase().replace(' ', '-')}">
                            ${item.estado}
                        </span>
                    </td>
                    <td>
                        <button onclick="window.moduloStock.actualizarStock(${item.idInventario})" class="btn btn-secundario">
                            Actualizar
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function verificarAlertasReorden() {
            inventario.forEach(item => {
                if (item.stock <= item.puntoReorden) {
                    console.log(`Alerta: Stock bajo para ${item.nombreProducto}`);
                }
            });
        }

        function actualizarStock(id) {
            console.log('Actualizando stock para ID:', id);
            const item = inventario.find(i => i.idInventario === id);
            if (!item) {
                console.error('No se encontró el item de inventario');
                return;
            }

            document.getElementById('idInventario').value = item.idInventario;
            document.getElementById('idProducto').value = item.idProducto;
            document.getElementById('nombreProducto').value = item.nombreProducto;
            document.getElementById('stockActual').value = item.stock;
            document.getElementById('puntoReorden').value = item.puntoReorden;
            document.getElementById('modalStock').style.display = 'block';
        }

        function buscarInventario() {
            console.log('Buscando en inventario');
            const termino = document.getElementById('busquedaStock').value.toLowerCase();
            const resultados = inventario.filter(item => 
                item.nombreProducto.toLowerCase().includes(termino) ||
                item.estado.toLowerCase().includes(termino)
            );
            
            const cuerpoTabla = document.getElementById('cuerpoTablaStock');
            cuerpoTabla.innerHTML = resultados.map(item => `
                <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                    <td>${item.idInventario}</td>
                    <td>${item.nombreProducto}</td>
                    <td>${item.stock}</td>
                    <td>${item.puntoReorden}</td>
                    <td>${item.fechaActualizacion}</td>
                    <td>
                        <span class="estado-stock ${item.estado.toLowerCase().replace(' ', '-')}">
                            ${item.estado}
                        </span>
                    </td>
                    <td>
                        <button onclick="window.moduloStock.actualizarStock(${item.idInventario})" class="btn btn-secundario">
                            Actualizar
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function configurarEventListeners() {
            console.log('Configurando event listeners');
            
            document.getElementById('btnActualizarStock')?.addEventListener('click', () => {
                document.getElementById('modalStock').style.display = 'block';
            });

            document.getElementById('btnCerrarModal')?.addEventListener('click', () => {
                document.getElementById('modalStock').style.display = 'none';
            });

            document.getElementById('btnBuscar')?.addEventListener('click', buscarInventario);

            document.getElementById('formularioStock')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const idInventario = parseInt(document.getElementById('idInventario').value);
                const stockActual = parseInt(document.getElementById('stockActual').value);
                const puntoReorden = parseInt(document.getElementById('puntoReorden').value);

                const index = inventario.findIndex(i => i.idInventario === idInventario);
                if (index !== -1) {
                    inventario[index] = {
                        ...inventario[index],
                        stock: stockActual,
                        puntoReorden: puntoReorden,
                        fechaActualizacion: new Date().toISOString().split('T')[0],
                        estado: stockActual <= puntoReorden ? 'Bajo stock' : 'Normal'
                    };
                    console.log('Stock actualizado:', inventario[index]);
                    
                    // Actualizar datos globales
                    datosGlobales.inventario = inventario;
                    datosGlobales.guardarEnLocalStorage();
                }

                cargarInventario();
                verificarAlertasReorden();
                document.getElementById('modalStock').style.display = 'none';
            });
        }

        cargarInventario();
        configurarEventListeners();
        verificarAlertasReorden();
        console.log('Módulo de stock cargado completamente');
    }

    // API pública del módulo
    window.moduloStock = {
        inicializar: inicializarStock,
        actualizarStock: function(id) {
            // Esta función se llamará desde el HTML, por lo que necesitamos acceder a datosGlobales
            if (window.datosGlobales) {
                const item = window.datosGlobales.inventario.find(i => i.idInventario === id);
                if (item) {
                    document.getElementById('idInventario').value = item.idInventario;
                    document.getElementById('idProducto').value = item.idProducto;
                    document.getElementById('nombreProducto').value = item.nombreProducto;
                    document.getElementById('stockActual').value = item.stock;
                    document.getElementById('puntoReorden').value = item.puntoReorden;
                    document.getElementById('modalStock').style.display = 'block';
                }
            }
        },
        buscarInventario: function() {
            // Esta función también se llamará desde el HTML
            if (window.datosGlobales) {
                const termino = document.getElementById('busquedaStock').value.toLowerCase();
                const resultados = window.datosGlobales.inventario.filter(item => 
                    item.nombreProducto.toLowerCase().includes(termino) ||
                    item.estado.toLowerCase().includes(termino)
                );
                
                const cuerpoTabla = document.getElementById('cuerpoTablaStock');
                cuerpoTabla.innerHTML = resultados.map(item => `
                    <tr class="${item.stock <= item.puntoReorden ? 'alerta-stock' : ''}">
                        <td>${item.idInventario}</td>
                        <td>${item.nombreProducto}</td>
                        <td>${item.stock}</td>
                        <td>${item.puntoReorden}</td>
                        <td>${item.fechaActualizacion}</td>
                        <td>
                            <span class="estado-stock ${item.estado.toLowerCase().replace(' ', '-')}">
                                ${item.estado}
                            </span>
                        </td>
                        <td>
                            <button onclick="window.moduloStock.actualizarStock(${item.idInventario})" class="btn btn-secundario">
                                Actualizar
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    };

    console.log('Archivo stock.js cargado completamente');
})();