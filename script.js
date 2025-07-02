// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Toggle dropdown menu
const menuBtn = document.getElementById('menuBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!menuBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Fetch IP and User Agent
document.addEventListener('DOMContentLoaded', function() {
    // Get User Agent
    const userAgentEl = document.getElementById('user-agent');
    userAgentEl.innerHTML = navigator.userAgent;
    
    // Fetch IP Address
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            document.getElementById('ip-address').textContent = data.ip;
        })
        .catch(() => {
            document.getElementById('ip-address').textContent = 'Failed to fetch';
        });
    
    // Fetch real-time visitor count
    function updateVisitorCount() {
        fetch('index.php?action=get_visitors')
            .then(response => response.json())
            .then(data => {
                const visitorCount = document.getElementById('visitor-count');
                const currentCount = parseInt(visitorCount.textContent) || 0;
                const newCount = parseInt(data.visitors);
                
                if (!isNaN(newCount)) {
                    // Smooth counter animation
                    animateCounter(currentCount, newCount, visitorCount);
                }
            })
            .catch(error => {
                console.error('Error fetching visitor count:', error);
            });
    }
    
    // Initial fetch
    updateVisitorCount();
    
    // Update every 30 seconds
    setInterval(updateVisitorCount, 30000);
    
    // Remove loading animations after content loads
    setTimeout(() => {
        document.querySelectorAll('.loading').forEach(el => {
            el.remove();
        });
    }, 2000);
});

// Counter animation function
function animateCounter(start, end, element) {
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = Math.floor(start + progress * (end - start));
        element.textContent = value.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}
