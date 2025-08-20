#!/usr/bin/env python3
"""
Generate all state and city pages for Consignment Stores Directory
Based on data from consignment_stores.csv
"""

import csv
import os
import re
from collections import defaultdict
from urllib.parse import quote

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def get_price_level_text(pricing):
    """Convert pricing code to display text"""
    if pricing == "Low":
        return "Affordable Pricing"
    elif pricing == "High":
        return "High-End Pricing"
    else:
        return "Mid-Range Pricing"

def get_features_from_row(row):
    """Extract store features from CSV row"""
    features = []
    feature_mapping = {
        'pricing': get_price_level_text(row['pricing']),
        'wide_selection': 'Wide Selection',
        'sell_antiques': 'Antiques',
        'sell_books': 'Books',
        'clean_organized': 'Clean & Organized',
        'sell_clothes': 'Clothing',
        'sell_furniture': 'Furniture',
        'sell_jewelry': 'Jewelry',
        'sell_gift_items': 'Gift Items',
        'sell_premium_brand': 'Premium Brands',
        'sell_merchandise': 'General Merchandise',
        'friendly_employees': 'Friendly Staff'
    }
    
    # Always add pricing level
    features.append(get_price_level_text(row['pricing']))
    
    # Add other features if they're "Yes"
    for field, display_name in feature_mapping.items():
        if field != 'pricing' and row.get(field, '').strip().lower() == 'yes':
            features.append(display_name)
    
    return features

def load_store_data():
    """Load and process store data from CSV"""
    stores_by_state = defaultdict(list)
    stores_by_city = defaultdict(list)
    states_data = defaultdict(lambda: {'cities': set(), 'store_count': 0})
    
    with open('consignment_stores.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            state = row['State'].strip()
            city = row['City'].strip()
            
            # Skip invalid entries
            if not state or not city:
                continue
            
            # Clean up state name (remove zip codes, etc.)
            state = re.sub(r'\s+\d{5}"?$', '', state)
            state = state.replace('"', '').strip()
            
            # Skip if state is actually a zip code or other invalid data
            if state.isdigit() or len(state) < 3:
                continue
            
            city_key = f"{city}, {state}"
            
            store_data = {
                'name': row['Business Name'].strip(),
                'address': row['Address'].strip(),
                'city': city,
                'state': state,
                'phone': row.get('Phone', 'No data available').strip(),
                'website': row.get('Site', 'No data available').strip(),
                'reviews': int(row.get('Number of Reviews', 0) or 0),
                'photo': row.get('Photo', '').strip(),
                'features': get_features_from_row(row)
            }
            
            stores_by_state[state].append(store_data)
            stores_by_city[city_key].append(store_data)
            states_data[state]['cities'].add(city)
            states_data[state]['store_count'] += 1
    
    return stores_by_state, stores_by_city, states_data

def create_state_page(state_name, stores, states_data):
    """Generate HTML content for a state page"""
    state_slug = slugify(state_name)
    cities = sorted(list(states_data[state_name]['cities']))
    store_count = states_data[state_name]['store_count']
    
    # Get top stores by reviews for featured section
    top_stores = sorted(stores, key=lambda x: x['reviews'], reverse=True)[:6]
    
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Best Consignment Stores in {state_name} - {state_name} Secondhand Shops Directory</title>
    <meta name="description" content="Discover {store_count}+ quality consignment shops, thrift stores, and secondhand boutiques in {state_name}. Find great deals on clothing, furniture, antiques, and more.">
    <meta name="keywords" content="{state_name} consignment stores, {state_name} thrift stores, {state_name} secondhand shops, consignment stores {state_name}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.consignmentstores.site/{state_slug}/">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/css/main.css">
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "{state_name} Consignment Stores",
        "description": "Directory of consignment stores and thrift shops in {state_name}",
        "url": "https://www.consignmentstores.site/{state_slug}/",
        "breadcrumb": {{
            "@type": "BreadcrumbList",
            "itemListElement": [
                {{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.consignmentstores.site/"
                }},
                {{
                    "@type": "ListItem",
                    "position": 2,
                    "name": "{state_name} Consignment Stores",
                    "item": "https://www.consignmentstores.site/{state_slug}/"
                }}
            ]
        }},
        "mainEntity": {{
            "@type": "ItemList",
            "name": "{state_name} Consignment Stores",
            "numberOfItems": "{store_count}"
        }}
    }}
    </script>
