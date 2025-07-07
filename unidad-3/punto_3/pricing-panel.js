class PricingPanel extends HTMLElement {
    constructor() {
        super();

        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add('w3-row-padding', 'w3-center'); 
        
        this.panelTitle = document.createElement('h2');
        this.panelTitle.innerText = 'Our Pricing Plans';
        this.panelTitle.classList.add('w3-center', 'w3-margin-bottom'); 
    }

    renderPlans(plansData) {
        while (this.mainContainer.firstChild) {
            this.mainContainer.removeChild(this.mainContainer.firstChild);
        }

        plansData.forEach(plan => {
            const planColumn = document.createElement('div');
            planColumn.classList.add('w3-col', 's12', 'm6', 'l3', 'w3-margin-bottom'); 

            const planCard = document.createElement('div');
            planCard.classList.add('w3-card', 'w3-hover-shadow');

            const cardHeader = document.createElement('header');
            cardHeader.classList.add('w3-container', 'w3-light-grey'); 
            const cardTitle = document.createElement('h3');
            cardTitle.innerText = plan.title;
            cardHeader.appendChild(cardTitle);

            // Lista de características
            const featuresList = document.createElement('ul');
            featuresList.classList.add('w3-ul', 'w3-border-top'); 

            // Precio
            const priceListItem = document.createElement('li');
            priceListItem.classList.add('w3-li', 'w3-xlarge', 'w3-padding-32'); 
            priceListItem.innerText = `$${plan.price}`;
            featuresList.appendChild(priceListItem);

            // Añadir cada característica a la lista
            plan.features.forEach(feature => {
                const featureItem = document.createElement('li');
                featureItem.classList.add('w3-li'); 
                featureItem.innerText = feature;
                featuresList.appendChild(featureItem);
            });

            const cardFooter = document.createElement('footer');
            cardFooter.classList.add('w3-container', 'w3-light-grey', 'w3-padding'); 

            const buyButton = document.createElement('button');
            buyButton.classList.add('w3-button', 'w3-green', 'w3-padding-large'); 
            buyButton.innerText = plan.buttonText || 'Sign Up'; // Texto del botón, con un fallback
            buyButton.onclick = () => alert(`Elegiste el plan ${plan.title}!`);

            cardFooter.appendChild(buyButton);

            // Ensamblar la tarjeta
            planCard.appendChild(cardHeader);
            planCard.appendChild(featuresList);
            planCard.appendChild(cardFooter);

            // Añadir la tarjeta a la columna y la columna al contenedor principal
            planColumn.appendChild(planCard);
            this.mainContainer.appendChild(planColumn);
        });
    }

    connectedCallback() {
        this.appendChild(this.panelTitle);
        this.appendChild(this.mainContainer);

        const examplePlans = [
            {
                title: 'Basic',
                price: '19.99',
                features: ['10GB Storage', '10 Emails', '10 Domains', '1GB Bandwidth'],
                buttonText: 'Sign Up'
            },
            {
                title: 'Pro',
                price: '29.99',
                features: ['25GB Storage', '25 Emails', '25 Domains', '2GB Bandwidth'],
                buttonText: 'Sign Up'
            },
            {
                title: 'Premium',
                price: '49.99',
                features: ['50GB Storage', '50 Emails', '50 Domains', '5GB Bandwidth'],
                buttonText: 'Sign Up'
            },
            {
                title: 'Ultimate',
                price: '99.99',
                features: ['Unlimited Storage', 'Unlimited Emails', 'Unlimited Domains', 'Unlimited Bandwidth'],
                buttonText: 'Sign Up'
            }
        ];
        this.renderPlans(examplePlans);
    }

    disconnectedCallback() {
    }

    adoptedCallback() {}
    connectedMoveCallback() {}
    static get observableAttributes() { return []; }
    attributeChangedCallback(attr, newvalue, oldvalue) {}
}

export { PricingPanel };