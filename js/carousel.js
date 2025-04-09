class Carousel {
    constructor() {
        this.steps = document.querySelectorAll('.step');
        this.prevBtn = document.querySelector('.prev-step');
        this.nextBtn = document.querySelector('.next-step');
        this.indicators = document.querySelectorAll('.indicator');
        this.stepsContainer = document.querySelector('.steps-container');
        this.currentStep = 0;

        if (this.steps.length === 0) return;

        // Set initial state
        this.steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
                step.style.transform = 'translateX(0)';
                step.style.opacity = '1';
                step.style.visibility = 'visible';
            } else {
                step.classList.remove('active');
                step.style.transform = 'translateX(100%)';
                step.style.opacity = '0';
                step.style.visibility = 'hidden';
            }
        });

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCarousel();
    }

    setupEventListeners() {
        // Button listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.prevStep();
            });
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextStep();
            });
        }

        // Indicator listeners
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToStep(index);
            });
        });

        // Card click listener
        this.stepsContainer.addEventListener('click', (e) => {
            if (e.target.closest('.step')) {
                this.nextStep();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextStep();
            if (e.key === 'ArrowLeft') this.prevStep();
        });
    }

    updateCarousel() {
        // Update steps
        this.steps.forEach((step, index) => {
            if (index === this.currentStep) {
                step.classList.add('active');
                step.style.transform = 'translateX(0)';
                step.style.opacity = '1';
                step.style.visibility = 'visible';
            } else {
                step.classList.remove('active');
                step.style.transform = index < this.currentStep ? 'translateX(-100%)' : 'translateX(100%)';
                step.style.opacity = '0';
                step.style.visibility = 'hidden';
            }
        });

        // Update buttons
        if (this.prevBtn) this.prevBtn.disabled = this.currentStep === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentStep === this.steps.length - 1;

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentStep);
        });
    }

    goToStep(index) {
        if (index === this.currentStep) return;
        this.currentStep = index;
        this.updateCarousel();
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateCarousel();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateCarousel();
        }
    }
}

export default Carousel; 