</head>
<body>
    <header>
        <div class="header-container">
            <div class="logo">
                <img src="/images/logo-main.svg" alt="Consignment Stores Near Me Logo">
            </div>
            <nav class="main-nav">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link" style="color: var(--primary-blue); font-weight: 600;">Stores by State</a>
                        <div class="dropdown">
                            <div class="dropdown-columns">
                                <div class="dropdown-column">
                                    <h4>A - F</h4>
                                    <a href="/alabama/" class="dropdown-item">Alabama</a>
                                    <a href="/alaska/" class="dropdown-item">Alaska</a>
                                    <a href="/arizona/" class="dropdown-item">Arizona</a>
                                    <a href="/arkansas/" class="dropdown-item">Arkansas</a>
                                    <a href="/california/" class="dropdown-item">California</a>
                                    <a href="/colorado/" class="dropdown-item">Colorado</a>
                                    <a href="/connecticut/" class="dropdown-item">Connecticut</a>
                                    <a href="/delaware/" class="dropdown-item">Delaware</a>
                                    <a href="/florida/" class="dropdown-item">Florida</a>
                                </div>
                                <div class="dropdown-column">
                                    <h4>G - M</h4>
                                    <a href="/georgia/" class="dropdown-item">Georgia</a>
                                    <a href="/hawaii/" class="dropdown-item">Hawaii</a>
                                    <a href="/idaho/" class="dropdown-item">Idaho</a>
                                    <a href="/illinois/" class="dropdown-item">Illinois</a>
                                    <a href="/indiana/" class="dropdown-item">Indiana</a>
                                    <a href="/iowa/" class="dropdown-item">Iowa</a>
                                    <a href="/kansas/" class="dropdown-item">Kansas</a>
                                    <a href="/kentucky/" class="dropdown-item">Kentucky</a>
                                    <a href="/louisiana/" class="dropdown-item">Louisiana</a>
                                    <a href="/maine/" class="dropdown-item">Maine</a>
                                    <a href="/maryland/" class="dropdown-item">Maryland</a>
                                    <a href="/massachusetts/" class="dropdown-item">Massachusetts</a>
                                    <a href="/michigan/" class="dropdown-item">Michigan</a>
                                    <a href="/minnesota/" class="dropdown-item">Minnesota</a>
                                    <a href="/mississippi/" class="dropdown-item">Mississippi</a>
                                    <a href="/missouri/" class="dropdown-item">Missouri</a>
                                    <a href="/montana/" class="dropdown-item">Montana</a>
                                </div>
                                <div class="dropdown-column">
                                    <h4>N - W</h4>
                                    <a href="/nebraska/" class="dropdown-item">Nebraska</a>
                                    <a href="/nevada/" class="dropdown-item">Nevada</a>
                                    <a href="/new-hampshire/" class="dropdown-item">New Hampshire</a>
                                    <a href="/new-jersey/" class="dropdown-item">New Jersey</a>
                                    <a href="/new-mexico/" class="dropdown-item">New Mexico</a>
                                    <a href="/new-york/" class="dropdown-item">New York</a>
                                    <a href="/north-carolina/" class="dropdown-item">North Carolina</a>
                                    <a href="/north-dakota/" class="dropdown-item">North Dakota</a>
                                    <a href="/ohio/" class="dropdown-item">Ohio</a>
                                    <a href="/oklahoma/" class="dropdown-item">Oklahoma</a>
                                    <a href="/oregon/" class="dropdown-item">Oregon</a>
                                    <a href="/pennsylvania/" class="dropdown-item">Pennsylvania</a>
                                    <a href="/rhode-island/" class="dropdown-item">Rhode Island</a>
                                    <a href="/south-carolina/" class="dropdown-item">South Carolina</a>
                                    <a href="/south-dakota/" class="dropdown-item">South Dakota</a>
                                    <a href="/tennessee/" class="dropdown-item">Tennessee</a>
                                    <a href="/texas/" class="dropdown-item">Texas</a>
                                    <a href="/utah/" class="dropdown-item">Utah</a>
                                    <a href="/vermont/" class="dropdown-item">Vermont</a>
                                    <a href="/virginia/" class="dropdown-item">Virginia</a>
                                    <a href="/washington/" class="dropdown-item">Washington</a>
                                    <a href="/west-virginia/" class="dropdown-item">West Virginia</a>
                                    <a href="/wisconsin/" class="dropdown-item">Wisconsin</a>
                                    <a href="/wyoming/" class="dropdown-item">Wyoming</a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Store by City</a>
                        <div class="dropdown">
                            <div class="dropdown-content">
                                <a href="/sitemap/" class="dropdown-item text-blue">View All Cities →</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="/about/" class="nav-link">About Us</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <a href="/" class="breadcrumb-link">Home</a>
                </li>
                <li class="breadcrumb-item">
                    <span>{state_name} Consignment Stores</span>
                </li>
            </ol>
        </nav>

        <!-- State Hero Section -->
        <section class="state-hero">
            <div class="container">
                <h1>Best Consignment Stores in {state_name}</h1>
                <p class="lead">Discover {store_count}+ quality consignment shops, thrift stores, and secondhand boutiques in {state_name}. Find great deals on clothing, furniture, antiques, and more.</p>
            </div>
        </section>

        <!-- Quick Search Section -->
        <section class="quick-search">
            <div class="container">
                <form class="search-form" action="/search" method="GET">
                    <input type="hidden" name="state" value="{state_name}">
                    <input type="text" class="search-input" name="q" placeholder="Search {state_name} consignment stores..." required>
                    <button type="submit" class="search-button">Search</button>
                </form>
            </div>
        </section>
