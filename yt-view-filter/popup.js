// Load the current setting when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['minViews'], (result) => {
        // Default to 500,000 if not set
        const currentLimit = result.minViews || 500000;
        document.getElementById('viewLimit').value = currentLimit;
    });
});

// Save the new setting when button is clicked
document.getElementById('saveBtn').addEventListener('click', () => {
    const limit = document.getElementById('viewLimit').value;
    
    // Save to Chrome Storage
    chrome.storage.local.set({ minViews: parseInt(limit) }, () => {
        // Show "Saved!" message
        const status = document.getElementById('status');
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
    });
});
