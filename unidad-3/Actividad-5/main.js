import './WCComponents/WCModalDialog.js';
import './WCComponents/WCContactForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-contact-modal');
    const contactModal = document.getElementById('contact-modal');

    openBtn.addEventListener('click', () => {
        contactModal.open();
    });

    contactModal.addEventListener('modal-accepted', () => {
        // Simula envío del formulario
        alert('Su consulta fue recibida. A la brevedad lo contactaremos. Gracias');
    });
});