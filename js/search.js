// Search functionality for Consignment Stores Near Me
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            
            if (query) {
                // Check if it's a zip code
                if (/^\d{5}$/.test(query)) {
                    // For zip code search, redirect to a search results page
                    // In a real implementation, you'd map zip codes to cities
                    alert('Zip code search: ' + query + '. This feature will be implemented with a zip code database.');
                } else {
                    // Try to match with state or city
                    // First, try to find exact state match
                    const states = window.stateData || {};
                    let found = false;
                    
                    // Check for state match
                    for (const [state, data] of Object.entries(states)) {
                        if (state.toLowerCase().includes(query)) {
                            window.location.href = '/' + data.slug + '/';
                            found = true;
                            break;
                        }
                    }
                    
                    // Check for city match
                    if (!found) {
                        for (const [state, data] of Object.entries(states)) {
                            for (const city of data.cities) {
                                if (city.name.toLowerCase().includes(query)) {
                                    window.location.href = '/' + data.slug + '/' + city.slug + '/';
                                    found = true;
                                    break;
                                }
                            }
                            if (found) break;
                        }
                    }
                    
                    if (!found) {
                        alert('No results found for: ' + query);
                    }
                }
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// State and city data for search
window.stateData = {
    'alabama': {
        slug: 'alabama',
        cities: [
            {name: 'Birmingham', slug: 'birmingham'},
            {name: 'Huntsville', slug: 'huntsville'},
            {name: 'Mobile', slug: 'mobile'}
        ]
    },
    'alaska': {
        slug: 'alaska',
        cities: [
            {name: 'Anchorage', slug: 'anchorage'},
            {name: 'Fairbanks', slug: 'fairbanks'}
        ]
    },
    // Add more states and cities dynamically from data
};
