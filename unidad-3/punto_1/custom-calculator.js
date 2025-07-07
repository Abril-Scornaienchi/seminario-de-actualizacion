class CustomCalculator extends HTMLElement {
    constructor() {
        super();

        this.display = document.createElement('input');
        this.display.type = 'text';
        this.display.readOnly = true; 

        this.btn0 = document.createElement('button'); 
        this.btn0.innerText = '0';
        this.btn1 = document.createElement('button'); 
        this.btn1.innerText = '1';
        this.btn2 = document.createElement('button'); 
        this.btn2.innerText = '2';
        this.btn3 = document.createElement('button'); 
        this.btn3.innerText = '3';
        this.btn4 = document.createElement('button'); 
        this.btn4.innerText = '4';
        this.btn5 = document.createElement('button'); 
        this.btn5.innerText = '5';
        this.btn6 = document.createElement('button'); 
        this.btn6.innerText = '6';
        this.btn7 = document.createElement('button'); 
        this.btn7.innerText = '7';
        this.btn8 = document.createElement('button'); 
        this.btn8.innerText = '8';
        this.btn9 = document.createElement('button'); 
        this.btn9.innerText = '9';
        this.btnPlus = document.createElement('button'); 
        this.btnPlus.innerText = '+';
        this.btnMinus = document.createElement('button'); 
        this.btnMinus.innerText = '-';
        this.btnMultiply = document.createElement('button'); 
        this.btnMultiply.innerText = '*';
        this.btnDivide = document.createElement('button'); 
        this.btnDivide.innerText = '/';
        this.btnDot = document.createElement('button'); 
        this.btnDot.innerText = '.';
        this.btnEquals = document.createElement('button'); 
        this.btnEquals.innerText = '=';
        this.btnClear = document.createElement('button'); 
        this.btnClear.innerText = 'C';
    }

    onNumberOrDotClick(event) {
        this.display.value += event.target.innerText;
    }

    onOperatorClick(event) {
        this.display.value += event.target.innerText;
    }

    onEqualsClick(event) {
        try {
            this.display.value = eval(this.display.value || '0');
        } catch (e) {
            this.display.value = 'Error';
        }
    }

    onClearClick(event) {
        this.display.value = '';
    }

    connectedCallback() {
        this.appendChild(this.display);
        const createRow = () => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.marginBottom = '5px';
            return row;
        };

        let row1 = createRow();
        row1.appendChild(this.btn7);
        row1.appendChild(this.btn8);
        row1.appendChild(this.btn9);
        row1.appendChild(this.btnDivide);
        this.appendChild(row1);

        let row2 = createRow();
        row2.appendChild(this.btn4);
        row2.appendChild(this.btn5);
        row2.appendChild(this.btn6);
        row2.appendChild(this.btnMultiply);
        this.appendChild(row2);

        let row3 = createRow();
        row3.appendChild(this.btn1);
        row3.appendChild(this.btn2);
        row3.appendChild(this.btn3);
        row3.appendChild(this.btnMinus);
        this.appendChild(row3);

        let row4 = createRow();
        row4.appendChild(this.btn0);
        row4.appendChild(this.btnDot);
        row4.appendChild(this.btnClear);
        row4.appendChild(this.btnPlus);
        this.appendChild(row4);

        let row5 = createRow();
        row5.appendChild(this.btnEquals);
        this.appendChild(row5);

        this.btn0.onclick = this.onNumberOrDotClick.bind(this);
        this.btn1.onclick = this.onNumberOrDotClick.bind(this);
        this.btn2.onclick = this.onNumberOrDotClick.bind(this);
        this.btn3.onclick = this.onNumberOrDotClick.bind(this);
        this.btn4.onclick = this.onNumberOrDotClick.bind(this);
        this.btn5.onclick = this.onNumberOrDotClick.bind(this);
        this.btn6.onclick = this.onNumberOrDotClick.bind(this);
        this.btn7.onclick = this.onNumberOrDotClick.bind(this);
        this.btn8.onclick = this.onNumberOrDotClick.bind(this);
        this.btn9.onclick = this.onNumberOrDotClick.bind(this);
        this.btnDot.onclick = this.onNumberOrDotClick.bind(this);
        this.btnPlus.onclick = this.onOperatorClick.bind(this);
        this.btnMinus.onclick = this.onOperatorClick.bind(this);
        this.btnMultiply.onclick = this.onOperatorClick.bind(this);
        this.btnDivide.onclick = this.onOperatorClick.bind(this);
        this.btnEquals.onclick = this.onEqualsClick.bind(this);
        this.btnClear.onclick = this.onClearClick.bind(this);
    }

    disconnectedCallback() {
    }

    adoptedCallback() {}
    connectedMoveCallback() {}
    static get observableAttributes() { return []; }
    attributeChangedCallback(attr, newvalue, oldvalue) {}
}

export { CustomCalculator };