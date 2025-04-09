// Basic test suite for setup verification
const testSetup = {
    testLazyLoading() {
        console.log('Testing lazy loading...');
        // Test carousel lazy loading
        const carouselSection = document.querySelector('.carousel-section');
        if (!carouselSection) {
            console.error('❌ Carousel section not found');
            return false;
        }

        // Test auth module lazy loading
        const authTriggers = document.querySelectorAll('.auth-trigger');
        if (authTriggers.length === 0) {
            console.error('❌ Auth triggers not found');
            return false;
        }

        console.log('✅ DOM elements for lazy loading verified');
        return true;
    },

    testCSSModules() {
        console.log('Testing CSS modules...');
        const requiredClasses = [
            '.container',
            '.grid',
            '.btn-primary',
            '.card',
            '.mobile-menu'
        ];

        const missingClasses = requiredClasses.filter(className => {
            const element = document.querySelector(className);
            if (!element) {
                console.error(`❌ Missing CSS class: ${className}`);
                return true;
            }
            return false;
        });

        if (missingClasses.length === 0) {
            console.log('✅ All required CSS classes found');
            return true;
        }
        return false;
    },

    testBundleLoading() {
        console.log('Testing bundle loading...');
        const scripts = document.querySelectorAll('script');
        const requiredBundles = ['main.bundle.js', 'dashboard.bundle.js'];
        
        const missingBundles = requiredBundles.filter(bundle => {
            const found = Array.from(scripts).some(script => 
                script.src.includes(bundle)
            );
            if (!found) {
                console.error(`❌ Missing bundle: ${bundle}`);
                return true;
            }
            return false;
        });

        if (missingBundles.length === 0) {
            console.log('✅ All required bundles found');
            return true;
        }
        return false;
    }
};

// Run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Running setup tests...');
    const results = {
        lazyLoading: testSetup.testLazyLoading(),
        cssModules: testSetup.testCSSModules(),
        bundleLoading: testSetup.testBundleLoading()
    };

    console.log('Test Results:', results);
    const allPassed = Object.values(results).every(result => result === true);
    console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed!');
}); 