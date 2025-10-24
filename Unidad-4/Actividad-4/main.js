// main.js - Actividad 4 (Usuarios con W3.CSS - Corregido)

class SolicitudApiTabla extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // INYECCIÓN CRÍTICA: Cargamos W3.CSS directamente en el Shadow DOM para que sus clases funcionen.
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                /* Estilos propios del componente que no son de W3.CSS */
                button {
                    background-color: #f44336; 
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-bottom: 20px;
                }

                button:hover {
                    opacity: 0.8; 
                }
                
                .loading {
                    color: #007bff;
                    font-style: italic;
                }
            </style>
            
            <button id="solicitarBtn" class="w3-button">Efectuar Solicitud</button>
            <div id="resultado"></div>
        `;

        const boton = this.shadowRoot.getElementById('solicitarBtn');
        const resultadoDiv = this.shadowRoot.getElementById('resultado');

        boton.addEventListener('click', () => this.efectuarSolicitud(resultadoDiv));
    }

    async efectuarSolicitud(resultadoDiv) {
        const url = 'https://jsonplaceholder.typicode.com/users'; // Endpoint de usuarios
        resultadoDiv.innerHTML = '<p class="loading">Cargando datos...</p>';

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error al cargar los datos: ' + response.status);
            }

            const datos = await response.json();
            this.construirTabla(datos, resultadoDiv);

        } catch (error) {
            resultadoDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    }

    /**
     * Construye la tabla de usuarios con las clases de W3.CSS.
     */
    construirTabla(datos, contenedor) {
        // Propiedades del JSON que queremos mostrar y el orden:
        // Las propiedades son las del objeto: id, username, name, email, website, phone
        const propiedadesJSON = ['id', 'username', 'name', 'email', 'website', 'phone']; 
        
        // Encabezados alternativos y en el orden solicitado:
        const encabezadosAlternativos = ['ID', 'Usuario', 'Nombre', 'Correo', 'Web', 'Celular'];

        // 1. Crear el elemento HTMLTableElement
        const tabla = document.createElement('table');
        
        // 2. Aplicar los estilos de W3.CSS (card y hoverable)
        // w3-card-4: Estilo "card" (sombra)
        // w3-hoverable: Resaltado al pasar el mouse por encima
        tabla.className = 'w3-table-all w3-card-4 w3-hoverable'; 
        
        // 3. Crear la cabecera (<thead>)
        const thead = tabla.createTHead();
        const filaHeader = thead.insertRow();
        
        // La fila del encabezado con color (w3-theme-d1 o w3-dark-grey, elegimos w3-dark-grey por simplicidad)
        filaHeader.className = 'w3-dark-grey'; 
        
        // Insertar los nombres alternativos en el orden correcto
        encabezadosAlternativos.forEach(nombre => {
            const th = document.createElement('th');
            th.textContent = nombre;
            filaHeader.appendChild(th);
        });

        // 4. Crear el cuerpo de la tabla (<tbody>)
        const tbody = tabla.createTBody();

        datos.forEach(user => {
            const fila = tbody.insertRow();
            
            // Recorrer las propiedades del JSON
            propiedadesJSON.forEach(prop => {
                const celda = fila.insertCell();
                let valor = user[prop];

                // CONDICIÓN ESPECIAL 1: Dirección de correo como "tag"
                if (prop === 'email') {
                    // w3-tag: Estilo de fondo de color
                    // w3-round: Borde redondeado
                    celda.innerHTML = `<span class="w3-tag w3-round w3-light-blue w3-small">${valor}</span>`;
                
                // CONDICIÓN ESPECIAL 2: Mostrar el sitio web como un enlace
                } else if (prop === 'website') {
                    celda.innerHTML = `<a href="http://${valor}" target="_blank">${valor}</a>`;
                
                // CONDICIÓN OPCIONAL: Limpiar el teléfono si es necesario
                } else if (prop === 'phone') {
                    celda.textContent = valor.split(' x')[0]; // Eliminar la extensión para un resultado más limpio
                }
                else {
                    celda.textContent = valor;
                }
            });
        });

        // 5. Limpiar el contenedor y añadir la tabla
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    }
}

// Definimos el nuevo elemento personalizado
customElements.define('solicitud-api', SolicitudApiTabla);