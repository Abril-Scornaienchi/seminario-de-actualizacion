// main.js - Componente Refactorizado (Botón 100% visible - sin función auxiliar)

import { UserService } from './api-service.js';

class SolicitudApiTabla extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.modal = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const sRoot = this.shadowRoot;

        // 1. CONFIGURACIÓN DE ESTILOS Y W3.CSS
        
        // Carga de W3.CSS
        const linkCSS = document.createElement('link');
        linkCSS.setAttribute('rel', 'stylesheet');
        linkCSS.setAttribute('href', 'https://www.w3schools.com/w3css/4/w3.css');
        sRoot.appendChild(linkCSS);
        
        // Estilos internos
        const style = document.createElement('style');
        style.textContent = `
            button { background-color: #f44336; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-bottom: 20px; }
            button:hover { opacity: 0.8; }
            .loading { color: #007bff; font-style: italic; }
            .w3-table-all tr { cursor: pointer; }
            .w3-table-all thead tr { cursor: default; }
        `;
        sRoot.appendChild(style);

        // --- 2. ELEMENTOS PRINCIPALES (Botón y Contenedor) ---
        
        // 🚨 Creación y Anexión del BOTÓN (la clave) 🚨
        const boton = document.createElement('button');
        boton.id = 'solicitarBtn';
        boton.className = 'w3-button';
        boton.textContent = 'Efectuar Solicitud';
        sRoot.appendChild(boton); // <<--- Añadido directo al Shadow Root

        // Contenedor de Resultados
        const resultadoDiv = document.createElement('div');
        resultadoDiv.id = 'resultado';
        sRoot.appendChild(resultadoDiv);
        
        // --- 3. ESTRUCTURA COMPLETA DEL MODAL ---
        
        const modalDetalles = document.createElement('div');
        modalDetalles.id = 'modalDetalles';
        modalDetalles.className = 'w3-modal';
        sRoot.appendChild(modalDetalles); // Añadido al Shadow Root
        this.modal = modalDetalles;

        const modalContent = document.createElement('div');
        modalContent.className = 'w3-modal-content w3-card-4 w3-animate-top';
        modalContent.style.maxWidth = '500px';
        modalDetalles.appendChild(modalContent);

        const header = document.createElement('header');
        header.className = 'w3-container w3-teal';
        modalContent.appendChild(header);
        
        const closeSpan = document.createElement('span');
        closeSpan.id = 'closeModal';
        closeSpan.className = 'w3-button w3-display-topright';
        closeSpan.textContent = '×';
        header.appendChild(closeSpan);
        
        const h2 = document.createElement('h2');
        h2.textContent = 'Detalles de Usuario ';
        header.appendChild(h2);
        
        const spanId = document.createElement('span');
        spanId.id = 'modal-id';
        h2.appendChild(spanId);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'w3-container';
        modalContent.appendChild(bodyDiv);
        
        const pContent = document.createElement('p');
        pContent.id = 'modal-content';
        pContent.textContent = 'Cargando...';
        bodyDiv.appendChild(pContent);

        const footer = document.createElement('footer');
        footer.className = 'w3-container w3-teal';
        modalContent.appendChild(footer);
        
        const pFooter = document.createElement('p');
        pFooter.textContent = 'Información Adicional';
        footer.appendChild(pFooter);

        // --- 4. ASIGNAR EVENTOS Y REFERENCIAS ---
        closeSpan.onclick = () => {
            this.modal.style.display = 'none';
        };

        boton.addEventListener('click', () => this.efectuarSolicitud(resultadoDiv));
    }

    // --- LÓGICA DE DATOS Y CONSTRUCCIÓN (Mismos que antes) ---

    async efectuarSolicitud(resultadoDiv) {
        while (resultadoDiv.firstChild) { resultadoDiv.removeChild(resultadoDiv.firstChild); }
        const loadingP = document.createElement('p');
        loadingP.className = 'loading';
        loadingP.textContent = 'Cargando datos...';
        resultadoDiv.appendChild(loadingP);

        try {
            const datos = await UserService.fetchAllUsers();
            this.construirTabla(datos, resultadoDiv);
        } catch (error) {
            while (resultadoDiv.firstChild) { resultadoDiv.removeChild(resultadoDiv.firstChild); }
            const errorP = document.createElement('p');
            errorP.style.color = 'red';
            errorP.textContent = `Error: ${error.message}`;
            resultadoDiv.appendChild(errorP);
        }
    }

    construirTabla(datos, contenedor) {
        const propiedadesJSON = ['id', 'username', 'name', 'email', 'website', 'phone']; 
        const encabezadosAlternativos = ['ID', 'Usuario', 'Nombre', 'Correo', 'Web', 'Celular'];

        while (contenedor.firstChild) { contenedor.removeChild(contenedor.firstChild); }
        
        const tabla = document.createElement('table');
        tabla.className = 'w3-table-all w3-card-4 w3-hoverable'; 
        contenedor.appendChild(tabla);

        const thead = tabla.createTHead();
        const filaHeader = thead.insertRow();
        filaHeader.className = 'w3-dark-grey'; 
        
        encabezadosAlternativos.forEach(nombre => {
            const th = document.createElement('th');
            th.textContent = nombre;
            filaHeader.appendChild(th);
        });

        const tbody = tabla.createTBody();

        datos.forEach(user => {
            const fila = tbody.insertRow();
            fila.addEventListener('click', () => this.mostrarDetallesModal(user.id));
            
            propiedadesJSON.forEach(prop => {
                const celda = fila.insertCell();
                let valor = user[prop];

                if (prop === 'email') {
                    const emailTag = document.createElement('span');
                    emailTag.className = 'w3-tag w3-round w3-light-blue w3-small';
                    emailTag.textContent = valor;
                    celda.appendChild(emailTag);
                } else if (prop === 'website') {
                    const link = document.createElement('a');
                    link.setAttribute('href', `http://${valor}`);
                    link.setAttribute('target', '_blank');
                    link.onclick = (e) => e.stopPropagation(); 
                    link.textContent = valor;
                    celda.appendChild(link);
                } else if (prop === 'phone') {
                    celda.textContent = valor.split(' x')[0];
                }
                else {
                    celda.textContent = valor;
                }
            });
        });
    }
    
    async mostrarDetallesModal(userId) {
        const modalContent = this.shadowRoot.getElementById('modal-content');
        const modalId = this.shadowRoot.getElementById('modal-id');

        this.modal.style.display = 'block';
        modalId.textContent = `(ID: ${userId})`;
        
        while (modalContent.firstChild) { modalContent.removeChild(modalContent.firstChild); }
        modalContent.textContent = 'Cargando detalles del usuario...';

        try {
            const userDetails = await UserService.fetchUserDetails(userId);
            const { address, company } = userDetails;
            
            while (modalContent.firstChild) { modalContent.removeChild(modalContent.firstChild); }

            // Creamos elementos y usamos innerHTML SÓLO para formato (<i>, <strong>)
            const h4Company = document.createElement('h4');
            h4Company.innerHTML = '<i class="w3-margin-right w3-text-teal">🏢</i>Compañía';
            modalContent.appendChild(h4Company);
            
            const pName = document.createElement('p');
            pName.innerHTML = `<strong>Nombre:</strong> ${company.name}`;
            modalContent.appendChild(pName);
            
            const pCatch = document.createElement('p');
            pCatch.innerHTML = `<strong>Lema:</strong> <em>"${company.catchPhrase}"</em>`;
            modalContent.appendChild(pCatch);
            
            modalContent.appendChild(document.createElement('hr'));

            const h4Address = document.createElement('h4');
            h4Address.innerHTML = '<i class="w3-margin-right w3-text-teal">📍</i>Dirección';
            modalContent.appendChild(h4Address);

            const pStreet = document.createElement('p');
            pStreet.innerHTML = `<strong>Calle:</strong> ${address.street}`;
            modalContent.appendChild(pStreet);
            
            const pCity = document.createElement('p');
            pCity.innerHTML = `<strong>Ciudad:</strong> ${address.city}`;
            modalContent.appendChild(pCity);

            const pZip = document.createElement('p');
            pZip.innerHTML = `<strong>Código Postal:</strong> ${address.zipcode}`;
            modalContent.appendChild(pZip);
            
            const pGeo = document.createElement('p');
            pGeo.innerHTML = `<strong>Geo:</strong> (${address.geo.lat}, ${address.geo.lng})`;
            modalContent.appendChild(pGeo);

        } catch (error) {
            modalContent.textContent = `No se pudieron cargar los detalles: ${error.message}`;
        }
    }
}

customElements.define('solicitud-api', SolicitudApiTabla);