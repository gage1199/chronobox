// Carousel Module
export default {
    init() {
        this.currentStep = 0;
        this.steps = document.querySelectorAll('.step');
        this.setupCarousel();
        this.addEventListeners();
    },

    setupCarousel() {
        this.steps.forEach((step, index) => {
            step.dataset.step = index;
            step.style.transform = `translateX(${100 * index}%)`;
        });
    },

    addEventListeners() {
        document.querySelector('.next-step')?.addEventListener('click', () => this.nextStep());
        document.querySelector('.prev-step')?.addEventListener('click', () => this.prevStep());
    },

    goToStep(index) {
        this.currentStep = index;
        this.steps.forEach(step => {
            step.style.transform = `translateX(${100 * (step.dataset.step - index)}%)`;
        });
    },

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.goToStep(this.currentStep + 1);
        }
    },

    prevStep() {
        if (this.currentStep > 0) {
            this.goToStep(this.currentStep - 1);
        }
    }
}; 