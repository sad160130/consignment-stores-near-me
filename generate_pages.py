#!/usr/bin/env python3
"""
Generate consignment store directory pages from CSV data
"""

import pandas as pd
import os
import re
from collections import defaultdict, Counter
import html
import math

def slugify(text):
    """Convert text to URL-friendly slug"""
    if pd.isna(text) or text == '':
        return ''
    text = str(text).lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def format_phone(phone):
    """Format phone number for display"""
    if pd.isna(phone) or phone == '' or phone == 'No data available':
        return None
    phone = str(phone).strip()
    if phone.startswith('+1'):
        phone = phone[2:].strip()
    # Format as (XXX) XXX-XXXX
    digits = re.sub(r'\D', '', phone)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return phone

def format_website(site):
    """Format website URL"""
    if pd.isna(site) or site == '' or site == 'No data available':
        return None
    site = str(site).strip()
    if not site.startswith('http'):
        site = 'https://' + site
    return site

def get_store_features(row):
    """Extract store features as tags"""
    features = []
    feature_mapping = {
        'pricing': {'Low': 'Affordable Pricing', 'Mid-Range': 'Fair Pricing'},
        'wide_selection': {'Yes': 'Wide Selection'},
        'sell_antiques': {'Yes': 'Antiques'},
        'sell_books': {'Yes': 'Books'},
        'clean_organized': {'Yes': 'Clean & Organized'},
        'sell_clothes': {'Yes': 'Clothing'},
        'sell_furniture': {'Yes': 'Furniture'},
        'sell_jewelry': {'Yes': 'Jewelry'},
        'sell_gift_items': {'Yes': 'Gift Items'},
        'sell_premium_brand': {'Yes': 'Premium Brands'},
        'friendly_employees': {'Yes': 'Friendly Staff'}
    }
    
    for col, mapping in feature_mapping.items():
        value = str(row.get(col, '')).strip()
        if value in mapping:
            features.append(mapping[value])
    
    return features

