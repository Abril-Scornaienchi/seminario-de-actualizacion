// Importa tu WebComponent desde su archivo
import { CustomCalculator } from './custom-calculator.js';

// Define el custom element
customElements.define('x-calculator', CustomCalculator);

// Función que se ejecuta cuando la página está completamente cargada
function initApp() {
    // Crea una instancia de tu WebComponent y la añade al body
    document.body.appendChild(new CustomCalculator());
}

// Ejecuta initApp cuando la ventana ha cargado completamente
window.onload = initApp;