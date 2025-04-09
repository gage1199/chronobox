export const lazyLoad = (modulePath, callback) => {
    return import(/* webpackChunkName: "[request]" */ `${modulePath}`)
        .then(module => {
            if (callback && typeof callback === 'function') {
                try {
                    return callback(module);
                } catch (error) {
                    console.error(`Error executing callback for module: ${modulePath}`, error);
                    throw error;
                }
            }
            return module;
        })
        .catch(err => {
            console.error(`Error loading module: ${modulePath}`, err);
            // Optionally show user-friendly error message
            const errorElement = document.getElementById('error-container') 
                || document.createElement('div');
            errorElement.id = 'error-container';
            errorElement.className = 'error-message';
            errorElement.textContent = 'Something went wrong. Please try again later.';
            if (!document.getElementById('error-container')) {
                document.body.appendChild(errorElement);
            }
            throw err;
        });
}; 