'''
    
    # Add featured stores section
    if top_stores:
        html_content += '''
        <!-- Featured Stores Section -->
        <section class="featured-stores">
            <div class="container">
                <h2>Featured ''' + state_name + ''' Consignment Stores</h2>
                <div class="store-grid">
'''
        
        for store in top_stores[:3]:  # Show top 3 stores
            features_html = ''.join([f'<span class="feature-tag">{feature}</span>' for feature in store['features'][:4]])
            website_link = ''
            if store['website'] and store['website'] != 'No data available':
                website_link = f'<a href="{store["website"]}" class="btn-secondary" target="_blank">Visit Website</a>'
            
            city_slug = slugify(store['city'])
            state_slug_lower = slugify(state_name)
            
            html_content += f'''
                    <article class="store-card">
                        <img src="{store['photo'] if store['photo'] else '/images/store-placeholder.jpg'}" alt="{store['name']} in {store['city']}, {state_name}" class="store-image">
                        <div class="store-info">
                            <h3 class="store-name">{store['name']}</h3>
                            <p class="store-address">{store['city']}, {state_name}</p>
                            <div class="store-details">
                                <span class="store-reviews">{store['reviews']} reviews</span>
                                <span class="store-phone">{store['phone']}</span>
                            </div>
                            <div class="store-features">
                                {features_html}
                            </div>
                            <div class="store-actions">
                                <a href="/{state_slug_lower}/{city_slug}/" class="btn-primary">View Details</a>
                                {website_link}
                            </div>
                        </div>
                    </article>
'''
        
        html_content += '''
                </div>
            </div>
        </section>
