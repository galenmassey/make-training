const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Configuration - Load from .env file
require('dotenv').config();

const config = {
    loginUrl: 'https://www.make.com/en/login',
    outputDir: './make_docs',
    credentials: {
        username: process.env.MAKE_USERNAME,
        password: process.env.MAKE_PASSWORD
    }
};

async function setupBrowser() {
    const browser = await puppeteer.launch({
        headless: false,  // Set to true in production
        defaultViewport: null
    });
    const page = await browser.newPage();
    return { browser, page };
}

async function login(page) {
    await page.goto(config.loginUrl);
    await page.waitForSelector('#email');
    
    // Login
    await page.type('#email', config.credentials.username);
    await page.type('#password', config.credentials.password);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForNavigation();
}

async function extractContent(page, url) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Extract main content
    const content = await page.evaluate(() => {
        // Remove unwanted elements
        const elementsToRemove = document.querySelectorAll('nav, footer, header, script, style');
        elementsToRemove.forEach(el => el.remove());
        
        // Get main content
        const main = document.querySelector('main') || document.body;
        return main.innerText;
    });
    
    return content;
}

async function saveToFile(content, url) {
    // Create filename from URL
    const filename = url
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .substring(0, 100) + '.txt';
        
    const filepath = path.join(config.outputDir, filename);
    await fs.writeFile(filepath, content);
    return filepath;
}

async function main() {
    // Ensure output directory exists
    await fs.mkdir(config.outputDir, { recursive: true });
    
    // Read URLs from urls.txt
    const urls = (await fs.readFile('urls.txt', 'utf-8'))
        .split('\n')
        .filter(url => url.trim());
    
    const { browser, page } = await setupBrowser();
    
    try {
        // Login first
        await login(page);
        
        // Process each URL
        for (const url of urls) {
            try {
                console.log(`Processing: ${url}`);
                const content = await extractContent(page, url);
                const filepath = await saveToFile(content, url);
                console.log(`Saved to: ${filepath}`);
            } catch (error) {
                console.error(`Error processing ${url}:`, error);
            }
        }
    } catch (error) {
        console.error('Script failed:', error);
    } finally {
        await browser.close();
    }
}

main();