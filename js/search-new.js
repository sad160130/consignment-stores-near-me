// Search functionality for Consignment Stores Near Me
class ConsignmentSearch {
    constructor() {
        this.stores = [];
        this.initializeSearch();
    }

    initializeSearch() {
        // Load store data when page loads
        this.loadStoreData();
        
        // Bind search form submission
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleSearch(e));
        }

        // Bind search input for live suggestions
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleLiveSearch(e));
        }
    }

    async loadStoreData() {
        try {
            // This would normally load from a JSON endpoint
            // For now, we'll simulate with sample data
            this.stores = this.getSampleStores();
        } catch (error) {
            console.error('Error loading store data:', error);
        }
    }

    getSampleStores() {
        return [
            {
                name: "Lovelady Thrift Store",
                address: "2402 Old Springville Rd, Center Point, AL 35215",
                city: "Center Point",
                state: "Alabama",
                stateAbbr: "AL",
                zipCode: "35215",
                phone: "+1 205-951-9230",
                reviews: 610,
                website: "https://www.loveladycenter.org/thrift-stores/",
                features: ["Affordable Pricing", "Clean & Organized", "Clothing", "Friendly Staff"]
            },
            {
                name: "Elisabet Boutique",
                address: "124 N College St, Auburn, AL 36830",
                city: "Auburn",
                state: "Alabama",
                stateAbbr: "AL",
                zipCode: "36830",
                phone: "+1 334-209-2504",
                reviews: 198,
                website: "https://shopelisabetboutique.com/",
                features: ["Premium Brands", "Clothing", "Gift Items", "Friendly Staff"]
            },
            {
                name: "Rapha Ministries Thrift Store",
                address: "319 Gilbert Ferry Rd SW, Attalla, AL 35954",
                city: "Attalla",
                state: "Alabama",
                stateAbbr: "AL",
                zipCode: "35954",
                phone: "+1 256-290-1818",
                reviews: 195,
                website: "https://www.raphathrift.com/",
                features: ["Affordable Pricing", "Clean & Organized", "Clothing", "Friendly Staff"]
            }
        ];
    }

    handleSearch(e) {
        e.preventDefault();
        const query = e.target.querySelector('.search-input').value.trim();
        
        if (query.length < 2) {
            this.showError('Please enter at least 2 characters to search.');
            return;
        }

        const results = this.searchStores(query);
        this.displayResults(results, query);
    }

    handleLiveSearch(e) {
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            const suggestions = this.getSuggestions(query);
            this.showSuggestions(suggestions);
        } else {
            this.hideSuggestions();
        }
    }

    searchStores(query) {
        const searchTerm = query.toLowerCase();
        
        return this.stores.filter(store => {
            return (
                store.name.toLowerCase().includes(searchTerm) ||
                store.city.toLowerCase().includes(searchTerm) ||
                store.state.toLowerCase().includes(searchTerm) ||
                store.stateAbbr.toLowerCase().includes(searchTerm) ||
                store.zipCode.includes(searchTerm) ||
                store.address.toLowerCase().includes(searchTerm)
            );
        });
    }

    getSuggestions(query) {
        const searchTerm = query.toLowerCase();
        const suggestions = new Set();
        
        this.stores.forEach(store => {
            // Add store names
            if (store.name.toLowerCase().includes(searchTerm)) {
                suggestions.add(store.name);
            }
            
            // Add cities
            if (store.city.toLowerCase().includes(searchTerm)) {
                suggestions.add(`${store.city}, ${store.stateAbbr}`);
            }
            
            // Add states
            if (store.state.toLowerCase().includes(searchTerm)) {
                suggestions.add(store.state);
            }
            
            // Add zip codes
            if (store.zipCode.includes(searchTerm)) {
                suggestions.add(store.zipCode);
            }
        });
        
        return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
    }

    showSuggestions(suggestions) {
        let suggestionContainer = document.querySelector('.search-suggestions');
        
        if (!suggestionContainer) {
            suggestionContainer = document.createElement('div');
            suggestionContainer.className = 'search-suggestions';
            document.querySelector('.search-form').appendChild(suggestionContainer);
        }
        
        if (suggestions.length > 0) {
            suggestionContainer.innerHTML = suggestions
                .map(suggestion => `<div class="suggestion-item" data-suggestion="${suggestion}">${suggestion}</div>`)
                .join('');
            
            suggestionContainer.style.display = 'block';
            
            // Bind click events to suggestions
            suggestionContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    document.querySelector('.search-input').value = e.target.dataset.suggestion;
                    this.hideSuggestions();
                    document.querySelector('.search-form').dispatchEvent(new Event('submit'));
                });
            });
        } else {
            suggestionContainer.style.display = 'none';
        }
    }

    hideSuggestions() {
        const suggestionContainer = document.querySelector('.search-suggestions');
        if (suggestionContainer) {
            suggestionContainer.style.display = 'none';
        }
    }

    displayResults(results, query) {
        // In a real implementation, this would redirect to a results page
        // For now, we'll show results in place
        const main = document.querySelector('main');
        const resultsSection = document.createElement('section');
        resultsSection.className = 'search-results';
        resultsSection.innerHTML = `
            <h2>Search Results for "${query}"</h2>
            <p>Found ${results.length} consignment store${results.length !== 1 ? 's' : ''}</p>
            <div class="store-grid">
                ${results.map(store => this.createStoreCard(store)).join('')}
            </div>
        `;
        
        // Replace the existing content with search results
        main.innerHTML = '';
        main.appendChild(resultsSection);
        
        // Update the URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('q', query);
        window.history.pushState({ query }, '', newUrl);
    }

    createStoreCard(store) {
        const features = store.features.map(feature => 
            `<span class="feature-tag">${feature}</span>`
        ).join('');
        
        const citySlug = store.city.toLowerCase().replace(/\s+/g, '-');
        const stateSlug = store.state.toLowerCase().replace(/\s+/g, '-');
        
        return `
            <article class="store-card">
                <div class="store-info">
                    <h3 class="store-name">${store.name}</h3>
                    <p class="store-address">${store.address}</p>
                    <div class="store-details">
                        <span class="store-reviews">${store.reviews} reviews</span>
                        <span class="store-phone">${store.phone}</span>
                    </div>
                    <div class="store-features">
                        ${features}
                    </div>
                    <div class="store-actions">
                        <a href="/${stateSlug}/${citySlug}/" class="btn-primary">View Details</a>
                        ${store.website !== 'No data available' ? 
                            `<a href="${store.website}" class="btn-secondary" target="_blank">Visit Website</a>` : 
                            ''}
                    </div>
                </div>
            </article>
        `;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'search-error';
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            margin: 1rem 0;
            text-align: center;
        `;
        errorDiv.textContent = message;
        
        const searchContainer = document.querySelector('.search-container');
        const existingError = searchContainer.querySelector('.search-error');
        if (existingError) {
            existingError.remove();
        }
        
        searchContainer.appendChild(errorDiv);
        
        // Remove error after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConsignmentSearch();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.query) {
        document.querySelector('.search-input').value = e.state.query;
        // Re-run search
        const searchInstance = new ConsignmentSearch();
        const results = searchInstance.searchStores(e.state.query);
        searchInstance.displayResults(results, e.state.query);
    }
});