'''
    
    # Add all cities section
    html_content += f'''
        <!-- All Cities Section -->
        <section class="all-cities">
            <div class="container">
                <h2>All Cities in {state_name} with Consignment Stores</h2>
                <p>Browse consignment stores by city in {state_name}. Click on any city below to view local secondhand shops and thrift stores.</p>
                <div class="cities-grid">
'''
    
    # Add cities with store counts
    city_counts = defaultdict(int)
    for store in stores:
        city_counts[store['city']] += 1
    
    for city in sorted(cities):
        city_slug = slugify(city)
        count = city_counts[city]
        plural = "store" if count == 1 else "stores"
        
        html_content += f'''
                    <div class="city-item">
                        <h3><a href="/{state_slug}/{city_slug}/">{city}</a></h3>
                        <p>{count} {plural}</p>
                    </div>
'''
    
    html_content += '''
                </div>
            </div>
        </section>

        <!-- SEO Content Section -->
        <section class="state-content">
            <div class="container">
                <h2>Consignment Shopping in ''' + state_name + '''</h2>
                <p>''' + state_name + ''' offers excellent consignment shopping opportunities with ''' + str(store_count) + '''+ quality consignment stores, thrift shops, and secondhand boutiques throughout the state. From urban centers to small towns, you'll find amazing deals on clothing, furniture, antiques, and unique treasures.</p>
                
                <h3>What You'll Find at ''' + state_name + ''' Consignment Stores</h3>
                <p>''' + state_name + ''' consignment stores offer an impressive variety of items:</p>
                
                <ul>
                    <li><strong>Clothing & Fashion:</strong> Designer brands, vintage pieces, and everyday wear at affordable prices</li>
                    <li><strong>Furniture & Home Décor:</strong> Antique furniture, modern pieces, and unique home accessories</li>
                    <li><strong>Books & Media:</strong> Rare books, vintage magazines, and collectible items</li>
                    <li><strong>Jewelry & Accessories:</strong> Estate jewelry, costume pieces, and designer accessories</li>
                    <li><strong>Gift Items:</strong> Unique gifts, collectibles, and specialty items</li>
                </ul>

                <h3>Why Shop Consignment in ''' + state_name + '''?</h3>
                <p>Shopping at ''' + state_name + ''' consignment stores offers numerous benefits beyond just saving money. You'll find unique, quality items that aren't available in traditional retail stores, support local businesses, and contribute to environmental sustainability by giving pre-owned items a new life.</p>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about/">About Us</a></li>
                        <li><a href="/sitemap/">Sitemap</a></li>
                        <li><a href="/sitemap.xml">XML Sitemap</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>''' + state_name + ''' Cities</h3>
                    <ul>
'''
    
    # Add top cities to footer
    top_cities = sorted(cities)[:5]
    for city in top_cities:
        city_slug = slugify(city)
        html_content += f'                        <li><a href="/{state_slug}/{city_slug}/">{city} Consignment Stores</a></li>\n'
    
    html_content += '''
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Store Categories</h3>
                    <ul>
                        <li>Clothing Consignment</li>
                        <li>Furniture Consignment</li>
                        <li>Antique Stores</li>
                        <li>Designer Consignment</li>
                        <li>Book Stores</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Consignment Stores Near Me. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <style>
        .state-hero {
            background: linear-gradient(135deg, var(--primary-blue), var(--dark-blue));
            color: var(--white);
            padding: 3rem 0;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .state-hero h1 {
            color: var(--white);
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .quick-search {
            background-color: var(--light-gray);
            padding: 2rem 0;
            margin-bottom: 3rem;
        }
        
        .quick-search .search-form {
            max-width: 500px;
            margin: 0 auto;
            background-color: var(--white);
            border-radius: 25px;
            padding: 0.5rem;
            box-shadow: var(--shadow);
        }
        
        .featured-stores,
        .all-cities,
        .state-content {
            padding: 3rem 0;
        }
        
        .cities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .city-item {
            background-color: var(--white);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: var(--shadow);
            transition: transform 0.3s ease;
        }
        
        .city-item:hover {
            transform: translateY(-2px);
        }
        
        .city-item h3 {
            margin-bottom: 0.5rem;
        }
        
        .city-item h3 a {
            color: var(--dark-blue);
            text-decoration: none;
        }
        
        .city-item h3 a:hover {
            color: var(--primary-blue);
        }
        
        .city-item p {
            color: var(--gray);
            margin: 0;
            font-size: 0.9rem;
        }
        
        .state-content {
            background-color: var(--light-gray);
        }
        
        .state-content h2,
        .state-content h3 {
            color: var(--dark-blue);
        }
        
        .state-content ul {
            padding-left: 2rem;
            margin-bottom: 1.5rem;
        }
        
        .state-content li {
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .state-hero h1 {
                font-size: 2rem;
            }
            
            .cities-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }
        }
    </style>
</body>
</html>'''
    
    return html_content

