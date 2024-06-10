const { expect } = require('@playwright/test');
const { default: playwrightApiMatchers } = require('odottaa');
expect.extend(playwrightApiMatchers);

const { devices } = require('@playwright/test');

const isHeadless = true; // Set to true for headless mode

const config = {
    retries: 0, // number of retries for failed tests
    fullyParallel: true, // Enable full parallelism
    workers: 2,          // Global workers for all test files
    timeout: 800 * 1000, // Global test timeout
    expect: {
        timeout: 300000, // Timeout for individual expect assertions
        workers: 2,
    },
    use: {
        browserName: 'chromium',
        headless: isHeadless,
        screenshot: 'only-on-failure',
        video: 'off',
        trace: 'off',
        ...devices['Desktop Chrome'],
        contextOptions: {
            permissions: ['clipboard-read', 'clipboard-write'],
            logLevel: 'info',
        },
    },
    reporters: [
        ['html', { outputFolder: 'playwright-report/index.html', open: 'never' }],
        ['allure-playwright'],
        ['./reporter.js']
    ],

};

module.exports = config;
