// Error monitoring utility
class ErrorMonitor {
    constructor() {
        this.errors = [];
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Handle uncaught errors
        window.onerror = (message, source, lineno, colno, error) => {
            this.logError('uncaught', { message, source, lineno, colno, error });
        };

        // Handle unhandled promise rejections
        window.onunhandledrejection = (event) => {
            this.logError('unhandled-promise', {
                message: event.reason?.message || 'Promise rejected',
                error: event.reason
            });
        };

        // Handle network errors
        window.addEventListener('error', (event) => {
            if (event.target instanceof HTMLElement) {
                this.logError('resource-error', {
                    message: `Failed to load resource: ${event.target.src || event.target.href}`,
                    element: event.target.tagName
                });
            }
        }, true);
    }

    logError(type, details) {
        const errorLog = {
            type,
            timestamp: new Date().toISOString(),
            details,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.errors.push(errorLog);
        console.error('Error logged:', errorLog);

        // Show user-friendly error message if needed
        this.showErrorMessage(type, details.message);

        // In production, you would send this to your error tracking service
        if (process.env.NODE_ENV === 'production') {
            this.sendToErrorService(errorLog);
        }
    }

    showErrorMessage(type, message) {
        const container = document.getElementById('error-container') 
            || document.createElement('div');
        container.id = 'error-container';
        container.className = 'error-message';
        
        const userMessage = this.getUserFriendlyMessage(type, message);
        container.textContent = userMessage;

        if (!document.getElementById('error-container')) {
            document.body.appendChild(container);
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            container.style.opacity = '0';
            setTimeout(() => container.remove(), 500);
        }, 5000);
    }

    getUserFriendlyMessage(type, message) {
        switch (type) {
            case 'resource-error':
                return 'Failed to load some content. Please refresh the page.';
            case 'unhandled-promise':
                return 'Something went wrong. Please try again.';
            case 'uncaught':
                return 'An error occurred. Please refresh the page.';
            default:
                return message || 'Something went wrong. Please try again later.';
        }
    }

    sendToErrorService(errorLog) {
        // Implement your error reporting service integration here
        // Example: Sentry, LogRocket, etc.
        console.log('Sending to error service:', errorLog);
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }
}

export const errorMonitor = new ErrorMonitor();
export default errorMonitor; 