def create_city_page(city_name, state_name, stores):
    """Generate HTML content for a city page"""
    city_slug = slugify(city_name)
    state_slug = slugify(state_name)
    
    # Sort stores by reviews (descending)
    sorted_stores = sorted(stores, key=lambda x: x['reviews'], reverse=True)
    store_count = len(stores)
    
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Best Consignment Stores {city_name} {state_name} - {city_name} Secondhand Shops Directory</title>
    <meta name="description" content="Find the best consignment stores in {city_name}, {state_name}! Discover {store_count} quality secondhand shops, thrift stores, and consignment boutiques with reviews, locations, and contact info.">
    <meta name="keywords" content="{city_name} consignment stores, {city_name} thrift stores, {city_name} {state_name} secondhand shops, consignment stores {city_name} {state_name}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.consignmentstores.site/{state_slug}/{city_slug}/">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/css/main.css">
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "{city_name} {state_name} Consignment Stores",
        "description": "Directory of consignment stores and thrift shops in {city_name}, {state_name}",
        "url": "https://www.consignmentstores.site/{state_slug}/{city_slug}/",
        "breadcrumb": {{
            "@type": "BreadcrumbList",
            "itemListElement": [
                {{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.consignmentstores.site/"
                }},
                {{
                    "@type": "ListItem",
                    "position": 2,
                    "name": "{state_name}",
                    "item": "https://www.consignmentstores.site/{state_slug}/"
                }},
                {{
                    "@type": "ListItem",
                    "position": 3,
                    "name": "{city_name} Consignment Stores",
                    "item": "https://www.consignmentstores.site/{state_slug}/{city_slug}/"
                }}
            ]
        }}
    }}
    </script>
