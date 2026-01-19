console.log(">>> EXTENSION LOADED: YouTube View Filter (Regex Mode) <<<");

const MIN_VIEWS = 500000;

// Helper: Extracts "1.2M" or "400K" from a raw string like "Video Title 1.2M views 5 hours ago"
function extractViewsFromText(fullText) {
    if (!fullText) return -1;
    
    // Regex explanation:
    // \b          -> word boundary (start of number)
    // (\d+(\.\d+)?) -> captures numbers like 100 or 1.5
    // ([KMB]?)    -> captures the multiplier K, M, or B (optional)
    // \s*views    -> looks for the word "views" after the number
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
    // Safety check for Subscriptions page
    if (window.location.href.includes('/feed/subscriptions')) return;

    // Select all video cards (Home feed style)
    const cards = document.querySelectorAll('ytd-rich-item-renderer');

    cards.forEach(card => {
        // Optimization: Skip if already checked
        if (card.getAttribute('data-checked') === 'true') return;

        // Get all text inside the card (Title, views, author, etc.)
        const fullText = card.innerText;
        
        // Try to find the view count in that text pile
        const views = extractViewsFromText(fullText);

        if (views > -1) {
            // Log what we found to the console
            // console.log(`Found: ${views} views in card`);

            if (views < MIN_VIEWS) {
                // --- DEBUG MODE: RED BORDER ---
                // Instead of display: none, we use a border to verify it works.
                // card.style.border = "5px solid red";
                card.style.opacity = "0.5";
                
                // UNCOMMENT THE LINE BELOW TO ACTUALLY HIDE
                card.style.display = 'none';
            }
        }

        // Mark checked so we don't re-process
        card.setAttribute('data-checked', 'true');
    });
}

// Run repeatedly to catch scroll
setInterval(runFilter, 2000);