def generate_store_card_html(store):
    """Generate HTML for a single store card"""
    name = html.escape(str(store['Business Name']))
    address = html.escape(str(store['Address']))
    reviews = store.get('Number of Reviews', 0)
    phone = format_phone(store.get('Phone'))
    website = format_website(store.get('Site'))
    photo = store.get('Photo', '')
    features = get_store_features(store)
    
    # Generate star rating based on review count (simplified)
    if reviews > 200:
        stars = "★★★★★"
    elif reviews > 100:
        stars = "★★★★☆"
    elif reviews > 50:
        stars = "★★★☆☆"
    elif reviews > 20:
        stars = "★★☆☆☆"
    else:
        stars = "★☆☆☆☆"
    
    feature_tags = ''.join([f'<span class="feature-tag">{feature}</span>' for feature in features[:4]])
    
    contact_links = []
    if phone:
        contact_links.append(f'<a href="tel:{phone.replace("(", "").replace(")", "").replace("-", "").replace(" ", "")}" class="contact-link">📞 Call</a>')
    if website:
        contact_links.append(f'<a href="{website}" class="contact-link" target="_blank">🌐 Website</a>')
    
    contact_html = '<div class="store-contact">' + ''.join(contact_links) + '</div>' if contact_links else ''
    
    return f'''
        <div class="store-card">
            <h3 class="store-name">{name}</h3>
            <p class="store-address">{address}</p>
            <p class="store-reviews">{stars} ({reviews} reviews)</p>
            <div class="store-features">
                {feature_tags}
            </div>
            {contact_html}
        </div>
    '''

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate approximate distance between two points (simplified)"""
    # For now, just use a simple coordinate difference
    # In production, you'd use proper geolocation calculation
    return abs(lat1 - lat2) + abs(lon1 - lon2)

def get_nearby_cities(target_city, target_state, all_cities_data, limit=10):
    """Get nearby cities with stores (simplified by alphabetical proximity)"""
    state_cities = all_cities_data.get(target_state, {})
    
    # Simple approach: get cities in same state, sorted alphabetically
    nearby = []
    for city, count in sorted(state_cities.items()):
        if city.lower() != target_city.lower():
            city_slug = slugify(city)
            state_slug = slugify(target_state)
            nearby.append(f'<li><a href="/{state_slug}/{city_slug}/">{city} ({count} stores)</a></li>')
            if len(nearby) >= limit:
                break
    
    return '\n'.join(nearby)

def main():
    # Load the data
    print("Loading data...")
    df = pd.read_csv('consignment_stores.csv')
    print(f"Loaded {len(df)} stores")
    
    # Clean and organize data
    df['State'] = df['State'].fillna('Unknown')
    df['City'] = df['City'].fillna('Unknown')
    df['Number of Reviews'] = pd.to_numeric(df['Number of Reviews'], errors='coerce').fillna(0)
    
    # Remove invalid entries
    df = df[(df['State'] != 'Unknown') & (df['City'] != 'Unknown')]
    print(f"After cleaning: {len(df)} stores")
    
    # Group data by state and city
    states_data = defaultdict(lambda: defaultdict(list))
    cities_count_by_state = defaultdict(dict)
    
    for _, store in df.iterrows():
        state = str(store['State']).strip()
        city = str(store['City']).strip()
        states_data[state][city].append(store)
        
    # Count stores by city for each state
    for state, cities in states_data.items():
        for city, stores in cities.items():
            cities_count_by_state[state][city] = len(stores)
    
    print(f"Processing {len(states_data)} states...")
    
    # Load templates
    with open('templates/state-template.html', 'r', encoding='utf-8') as f:
        state_template = f.read()
    
    with open('templates/city-template.html', 'r', encoding='utf-8') as f:
        city_template = f.read()
    
    # Generate state pages
    print("Generating state pages...")
    for state, cities in states_data.items():
        state_slug = slugify(state)
        state_dir = state_slug
        
        # Create state directory
        os.makedirs(state_dir, exist_ok=True)
        
        # Calculate state statistics
        total_stores = sum(len(stores) for stores in cities.values())
        all_stores = []
        for city_stores in cities.values():
            all_stores.extend(city_stores)
        
        # Sort stores by review count
        all_stores.sort(key=lambda x: x.get('Number of Reviews', 0), reverse=True)
        featured_stores = all_stores[:8]  # Top 8 stores for state page
        
        # Generate featured stores HTML
        featured_stores_html = '\n'.join([generate_store_card_html(store) for store in featured_stores])
        
        # Generate all cities list
        sorted_cities = sorted(cities.items(), key=lambda x: len(x[1]), reverse=True)
        all_cities_html = '\n'.join([
            f'<li><a href="/{state_slug}/{slugify(city)}/">{city} ({len(stores)} stores)</a></li>'
            for city, stores in sorted_cities[:20]  # Top 20 cities
        ])
        
        # Generate popular cities for dropdown
        popular_cities_html = '\n'.join([
            f'<a href="/{state_slug}/{slugify(city)}/" class="dropdown-link">{city}, {state[:2].upper()}</a>'
            for city, stores in sorted_cities[:10]
        ])
        
        # Replace template variables
        state_page = state_template.replace('{{STATE_NAME}}', state)
        state_page = state_page.replace('{{STATE_SLUG}}', state_slug)
        state_page = state_page.replace('{{STORE_COUNT}}', str(total_stores))
        state_page = state_page.replace('{{FEATURED_STORES_LIST}}', featured_stores_html)
        state_page = state_page.replace('{{ALL_CITIES_LIST}}', all_cities_html)
        state_page = state_page.replace('{{POPULAR_CITIES_DROPDOWN}}', popular_cities_html)
        
        # Write state page
        with open(f'{state_dir}/index.html', 'w', encoding='utf-8') as f:
            f.write(state_page)
        
        print(f"Generated {state} state page ({total_stores} stores)")
        
        # Generate city pages for this state
        for city, city_stores in cities.items():
            city_slug = slugify(city)
            city_dir = f'{state_slug}/{city_slug}'
            
            # Create city directory
            os.makedirs(city_dir, exist_ok=True)
            
            # Sort city stores by review count
            sorted_stores = sorted(city_stores, key=lambda x: x.get('Number of Reviews', 0), reverse=True)
            
            # Generate store listings HTML
            store_listings_html = '\n'.join([generate_store_card_html(store) for store in sorted_stores])
            
            # Calculate city statistics
            total_reviews = sum(store.get('Number of Reviews', 0) for store in city_stores)
            avg_reviews = int(total_reviews / len(city_stores)) if city_stores else 0
            
            # Count features
            feature_counts = Counter()
            for store in city_stores:
                features = get_store_features(store)
                feature_counts.update(features)
            
            # Get top category
            top_category = feature_counts.most_common(1)[0][0] if feature_counts else 'General'
            
            # Get most reviewed store
            most_reviewed = max(city_stores, key=lambda x: x.get('Number of Reviews', 0))
            most_reviewed_name = most_reviewed.get('Business Name', 'N/A')
            
            # Generate nearby cities
            nearby_cities_html = get_nearby_cities(city, state, cities_count_by_state)
            
            # Count stores by category (simplified)
            clothing_count = sum(1 for store in city_stores if get_store_features(store) and 'Clothing' in get_store_features(store))
            furniture_count = sum(1 for store in city_stores if get_store_features(store) and 'Furniture' in get_store_features(store))
            antiques_count = sum(1 for store in city_stores if get_store_features(store) and 'Antiques' in get_store_features(store))
            books_count = sum(1 for store in city_stores if get_store_features(store) and 'Books' in get_store_features(store))
            jewelry_count = sum(1 for store in city_stores if get_store_features(store) and 'Jewelry' in get_store_features(store))
            
            # Count features
            affordable_count = sum(1 for store in city_stores if 'Affordable Pricing' in get_store_features(store))
            wide_selection_count = sum(1 for store in city_stores if 'Wide Selection' in get_store_features(store))
            clean_count = sum(1 for store in city_stores if 'Clean & Organized' in get_store_features(store))
            friendly_count = sum(1 for store in city_stores if 'Friendly Staff' in get_store_features(store))
            premium_count = sum(1 for store in city_stores if 'Premium Brands' in get_store_features(store))
            
            # Replace template variables
            city_page = city_template.replace('{{CITY_NAME}}', city)
            city_page = city_page.replace('{{STATE_NAME}}', state)
            city_page = city_page.replace('{{CITY_SLUG}}', city_slug)
            city_page = city_page.replace('{{STATE_SLUG}}', state_slug)
            city_page = city_page.replace('{{STORE_COUNT}}', str(len(city_stores)))
            city_page = city_page.replace('{{STORE_LISTINGS}}', store_listings_html)
            city_page = city_page.replace('{{NEARBY_CITIES_LIST}}', nearby_cities_html)
            city_page = city_page.replace('{{AVG_REVIEWS}}', str(avg_reviews))
            city_page = city_page.replace('{{TOP_CATEGORY}}', top_category)
            city_page = city_page.replace('{{MOST_REVIEWED_STORE}}', most_reviewed_name)
            
            # Replace category counts
            city_page = city_page.replace('{{CLOTHING_COUNT}}', str(clothing_count))
            city_page = city_page.replace('{{FURNITURE_COUNT}}', str(furniture_count))
            city_page = city_page.replace('{{ANTIQUES_COUNT}}', str(antiques_count))
            city_page = city_page.replace('{{BOOKS_COUNT}}', str(books_count))
            city_page = city_page.replace('{{JEWELRY_COUNT}}', str(jewelry_count))
            
            # Replace feature counts
            city_page = city_page.replace('{{AFFORDABLE_COUNT}}', str(affordable_count))
            city_page = city_page.replace('{{WIDE_SELECTION_COUNT}}', str(wide_selection_count))
            city_page = city_page.replace('{{CLEAN_COUNT}}', str(clean_count))
            city_page = city_page.replace('{{FRIENDLY_COUNT}}', str(friendly_count))
            city_page = city_page.replace('{{PREMIUM_COUNT}}', str(premium_count))
            
            # Generate JSON-LD for stores
            stores_jsonld = []
            for i, store in enumerate(sorted_stores[:5]):  # Top 5 stores
                store_json = f'''{{
                    "@type": "LocalBusiness",
                    "position": {i+1},
                    "name": "{html.escape(str(store['Business Name']))}",
                    "address": "{html.escape(str(store['Address']))}"
                }}'''
                stores_jsonld.append(store_json)
            
            city_page = city_page.replace('{{STORES_JSON_LD}}', ',\n                '.join(stores_jsonld))
            
            # Write city page
            with open(f'{city_dir}/index.html', 'w', encoding='utf-8') as f:
                f.write(city_page)
            
            print(f"Generated {city}, {state} city page ({len(city_stores)} stores)")
    
    # Update homepage with real data
    print("Updating homepage with real data...")
    update_homepage(df, states_data)
    
    print("Page generation complete!")
    print(f"Generated pages for {len(states_data)} states")
    total_cities = sum(len(cities) for cities in states_data.values())
    print(f"Generated pages for {total_cities} cities")

def update_homepage(df, states_data):
    """Update homepage with real featured stores"""
    
    # Get top stores across all states
    all_stores = df.sort_values('Number of Reviews', ascending=False)
    featured_stores = all_stores.head(6)  # Top 6 stores for homepage
    
    featured_stores_html = '\n'.join([generate_store_card_html(store) for _, store in featured_stores.iterrows()])
    
    # Read current homepage
    with open('index.html', 'r', encoding='utf-8') as f:
        homepage = f.read()
    
    # Replace the sample store card with real data
    sample_card = '''<div class="store-card">
                        <h3 class="store-name">Sample Consignment Store</h3>
                        <p class="store-address">123 Main Street, Sample City, CA 90210</p>
                        <p class="store-reviews">★★★★★ (245 reviews)</p>
                        <div class="store-features">
                            <span class="feature-tag">Clothing</span>
                            <span class="feature-tag">Furniture</span>
                            <span class="feature-tag">Antiques</span>
                            <span class="feature-tag">Friendly Staff</span>
                        </div>
                        <div class="store-contact">
                            <a href="tel:555-123-4567" class="contact-link">📞 Call</a>
                            <a href="https://example.com" class="contact-link" target="_blank">🌐 Website</a>
                        </div>
                    </div>'''
    
    homepage = homepage.replace(sample_card, featured_stores_html)
    
    # Update state counts
    state_counts = {state: sum(len(stores) for stores in cities.values()) 
                   for state, cities in states_data.items()}
    
    # Update popular states with real counts
    ca_count = state_counts.get('California', 0)
    tx_count = state_counts.get('Texas', 0)
    fl_count = state_counts.get('Florida', 0)
    ny_count = state_counts.get('New York', 0)
    
    homepage = homepage.replace('850+ stores', f'{ca_count}+ stores')
    homepage = homepage.replace('650+ stores', f'{tx_count}+ stores')
    homepage = homepage.replace('450+ stores', f'{fl_count}+ stores')
    homepage = homepage.replace('400+ stores', f'{ny_count}+ stores')
    
    # Write updated homepage
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(homepage)

if __name__ == '__main__':
    main()