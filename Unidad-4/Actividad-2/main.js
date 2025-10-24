// main.js - Actividad 2: Fetch (Sin innerHTML)

class SolicitudApi extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // 1. Crear estilos
        const style = document.createElement('style');
        style.textContent = `
            button {
                background-color: #007BFF;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin-bottom: 15px;
            }
            button:hover {
                background-color: #0056b3;
            }
            textarea {
                width: 100%;
                height: 200px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-family: monospace;
                resize: vertical;
                box-sizing: border-box;
            }
        `;

        // 2. Crear botón y área de texto
        const boton = document.createElement('button');
        boton.id = 'solicitarBtn';
        boton.textContent = 'Efectuar Solicitud';

        const areaDeTexto = document.createElement('textarea');
        areaDeTexto.id = 'resultado';
        areaDeTexto.setAttribute('readonly', '');

        // 3. Agregar elementos al Shadow DOM
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(boton);
        this.shadowRoot.appendChild(areaDeTexto);

        // 4. Añadir el evento
        boton.addEventListener('click', () => this.efectuarSolicitud(areaDeTexto));
    }

    async efectuarSolicitud(areaDeTexto) {
        // ... (Lógica de Fetch se mantiene igual) ...
        const url = 'https://jsonplaceholder.typicode.com/posts/1';
        areaDeTexto.value = 'Cargando...';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar los datos: ' + response.status);
            }
            const datos = await response.json();
            areaDeTexto.value = JSON.stringify(datos, null, 2);
        } catch (error) {
            areaDeTexto.value = 'Error: ' + error.message;
        }
    }
}

customElements.define('solicitud-api', SolicitudApi);