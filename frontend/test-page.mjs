import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE LOG ERROR: ${msg.text()}`);
        } else {
            console.log(`PAGE LOG: ${msg.text()}`);
        }
    });

    page.on('pageerror', exception => {
        console.log(`UNCAUGHT EXCEPTION: ${exception}`);
    });

    try {
        await page.goto('http://localhost:5173/park/investment', { waitUntil: 'networkidle' });
        console.log("Page loaded. HTML extract:");
        const html = await page.content();
        console.log(html.substring(0, 500));
    } catch (e) {
        console.error("Failed to load:", e);
    } finally {
        await browser.close();
    }
})();
