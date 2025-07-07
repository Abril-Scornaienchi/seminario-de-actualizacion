import { CustomCalculator } from './custom-calculator.js';
import { LoginForm } from './login-form.js';
import { PricingPanel } from './pricing-panel.js';

customElements.define('x-calculator', CustomCalculator);
customElements.define('login-form', LoginForm);
customElements.define('pricing-panel', PricingPanel);

function initApp() {
    // Añadir la calculadora
    document.body.appendChild(new CustomCalculator());

    // Añadir el formulario de login
    document.body.appendChild(new LoginForm());

    // Añadir el panel de precios
    document.body.appendChild(new PricingPanel());
}

// Ejecuta initApp cuando la ventana ha cargado completamente
window.onload = initApp;