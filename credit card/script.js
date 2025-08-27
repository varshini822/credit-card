class CreditCard {
    constructor() {
        this.card = document.querySelector('.card');
        this.form = document.getElementById('paymentForm');
        this.cardNumberParts = document.querySelectorAll('.card-number-part');
        this.cardHolderName = document.querySelector('.card-holder-name');
        this.expiryDate = document.querySelector('.expiry-date');
        this.cvvNumber = document.querySelector('.cvv-number');
        
        this.init();
    }
    
    init() {
        // Event delegation for better performance
        this.form.addEventListener('input', this.handleInput.bind(this));
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Card flip on CVV focus/blur
        const cvvInput = document.getElementById('cvv');
        cvvInput.addEventListener('focus', () => this.card.classList.add('flipped'));
        cvvInput.addEventListener('blur', () => this.card.classList.add('flipped'));
        
        // Flip card when container is clicked (mobile friendly)
        document.querySelector('.card-container').addEventListener('click', (e) => {
            if (!e.target.closest('input')) {
                this.card.classList.toggle('flipped');
            }
        });
        
        // Initialize any existing values
        this.updateCardNumber(document.getElementById('cardNumber').value);
    }
    
    handleInput(e) {
        const target = e.target;
        
        switch(target.id) {
            case 'cardNumber':
                this.formatCardNumber(target);
                break;
            case 'cardHolder':
                this.cardHolderName.textContent = target.value || 'John Doe';
                break;
            case 'expiryDate':
                this.formatExpiryDate(target);
                break;
            case 'cvv':
                this.cvvNumber.textContent = target.value.padEnd(3, '•').replace(/./g, (m) => m === '•' ? '•' : m);
                break;
        }
    }
    
    formatCardNumber(input) {
        // Remove all non-digits
        let value = input.value.replace(/\D/g, '');
        
        // Add space every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        // Update input value
        input.value = value;
        
        // Update card display
        const numbers = value.replace(/\s/g, '');
        
        this.cardNumberParts.forEach((part, index) => {
            const startPos = index * 4;
            const partNumbers = numbers.substring(startPos, startPos + 4);
            
            part.textContent = partNumbers || '••••';
        });
    }
    
    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        input.value = value;
        this.expiryDate.textContent = value || '12/25';
    }
    
    updateCardNumber(value) {
        if (value) {
            const event = { target: { value } };
            this.formatCardNumber(event.target);
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Simple validation
        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }
        
        // Form data collection
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // In a real app, you would send this to your server
        console.log('Payment data:', data);
        
        // Show success feedback
        alert('Payment submitted successfully!');
        this.form.reset();
        this.updateCardNumber('');
        this.card.classList.remove('flipped');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new CreditCard());