</head>
<body>
    <header>
        <div class="header-container">
            <div class="logo">
                <img src="/images/logo-main.svg" alt="Consignment Stores Near Me Logo">
            </div>
            <nav class="main-nav">
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="#" class="nav-link">Stores by State</a>
                        <div class="dropdown">
                            <div class="dropdown-columns">
                                <div class="dropdown-column">
                                    <h4>A - F</h4>
                                    <a href="/alabama/" class="dropdown-item">Alabama</a>
                                    <a href="/alaska/" class="dropdown-item">Alaska</a>
                                    <a href="/arizona/" class="dropdown-item">Arizona</a>
                                    <a href="/arkansas/" class="dropdown-item">Arkansas</a>
                                    <a href="/california/" class="dropdown-item">California</a>
                                    <a href="/colorado/" class="dropdown-item">Colorado</a>
                                    <a href="/connecticut/" class="dropdown-item">Connecticut</a>
                                    <a href="/delaware/" class="dropdown-item">Delaware</a>
                                    <a href="/florida/" class="dropdown-item">Florida</a>
                                </div>
                                <div class="dropdown-column">
                                    <h4>G - M</h4>
                                    <a href="/georgia/" class="dropdown-item">Georgia</a>
                                    <a href="/hawaii/" class="dropdown-item">Hawaii</a>
                                    <a href="/idaho/" class="dropdown-item">Idaho</a>
                                    <a href="/illinois/" class="dropdown-item">Illinois</a>
                                    <a href="/indiana/" class="dropdown-item">Indiana</a>
                                    <a href="/iowa/" class="dropdown-item">Iowa</a>
                                    <a href="/kansas/" class="dropdown-item">Kansas</a>
                                    <a href="/kentucky/" class="dropdown-item">Kentucky</a>
                                    <a href="/louisiana/" class="dropdown-item">Louisiana</a>
                                    <a href="/maine/" class="dropdown-item">Maine</a>
                                    <a href="/maryland/" class="dropdown-item">Maryland</a>
                                    <a href="/massachusetts/" class="dropdown-item">Massachusetts</a>
                                    <a href="/michigan/" class="dropdown-item">Michigan</a>
                                    <a href="/minnesota/" class="dropdown-item">Minnesota</a>
                                    <a href="/mississippi/" class="dropdown-item">Mississippi</a>
                                    <a href="/missouri/" class="dropdown-item">Missouri</a>
                                    <a href="/montana/" class="dropdown-item">Montana</a>
                                </div>
                                <div class="dropdown-column">
                                    <h4>N - W</h4>
                                    <a href="/nebraska/" class="dropdown-item">Nebraska</a>
                                    <a href="/nevada/" class="dropdown-item">Nevada</a>
                                    <a href="/new-hampshire/" class="dropdown-item">New Hampshire</a>
                                    <a href="/new-jersey/" class="dropdown-item">New Jersey</a>
                                    <a href="/new-mexico/" class="dropdown-item">New Mexico</a>
                                    <a href="/new-york/" class="dropdown-item">New York</a>
                                    <a href="/north-carolina/" class="dropdown-item">North Carolina</a>
                                    <a href="/north-dakota/" class="dropdown-item">North Dakota</a>
                                    <a href="/ohio/" class="dropdown-item">Ohio</a>
                                    <a href="/oklahoma/" class="dropdown-item">Oklahoma</a>
                                    <a href="/oregon/" class="dropdown-item">Oregon</a>
                                    <a href="/pennsylvania/" class="dropdown-item">Pennsylvania</a>
                                    <a href="/rhode-island/" class="dropdown-item">Rhode Island</a>
                                    <a href="/south-carolina/" class="dropdown-item">South Carolina</a>
                                    <a href="/south-dakota/" class="dropdown-item">South Dakota</a>
                                    <a href="/tennessee/" class="dropdown-item">Tennessee</a>
                                    <a href="/texas/" class="dropdown-item">Texas</a>
                                    <a href="/utah/" class="dropdown-item">Utah</a>
                                    <a href="/vermont/" class="dropdown-item">Vermont</a>
                                    <a href="/virginia/" class="dropdown-item">Virginia</a>
                                    <a href="/washington/" class="dropdown-item">Washington</a>
                                    <a href="/west-virginia/" class="dropdown-item">West Virginia</a>
                                    <a href="/wisconsin/" class="dropdown-item">Wisconsin</a>
                                    <a href="/wyoming/" class="dropdown-item">Wyoming</a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" style="color: var(--primary-blue); font-weight: 600;">Store by City</a>
                        <div class="dropdown">
                            <div class="dropdown-content">
                                <a href="/sitemap/" class="dropdown-item text-blue">View All Cities →</a>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="/about/" class="nav-link">About Us</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <a href="/" class="breadcrumb-link">Home</a>
                </li>
                <li class="breadcrumb-item">
                    <a href="/{state_slug}/" class="breadcrumb-link">{state_name}</a>
                </li>
                <li class="breadcrumb-item">
                    <span>{city_name} Consignment Stores</span>
                </li>
            </ol>
        </nav>

        <!-- City Hero Section -->
        <section class="city-hero">
            <div class="container">
                <h1>Best Consignment Stores in {city_name}, {state_name}</h1>
                <p class="lead">Discover {store_count} quality consignment store{'s' if store_count != 1 else ''} in {city_name}, {state_name}. Find designer clothing, furniture, antiques, and more at {city_name}'s top-rated secondhand shops and thrift stores.</p>
            </div>
        </section>

        <!-- Store Listings Section -->
        <section class="store-listings">
            <div class="container">
                <h2>{city_name} Consignment Stores (Sorted by Reviews)</h2>
                <div class="store-list">
