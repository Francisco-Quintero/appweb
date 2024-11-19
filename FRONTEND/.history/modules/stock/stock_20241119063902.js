(function() {
    console.log('Iniciando carga del módulo de stock');

    function inicializarStock() {
        // Verificar que datosGlobales existe y tiene la estructura correcta
        if (typeof window.datosGlobales === 'undefined') {
            console.error('datosGlobales no está definido');
            return;
        }

        // Asegurarse de que inventario existe o inicializarlo como array vacío
        if (!Array.isArray(window.datosGlobales.inventario)) {
            console.log('Inicializando inventario como array vacío');
            window.datosGlobales.inventario = [];
        }

        console.log('Datos del inventario:', window.datosGlobales.inventario);  

        let inventario = window.datosGlobales.inventario;

        function cargarInventario() {
            console.log('Cargando inventario en la tabla');
            const cuerpoTabla = document.getElementById('cuerpoTablaStock');
            if (!cuerpoTabla) {
                console.error('No se encontró el elemento cuerpoTablaStock');
                return;
            }

            // Verificar que inventario es un array antes de usar map
            if (!Array.isArray(inventario)) {
                console.error('El inventario no es un array válido');
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
            if (!Array.isArray(inventario)) return;
            
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
            if (!Array.isArray(inventario)) {
                console.error('El inventario no es un array válido');
                return;
            }

            const termino = document.getElementById('busquedaStock').value.toLowerCase();
            const resultados = inventario.filter(item => 
                item.nombreProducto.toLowerCase().includes(termino) ||
                item.estado.toLowerCase().includes(termino)
            );
            
            const cuerpoTabla = document.getElementById('cuerpoTablaStock');
            if (!cuerpoTabla) return;

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
                    window.datosGlobales.inventario = inventario;
                    window.datosGlobales.guardarEnLocalStorage();
                }

                cargarInventario();
                verificarAlertasReorden();
                document.getElementById('modalStock').style.display = 'none';
            });
        }

        // Asegurarse de que el DOM está cargado antes de inicializar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                cargarInventario();
                configurarEventListeners();
                verificarAlertasReorden();
            });
        } else {
            cargarInventario();
            configurarEventListeners();
            verificarAlertasReorden();
        }

        console.log('Módulo de stock cargado completamente');
    }

    // API pública del módulo
    window.moduloStock = {
        inicializar: inicializarStock,
        actualizarStock: function(id) {
            if (!window.datosGlobales?.inventario) {
                console.error('El inventario no está disponible');
                return;
            }

            const item = window.datosGlobales.inventario.find(i => i.idInventario === id);
            if (item) {
                document.getElementById('idInventario').value = item.idInventario;
                document.getElementById('idProducto').value = item.idProducto;
                document.getElementById('nombreProducto').value = item.nombreProducto;
                document.getElementById('stockActual').value = item.stock;
                document.getElementById('puntoReorden').value = item.puntoReorden;
                document.getElementById('modalStock').style.display = 'block';
            }
        },
        buscarInventario: function() {
            if (!Array.isArray(window.datosGlobales?.inventario)) {
                console.error('El inventario no es un array válido');
                return;
            }

            const termino = document.getElementById('busquedaStock').value.toLowerCase();
            const resultados = window.datosGlobales.inventario.filter(item => 
                item.nombreProducto.toLowerCase().includes(termino) ||
                item.estado.toLowerCase().includes(termino)
            );
            
            const cuerpoTabla = document.getElementById('cuerpoTablaStock');
            if (!cuerpoTabla) return;

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
    };

    // Inicializar el módulo cuando el script se carga
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.moduloStock.inicializar);
    } else {
        window.moduloStock.inicializar();
    }

    console.log('Archivo stock.js cargado completamente');
})();