// main.js - Actividad 3: Tabla (Sin innerHTML)

class SolicitudApiTabla extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // 1. Crear estilos (CSS de la tabla y botón)
        const style = document.createElement('style');
        style.textContent = `
            button {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin-bottom: 20px;
            }
            button:hover {
                background-color: #1e7e34;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
                font-size: 0.9em;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
                color: #333;
            }
            tbody tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .loading {
                color: #007bff;
                font-style: italic;
            }
        `;

        // 2. Crear botón
        const boton = document.createElement('button');
        boton.id = 'solicitarBtn';
        boton.textContent = 'Efectuar Solicitud';

        // 3. Crear div de resultado (contenedor de la tabla)
        const resultadoDiv = document.createElement('div');
        resultadoDiv.id = 'resultado';
        
        // 4. Agregar elementos al Shadow DOM
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(boton);
        this.shadowRoot.appendChild(resultadoDiv);

        // 5. Añadir el evento
        boton.addEventListener('click', () => this.efectuarSolicitud(resultadoDiv));
    }

    async efectuarSolicitud(resultadoDiv) {
        const url = 'https://jsonplaceholder.typicode.com/posts';
        
        // Usamos textContent en lugar de innerHTML para el mensaje de carga
        resultadoDiv.textContent = 'Cargando datos...'; 

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar los datos: ' + response.status);
            }
            const datos = await response.json();
            this.construirTabla(datos, resultadoDiv);
        } catch (error) {
            // Creamos un párrafo para el error
            const errorP = document.createElement('p');
            errorP.style.color = 'red';
            errorP.textContent = `Error: ${error.message}`;

            // Limpiamos el contenedor y añadimos el mensaje
            while (resultadoDiv.firstChild) { resultadoDiv.removeChild(resultadoDiv.firstChild); }
            resultadoDiv.appendChild(errorP);
        }
    }

    construirTabla(datos, contenedor) {
        const tabla = document.createElement('table');
        const thead = tabla.createTHead();
        const filaHeader = thead.insertRow();
        
        const columnas = ['User ID', 'ID', 'Título']; 
        const propiedades = ['userId', 'id', 'title']; 
        
        columnas.forEach(nombre => {
            const th = document.createElement('th');
            th.textContent = nombre;
            filaHeader.appendChild(th);
        });

        const tbody = tabla.createTBody();
        const datosLimitados = datos.slice(0, 10); 

        datosLimitados.forEach(post => {
            const fila = tbody.insertRow();
            
            propiedades.forEach(prop => {
                const celda = fila.insertCell();
                // Usamos textContent para insertar el valor
                celda.textContent = post[prop];
            });
        });

        // Limpiar el contenedor sin innerHTML:
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
        contenedor.appendChild(tabla);
    }
}

customElements.define('solicitud-api', SolicitudApiTabla);