'''
    
    # Add individual store listings
    for store in sorted_stores:
        features_html = ''.join([f'<span class="feature-tag positive">{feature}</span>' for feature in store['features'][:6]])
        website_link = ''
        if store['website'] and store['website'] != 'No data available':
            website_link = f'''
                                    <strong>Website:</strong> <a href="{store['website']}" target="_blank">{store['website']}</a>'''
        
        specialties = ', '.join(store['features'][:3])
        
        html_content += f'''
                    <article class="store-listing">
                        <div class="store-image-container">
                            <img src="{store['photo'] if store['photo'] else '/images/store-placeholder.jpg'}" alt="{store['name']}" class="store-image">
                        </div>
                        <div class="store-details">
                            <h3 class="store-name">{store['name']}</h3>
                            <div class="store-rating">
                                <span class="review-count">{store['reviews']} reviews</span>
                                <span class="rating-separator">•</span>
                                <span class="price-level">{get_price_level_text(store.get('pricing', 'Mid-Range'))}</span>
                            </div>
                            <div class="store-address">
                                <strong>Address:</strong> {store['address']}
                            </div>
                            <div class="store-contact">
                                <strong>Phone:</strong> <a href="tel:{store['phone']}">{store['phone']}</a>{website_link}
                            </div>
                            <div class="store-features">
                                <h4>Store Features:</h4>
                                <div class="features-list">
                                    {features_html}
                                </div>
                            </div>
                            <div class="store-specialties">
                                <strong>Specializes in:</strong> {specialties}
                            </div>
                        </div>
                    </article>
