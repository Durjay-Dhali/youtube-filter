console.log(">>> EXTENSION LOADED: YT Filter V2 <<<");

// Default limit
let MIN_VIEWS = 500000;

// 1. Load User Setting immediately
chrome.storage.local.get(['minViews'], (result) => {
    if (result.minViews) {
        MIN_VIEWS = parseInt(result.minViews);
        console.log(`[YT-Filter] Threshold set to: ${MIN_VIEWS}`);
    }
});

// 2. Listen for changes (so you don't have to reload page to update limit)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.minViews) {
        MIN_VIEWS = changes.minViews.newValue;
        console.log(`[YT-Filter] Updated Threshold to: ${MIN_VIEWS}`);
        // Re-run filter immediately to apply new limit
        runFilter(); 
    }
});

function extractViewsFromText(fullText) {
    if (!fullText) return -1;
    const regex = /\b(\d+(?:\.\d+)?)([KMB]?)\s*views/i;
    const match = fullText.match(regex);
    if (!match) return -1;

    let number = parseFloat(match[1]);
    let multiplierStr = match[2].toUpperCase();
    let multiplier = 1;

    if (multiplierStr === 'K') multiplier = 1000;
    else if (multiplierStr === 'M') multiplier = 1000000;
    else if (multiplierStr === 'B') multiplier = 1000000000;

    return number * multiplier;
}

function runFilter() {
    if (window.location.href.includes('/feed/subscriptions')) return;

    const cards = document.querySelectorAll('ytd-rich-item-renderer');

    cards.forEach(card => {
        // Note: We removed the "data-checked" check so that if you change 
        // the limit in the popup, it can re-evaluate already loaded videos.
        
        const fullText = card.innerText;
        const views = extractViewsFromText(fullText);

        if (views > -1) {
            if (views < MIN_VIEWS) {
                // HIDE VIDEO
                card.style.display = 'none';
            } else {
                // SHOW VIDEO (In case you lowered the limit, we need to bring them back)
                card.style.display = 'block'; 
            }
        }
    });
}

// Run repeatedly
setInterval(runFilter, 2000);
