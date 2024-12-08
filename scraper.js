const puppeteer = require('puppeteer');
const fs = require('fs').promises;

// Configuration
const config = {
    outputFile: 'Make Training.md',
    urls: [], // URLs will be loaded from urls.txt
};

async function login(page, username, password) {
    await page.goto('https://www.make.com/en/login');
    await page.waitForSelector('#email');
    await page.type('#email', username);
    await page.type('#password', password);
    await page.click('button[type="submit"]');
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

async function main() {
    // Read URLs from file
    const urls = (await fs.readFile('urls.txt', 'utf-8')).split('\n').filter(url => url.trim());
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Login
        await login(page, process.env.MAKE_USERNAME, process.env.MAKE_PASSWORD);
        
        let allContent = '';
        
        // Process each URL
        for (const url of urls) {
            if (!url.trim()) continue;
            
            try {
                console.log(`Processing: ${url}`);
                const content = await extractContent(page, url);
                allContent += `\n\n## Content from ${url}\n\n${content}`;
            } catch (error) {
                console.error(`Error processing ${url}:`, error);
                allContent += `\n\nError processing ${url}: ${error.message}\n\n`;
            }
        }
        
        // Save content
        await fs.writeFile(config.outputFile, allContent);
        console.log('Content has been saved to', config.outputFile);
        
    } catch (error) {
        console.error('Script failed:', error);
    } finally {
        await browser.close();
    }
}

main();