'''
    
    store_plural = 's' if store_count != 1 else ''
    
    html_content += f'''
                </div>
            </div>
        </section>

        <!-- SEO Content Section -->
        <section class="city-content">
            <div class="container">
                <h2>Consignment Shopping in {city_name}, {state_name}</h2>
                <p>{city_name}, {state_name} offers excellent consignment shopping opportunities with {store_count} quality consignment store{store_plural} serving residents and visitors. Whether you're looking for designer clothing, unique furniture, or vintage treasures, {city_name}'s consignment shops provide incredible value and selection.</p>
                
                <h3>Why {city_name} is Great for Consignment Shopping</h3>
                <ul>
                    <li><strong>Quality Selection:</strong> {city_name}'s consignment stores offer carefully curated items from clothing to home décor.</li>
                    <li><strong>Great Value:</strong> Find premium brands and designer items at fraction of retail prices.</li>
                    <li><strong>Local Community:</strong> Support {city_name} small businesses and keep money in the local economy.</li>
                    <li><strong>Sustainable Shopping:</strong> Give pre-owned items new life while reducing environmental impact.</li>
                </ul>

                <h3>Popular Items at {city_name} Consignment Stores</h3>
                <p>{city_name} consignment stores are known for their excellent selection of clothing, furniture, antiques, books, jewelry, and unique gift items. Many stores specialize in specific categories, so you're sure to find exactly what you're looking for.</p>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about/">About Us</a></li>
                        <li><a href="/sitemap/">Sitemap</a></li>
                        <li><a href="/sitemap.xml">XML Sitemap</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Store Categories</h3>
                    <ul>
                        <li>Designer Consignment</li>
                        <li>Clothing Consignment</li>
                        <li>Furniture Consignment</li>
                        <li>Gift Items</li>
                        <li>Premium Brands</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Consignment Stores Near Me. All rights reserved.</p>
            </div>
        </div>
    </footer>'''
    
    # Add CSS styles as separate string to avoid f-string issues
    css_styles = '''
    <style>
        .city-hero {
            background: linear-gradient(135deg, var(--primary-blue), var(--dark-blue));
            color: var(--white);
            padding: 3rem 0;
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .city-hero h1 {
            color: var(--white);
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .store-listings {
            padding: 2rem 0;
        }
        
        .store-list {
            display: flex;
            flex-direction: column;
            gap: 3rem;
            margin-top: 2rem;
        }
        
        .store-listing {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 2rem;
            background-color: var(--white);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: transform 0.3s ease;
        }
        
        .store-listing:hover {
            transform: translateY(-2px);
        }
        
        .store-image-container {
            position: relative;
        }
        
        .store-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        
        .store-details {
            padding: 2rem;
        }
        
        .store-name {
            color: var(--dark-blue);
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
        }
        
        .store-rating {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        
        .review-count {
            color: var(--primary-blue);
            font-weight: 600;
        }
        
        .price-level {
            color: var(--gray);
        }
        
        .rating-separator {
            margin: 0 0.5rem;
            color: var(--gray);
        }
        
        .store-address,
        .store-contact {
            margin-bottom: 1rem;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        
        .store-contact a {
            color: var(--primary-blue);
        }
        
        .store-features {
            margin-bottom: 1rem;
        }
        
        .store-features h4 {
            color: var(--dark-blue);
            font-size: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .features-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .feature-tag.positive {
            background-color: var(--light-blue);
            color: var(--dark-blue);
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .store-specialties {
            font-size: 0.95rem;
            color: var(--dark-gray);
        }
        
        .city-content {
            padding: 3rem 0;
        }
        
        .city-content h2,
        .city-content h3 {
            color: var(--dark-blue);
        }
        
        .city-content ul {
            padding-left: 2rem;
            margin-bottom: 1.5rem;
        }
        
        .city-content li {
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .city-hero h1 {
                font-size: 2rem;
            }
            
            .store-listing {
                grid-template-columns: 1fr;
            }
            
            .store-details {
                padding: 1.5rem;
            }
        }
    </style>
</body>
</html>'''
    
    html_content += css_styles
    
    return html_content

def main():
    """Main function to generate all pages"""
    print("Starting comprehensive website expansion...")
    
    # Load data
    print("Loading store data from CSV...")
    stores_by_state, stores_by_city, states_data = load_store_data()
    
    print(f"Loaded data for {len(stores_by_state)} states and {len(stores_by_city)} cities")
    
    # Create state directories and pages
    print("Generating state pages...")
    for state_name, stores in stores_by_state.items():
        if len(stores) < 1:  # Skip states with no stores
            continue
            
        state_slug = slugify(state_name)
        state_dir = f"{state_slug}"
        
        # Create state directory
        os.makedirs(state_dir, exist_ok=True)
        
        # Generate state page
        html_content = create_state_page(state_name, stores, states_data)
        
        with open(f"{state_dir}/index.html", 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"  Created {state_name} state page ({len(stores)} stores)")
    
    # Create city directories and pages
    print("Generating city pages...")
    for city_key, stores in stores_by_city.items():
        if len(stores) < 1:  # Skip cities with no stores
            continue
            
        city_name, state_name = city_key.split(', ', 1)
        city_slug = slugify(city_name)
        state_slug = slugify(state_name)
        
        city_dir = f"{state_slug}/{city_slug}"
        
        # Create city directory
        os.makedirs(city_dir, exist_ok=True)
        
        # Generate city page
        html_content = create_city_page(city_name, state_name, stores)
        
        with open(f"{city_dir}/index.html", 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"  Created {city_name}, {state_name} city page ({len(stores)} stores)")
    
    print(f"Website expansion completed!")
    print(f"Generated {len(stores_by_state)} state pages and {len(stores_by_city)} city pages")

if __name__ == "__main__":
    main()