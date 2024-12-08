const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Configuration
require('dotenv').config();

const config = {
    loginUrl: 'https://www.make.com/en/login',
    outputDir: path.join(os.homedir(), 'Desktop', 'make_docs'),
    credentials: {
        username: process.env.MAKE_USERNAME,
        password: process.env.MAKE_PASSWORD
    },
    retryAttempts: 3,
    retryDelay: 5000, // 5 seconds
    timeout: 30000 // 30 seconds
};

// Enhanced error handling
class ScraperError extends Error {
    constructor(message, type, url = null, details = null) {
        super(message);
        this.name = 'ScraperError';
        this.type = type;
        this.url = url;
        this.details = details;
        this.timestamp = new Date();
    }
}

async function setupBrowser() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized'],
            timeout: config.timeout
        });
        const page = await browser.newPage();
        
        // Setup error handling
        page.on('error', err => {
            throw new ScraperError('Page crashed', 'PAGE_CRASH', null, err);
        });
        
        // Setup request interception
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'document' || request.resourceType() === 'script') {
                request.continue();
            } else {
                request.abort();
            }
        });

        return { browser, page };
    } catch (error) {
        throw new ScraperError('Failed to setup browser', 'BROWSER_SETUP', null, error);
    }
}

async function retryOperation(operation, maxAttempts = config.retryAttempts) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            
            console.log(`Attempt ${attempt} failed, retrying in ${config.retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        }
    }
}

async function login(page) {
    try {
        await retryOperation(async () => {
            await page.goto(config.loginUrl, { waitUntil: 'networkidle0' });
            await page.waitForSelector('#email');
            
            // Clear fields first
            await page.$eval('#email', el => el.value = '');
            await page.$eval('#password', el => el.value = '');
            
            // Type credentials slowly to mimic human behavior
            await page.type('#email', config.credentials.username, {delay: 100});
            await page.type('#password', config.credentials.password, {delay: 100});
            
            await Promise.all([
                page.click('button[type="submit"]'),
                page.waitForNavigation({ waitUntil: 'networkidle0' })
            ]);
        });
        
        // Verify login success
        const loginError = await page.$('.login-error');
        if (loginError) {
            throw new ScraperError('Login failed', 'AUTH_ERROR');
        }
        
    } catch (error) {
        throw new ScraperError('Login failed', 'AUTH_ERROR', config.loginUrl, error);
    }
}

async function extractContent(page, url) {
    try {
        await retryOperation(async () => {
            await page.goto(url, { 
                waitUntil: 'networkidle0',
                timeout: config.timeout
            });
        });
        
        // Wait for content to load
        await page.waitForSelector('body');
        
        // Extract main content
        const content = await page.evaluate(() => {
            // Remove unwanted elements
            const elementsToRemove = document.querySelectorAll(
                'nav, footer, header, script, style, iframe, .cookie-banner, .advertisement'
            );
            elementsToRemove.forEach(el => el.remove());
            
            // Get main content
            const main = document.querySelector('main') || document.querySelector('.content') || document.body;
            return main.innerText;
        });
        
        if (!content.trim()) {
            throw new ScraperError('No content found', 'EMPTY_CONTENT', url);
        }
        
        return content;
        
    } catch (error) {
        throw new ScraperError('Failed to extract content', 'EXTRACTION_ERROR', url, error);
    }
}

async function saveToFile(content, url) {
    try {
        // Create filename from URL
        const filename = url
            .replace(/https?:\/\//, '')
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()
            .substring(0, 100) + '.txt';
            
        const filepath = path.join(config.outputDir, filename);
        
        // Add metadata to content
        const contentWithMetadata = [
            `Source URL: ${url}`,
            `Downloaded: ${new Date().toISOString()}`,
            '---',
            content
        ].join('\n\n');
        
        await fs.writeFile(filepath, contentWithMetadata);
        return filepath;
        
    } catch (error) {
        throw new ScraperError('Failed to save file', 'FILE_SYSTEM_ERROR', url, error);
    }
}

async function createErrorLog(error) {
    const errorLogPath = path.join(config.outputDir, 'scraper_errors.log');
    const errorEntry = [
        `\n[${new Date().toISOString()}]`,
        `Type: ${error.type}`,
        `URL: ${error.url}`,
        `Message: ${error.message}`,
        `Details: ${error.details?.message || 'None'}`,
        '---'
    ].join('\n');
    
    await fs.appendFile(errorLogPath, errorEntry);
}

async function main() {
    let browser;
    
    try {
        // Ensure output directory exists
        await fs.mkdir(config.outputDir, { recursive: true });
        
        // Read URLs from urls.txt
        const urls = (await fs.readFile('urls.txt', 'utf-8'))
            .split('\n')
            .filter(url => url.trim());
        
        const results = {
            successful: 0,
            failed: 0,
            files: []
        };
        
        const { browser: b, page } = await setupBrowser();
        browser = b;
        
        // Login first
        await login(page);
        
        // Process each URL
        for (const url of urls) {
            try {
                console.log(`\nProcessing: ${url}`);
                const content = await extractContent(page, url);
                const filepath = await saveToFile(content, url);
                
                results.successful++;
                results.files.push(filepath);
                
                console.log(`Success: ${filepath}`);
                
            } catch (error) {
                results.failed++;
                await createErrorLog(error);
                console.error(`Error processing ${url}:\n`, error.message);
            }
        }
        
        // Print summary
        console.log('\n=== Scraping Complete ===');
        console.log(`Successful: ${results.successful}`);
        console.log(`Failed: ${results.failed}`);
        console.log(`Files saved to: ${config.outputDir}`);
        
    } catch (error) {
        console.error('Fatal error:', error);
        await createErrorLog(error);
    } finally {
        if (browser) await browser.close();
    }
}

// Run the script
main();