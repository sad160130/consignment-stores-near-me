// Search functionality for Consignment Stores Near Me
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const query = searchInput.value.trim().toLowerCase();
            
            if (query === '') {
                alert('Please enter a search term');
                return;
            }
            
            // Basic search logic - redirect to appropriate pages
            handleSearch(query);
        });
    }
});

function handleSearch(query) {
    // State mappings
    const states = {
        'alabama': '/alabama/', 'al': '/alabama/',
        'alaska': '/alaska/', 'ak': '/alaska/',
        'arizona': '/arizona/', 'az': '/arizona/',
        'arkansas': '/arkansas/', 'ar': '/arkansas/',
        'california': '/california/', 'ca': '/california/',
        'colorado': '/colorado/', 'co': '/colorado/',
        'connecticut': '/connecticut/', 'ct': '/connecticut/',
        'delaware': '/delaware/', 'de': '/delaware/',
        'florida': '/florida/', 'fl': '/florida/',
        'georgia': '/georgia/', 'ga': '/georgia/',
        'hawaii': '/hawaii/', 'hi': '/hawaii/',
        'idaho': '/idaho/', 'id': '/idaho/',
        'illinois': '/illinois/', 'il': '/illinois/',
        'indiana': '/indiana/', 'in': '/indiana/',
        'iowa': '/iowa/', 'ia': '/iowa/',
        'kansas': '/kansas/', 'ks': '/kansas/',
        'kentucky': '/kentucky/', 'ky': '/kentucky/',
        'louisiana': '/louisiana/', 'la': '/louisiana/',
        'maine': '/maine/', 'me': '/maine/',
        'maryland': '/maryland/', 'md': '/maryland/',
        'massachusetts': '/massachusetts/', 'ma': '/massachusetts/',
        'michigan': '/michigan/', 'mi': '/michigan/',
        'minnesota': '/minnesota/', 'mn': '/minnesota/',
        'mississippi': '/mississippi/', 'ms': '/mississippi/',
        'missouri': '/missouri/', 'mo': '/missouri/',
        'montana': '/montana/', 'mt': '/montana/',
        'nebraska': '/nebraska/', 'ne': '/nebraska/',
        'nevada': '/nevada/', 'nv': '/nevada/',
        'new hampshire': '/new-hampshire/', 'nh': '/new-hampshire/',
        'new jersey': '/new-jersey/', 'nj': '/new-jersey/',
        'new mexico': '/new-mexico/', 'nm': '/new-mexico/',
        'new york': '/new-york/', 'ny': '/new-york/',
        'north carolina': '/north-carolina/', 'nc': '/north-carolina/',
        'north dakota': '/north-dakota/', 'nd': '/north-dakota/',
        'ohio': '/ohio/', 'oh': '/ohio/',
        'oklahoma': '/oklahoma/', 'ok': '/oklahoma/',
        'oregon': '/oregon/', 'or': '/oregon/',
        'pennsylvania': '/pennsylvania/', 'pa': '/pennsylvania/',
        'rhode island': '/rhode-island/', 'ri': '/rhode-island/',
        'south carolina': '/south-carolina/', 'sc': '/south-carolina/',
        'south dakota': '/south-dakota/', 'sd': '/south-dakota/',
        'tennessee': '/tennessee/', 'tn': '/tennessee/',
        'texas': '/texas/', 'tx': '/texas/',
        'utah': '/utah/', 'ut': '/utah/',
        'vermont': '/vermont/', 'vt': '/vermont/',
        'virginia': '/virginia/', 'va': '/virginia/',
        'washington': '/washington/', 'wa': '/washington/',
        'west virginia': '/west-virginia/', 'wv': '/west-virginia/',
        'wisconsin': '/wisconsin/', 'wi': '/wisconsin/',
        'wyoming': '/wyoming/', 'wy': '/wyoming/'
    };
    
    // Popular cities mapping
    const cities = {
        'los angeles': '/california/los-angeles/',
        'new york': '/new-york/new-york-city/',
        'new york city': '/new-york/new-york-city/',
        'nyc': '/new-york/new-york-city/',
        'chicago': '/illinois/chicago/',
        'houston': '/texas/houston/',
        'phoenix': '/arizona/phoenix/',
        'philadelphia': '/pennsylvania/philadelphia/',
        'san antonio': '/texas/san-antonio/',
        'san diego': '/california/san-diego/',
        'dallas': '/texas/dallas/',
        'san jose': '/california/san-jose/',
        'austin': '/texas/austin/',
        'jacksonville': '/florida/jacksonville/',
        'san francisco': '/california/san-francisco/',
        'indianapolis': '/indiana/indianapolis/',
        'columbus': '/ohio/columbus/',
        'charlotte': '/north-carolina/charlotte/',
        'seattle': '/washington/seattle/',
        'denver': '/colorado/denver/',
        'boston': '/massachusetts/boston/',
        'nashville': '/tennessee/nashville/',
        'miami': '/florida/miami/',
        'tampa': '/florida/tampa/',
        'orlando': '/florida/orlando/',
        'atlanta': '/georgia/atlanta/',
        'detroit': '/michigan/detroit/',
        'memphis': '/tennessee/memphis/',
        'baltimore': '/maryland/baltimore/',
        'milwaukee': '/wisconsin/milwaukee/'
    };
    
    // Check if it's a ZIP code (5 digits)
    if (/^\d{5}$/.test(query)) {
        // For demo purposes, redirect to homepage with search parameter
        window.location.href = '/?zip=' + encodeURIComponent(query);
        return;
    }
    
    // Check for state match
    if (states[query]) {
        window.location.href = states[query];
        return;
    }
    
    // Check for city match
    if (cities[query]) {
        window.location.href = cities[query];
        return;
    }
    
    // Check if query contains state name + city
    for (let state in states) {
        if (query.includes(state)) {
            const cityPart = query.replace(state, '').trim().replace(/[^\w\s]/g, '');
            if (cityPart) {
                const stateSlug = states[state].replace(/\//g, '');
                const citySlug = cityPart.replace(/\s+/g, '-').toLowerCase();
                window.location.href = '/' + stateSlug + '/' + citySlug + '/';
                return;
            }
            // Just state mentioned
            window.location.href = states[state];
            return;
        }
    }
    
    // Default: redirect to search results page with query
    window.location.href = '/search/?q=' + encodeURIComponent(query);
}

// Add autocomplete suggestions (basic implementation)
function setupAutocomplete() {
    const searchInput = document.querySelector('.search-input');
    
    if (!searchInput) return;
    
    const suggestions = [
        'California', 'Texas', 'Florida', 'New York', 'Illinois',
        'Los Angeles', 'New York City', 'Chicago', 'Houston', 'Phoenix',
        'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
        'Austin', 'Jacksonville', 'San Francisco', 'Indianapolis', 'Columbus'
    ];
    
    let currentSuggestionIndex = -1;
    let suggestionsList = null;
    
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        
        // Remove existing suggestions
        if (suggestionsList) {
            suggestionsList.remove();
            suggestionsList = null;
        }
        
        if (value.length < 2) return;
        
        const matches = suggestions.filter(item => 
            item.toLowerCase().includes(value)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            showSuggestions(matches, searchInput);
        }
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (!suggestionsList) return;
        
        const items = suggestionsList.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, items.length - 1);
            updateSuggestionHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
            updateSuggestionHighlight(items);
        } else if (e.key === 'Enter' && currentSuggestionIndex >= 0) {
            e.preventDefault();
            searchInput.value = items[currentSuggestionIndex].textContent;
            suggestionsList.remove();
            suggestionsList = null;
            currentSuggestionIndex = -1;
        } else if (e.key === 'Escape') {
            suggestionsList.remove();
            suggestionsList = null;
            currentSuggestionIndex = -1;
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && suggestionsList && !suggestionsList.contains(e.target)) {
            suggestionsList.remove();
            suggestionsList = null;
            currentSuggestionIndex = -1;
        }
    });
}

function showSuggestions(matches, inputElement) {
    suggestionsList = document.createElement('div');
    suggestionsList.className = 'search-suggestions';
    suggestionsList.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-top: none;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    matches.forEach(match => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = match;
        item.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s ease;
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
        
        item.addEventListener('click', function() {
            inputElement.value = this.textContent;
            suggestionsList.remove();
            suggestionsList = null;
            currentSuggestionIndex = -1;
            inputElement.focus();
        });
        
        suggestionsList.appendChild(item);
    });
    
    // Position relative to search form
    const searchForm = inputElement.closest('.search-form');
    searchForm.style.position = 'relative';
    searchForm.appendChild(suggestionsList);
}

function updateSuggestionHighlight(items) {
    items.forEach((item, index) => {
        if (index === currentSuggestionIndex) {
            item.style.backgroundColor = '#e3f2fd';
        } else {
            item.style.backgroundColor = 'white';
        }
    });
}

// Initialize autocomplete when DOM is loaded
document.addEventListener('DOMContentLoaded', setupAutocomplete);