import './WCComponents/WCModalDialog.js';

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-modal-btn');
    const myModal = document.getElementById('my-modal');

    openBtn.addEventListener('click', () => {
        myModal.open();
    });

    myModal.addEventListener('modal-accepted', () => {
        alert('Se aceptó el modal');
    });

    myModal.addEventListener('modal-closed', () => {
        console.log('Se cerró el modal');
    });
});