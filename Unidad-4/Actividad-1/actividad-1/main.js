// main.js - Actividad 1: XMLHttpRequest (Sin innerHTML)

class SolicitudApi extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // 1. Crear el contenedor de estilos
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
                margin-bottom: 10px;
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
        
        // 2. Crear el botón
        const boton = document.createElement('button');
        boton.id = 'solicitarBtn';
        boton.textContent = 'Efectuar Solicitud';

        // 3. Crear el área de texto
        const areaDeTexto = document.createElement('textarea');
        areaDeTexto.id = 'resultado';
        areaDeTexto.setAttribute('readonly', '');

        // 4. Agregar elementos al Shadow DOM
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(boton);
        this.shadowRoot.appendChild(areaDeTexto);

        // 5. Añadir el evento
        boton.addEventListener('click', () => this.efectuarSolicitud(areaDeTexto));
    }

    efectuarSolicitud(areaDeTexto) {
        // ... (Lógica de XMLHttpRequest se mantiene igual) ...
        const xhr = new XMLHttpRequest();
        const url = 'https://jsonplaceholder.typicode.com/posts/1';

        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const datos = JSON.parse(xhr.responseText);
                areaDeTexto.value = JSON.stringify(datos, null, 2);
            } else {
                areaDeTexto.value = 'Error al cargar los datos: ' + xhr.status;
            }
        };
        xhr.onerror = function() {
            areaDeTexto.value = 'Error de red. No se pudo conectar al servidor.';
        };
        areaDeTexto.value = 'Cargando...';
        xhr.send();
    }
}

customElements.define('solicitud-api', SolicitudApi);