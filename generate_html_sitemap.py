#!/usr/bin/env python3

import csv
from collections import defaultdict

def slugify(text):
    """Convert text to URL-friendly slug"""
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def generate_html_sitemap():
    """Generate comprehensive HTML sitemap"""
    
    # State name to URL slug mapping
    state_slugs = {
        'Alabama': 'alabama', 'Alaska': 'alaska', 'Arizona': 'arizona', 'Arkansas': 'arkansas',
        'California': 'california', 'Colorado': 'colorado', 'Connecticut': 'connecticut',
        'Delaware': 'delaware', 'Florida': 'florida', 'Georgia': 'georgia', 'Hawaii': 'hawaii',
        'Idaho': 'idaho', 'Illinois': 'illinois', 'Indiana': 'indiana', 'Iowa': 'iowa',
        'Kansas': 'kansas', 'Kentucky': 'kentucky', 'Louisiana': 'louisiana', 'Maine': 'maine',
        'Maryland': 'maryland', 'Massachusetts': 'massachusetts', 'Michigan': 'michigan',
        'Minnesota': 'minnesota', 'Mississippi': 'mississippi', 'Missouri': 'missouri',
        'Montana': 'montana', 'Nebraska': 'nebraska', 'Nevada': 'nevada', 'New Hampshire': 'new-hampshire',
        'New Jersey': 'new-jersey', 'New Mexico': 'new-mexico', 'New York': 'new-york',
        'North Carolina': 'north-carolina', 'North Dakota': 'north-dakota', 'Ohio': 'ohio',
        'Oklahoma': 'oklahoma', 'Oregon': 'oregon', 'Pennsylvania': 'pennsylvania',
        'Rhode Island': 'rhode-island', 'South Carolina': 'south-carolina', 'South Dakota': 'south-dakota',
        'Tennessee': 'tennessee', 'Texas': 'texas', 'Utah': 'utah', 'Vermont': 'vermont',
        'Virginia': 'virginia', 'Washington': 'washington', 'West Virginia': 'west-virginia',
        'Wisconsin': 'wisconsin', 'Wyoming': 'wyoming', 'District of Columbia': 'district-of-columbia'
    }
    
    # Read CSV and organize data
    state_cities = defaultdict(set)
    
    with open('consignment_stores.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            state = row['State'].strip()
            city = row['City'].strip()
            if state and city:
                state_cities[state].add(city)
    
    # Sort states alphabetically
    sorted_states = sorted(state_cities.keys())
    
    # Group states for columns
    states_per_column = len(sorted_states) // 4
    if len(sorted_states) % 4:
        states_per_column += 1
    
    state_groups = [
        sorted_states[0:13],      # A-F  
        sorted_states[13:26],     # G-M
        sorted_states[26:39],     # N-T
        sorted_states[39:52],     # U-W + DC
    ]
    
    group_labels = ['A - F', 'G - M', 'N - T', 'U - W']
    
    # Generate states HTML sections
    states_html = []
    for i, group in enumerate(state_groups):
        if not group:
            continue
            
        states_html.append(f'''                <div style="background: var(--light-blue); padding: 20px; border-radius: 8px;">
                    <h3 style="color: var(--dark-blue); margin-bottom: 15px; font-size: 16px;">{group_labels[i]}</h3>
                    <ul style="list-style: none; padding: 0; line-height: 1.8;">''')
        
        for state in group:
            state_slug = state_slugs.get(state, slugify(state))
            city_count = len(state_cities[state])
            states_html.append(f'                        <li><a href="/{state_slug}/">{state}</a> <span style="color: var(--dark-gray); font-size: 12px;">({city_count} cities)</span></li>')
        
        states_html.append('                    </ul>')
        states_html.append('                </div>')
    
    # Get popular cities for display
    popular_cities_by_state = {}
    
    # Top states by city count for popular cities section
    top_states = sorted(state_cities.items(), key=lambda x: len(x[1]), reverse=True)[:6]
    
    for state, cities in top_states:
        state_slug = state_slugs.get(state, slugify(state))
        # Take first 5 cities alphabetically for each state
        popular_cities_by_state[state] = {
            'slug': state_slug,
            'cities': sorted(list(cities))[:5]
        }
    
    # Generate popular cities HTML
    popular_cities_html = []
    for state, data in popular_cities_by_state.items():
        popular_cities_html.append(f'''                    <div>
                        <h3 style="color: var(--dark-blue); margin-bottom: 15px; font-size: 16px;">{state} ({len(state_cities[state])} cities)</h3>
                        <ul style="list-style: none; padding: 0; line-height: 1.6;">''')
        
        for city in data['cities']:
            city_slug = slugify(city)
            popular_cities_html.append(f'                            <li><a href="/{data["slug"]}/{city_slug}/">{city} Consignment Stores</a></li>')
        
        if len(state_cities[state]) > 5:
            popular_cities_html.append(f'                            <li><a href="/{data["slug"]}/" style="color: var(--primary-blue); font-weight: 500;">View all {len(state_cities[state])} cities →</a></li>')
        
        popular_cities_html.append('                        </ul>')
        popular_cities_html.append('                    </div>')
    
    # Calculate totals
    total_states = len(state_cities)
    total_cities = sum(len(cities) for cities in state_cities.values())
    
    # Create the complete HTML
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Sitemap - 2,600+ Consignment Stores Across {total_states} States | Consignment Stores Near Me</title>
    <meta name="description" content="Complete directory sitemap of all {total_cities:,} cities with consignment stores across {total_states} US states. Browse 2,600+ secondhand shops and thrift stores by location.">
    <meta name="keywords" content="consignment stores sitemap, thrift stores directory, secondhand shops by state, consignment stores by city">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.consignmentstores.site/sitemap/">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/css/main.css">
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Consignment Stores Directory Sitemap",
        "description": "Complete directory of consignment stores across {total_states} US states and {total_cities} cities",
        "url": "https://www.consignmentstores.site/sitemap/",
        "numberOfItems": "{total_cities}"
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
                                    <a href="/district-of-columbia/" class="dropdown-item">District of Columbia</a>
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
                    <span>Complete Sitemap</span>
                </li>
            </ol>
        </nav>

        <!-- Page Header -->
        <section class="page-hero">
            <div class="container">
                <h1>Complete Directory Sitemap</h1>
                <p class="lead">Navigate our comprehensive directory of 2,600+ consignment stores across {total_states} states and {total_cities:,} cities in the United States.</p>
            </div>
        </section>

        <!-- Main Pages Section -->
        <section class="main-pages">
            <div class="container">
                <h2>Main Pages</h2>
                <div class="pages-grid">
                    <div class="page-card">
                        <h3><a href="/">🏠 Homepage</a></h3>
                        <p>Search and discover consignment stores near you</p>
                    </div>
                    <div class="page-card">
                        <h3><a href="/about/">ℹ️ About Us</a></h3>
                        <p>Learn about our mission and directory</p>
                    </div>
                    <div class="page-card">
                        <h3><a href="/sitemap/">🗺️ HTML Sitemap</a></h3>
                        <p>Complete directory navigation</p>
                    </div>
                    <div class="page-card">
                        <h3><a href="/sitemap.xml">🔗 XML Sitemap</a></h3>
                        <p>Machine-readable sitemap for search engines</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- States Section -->
        <section class="states-section">
            <div class="container">
                <h2>Browse by State ({total_states} states)</h2>
                <p class="section-subtitle">Every state in the US with comprehensive consignment store listings</p>
                <div class="states-grid">
{chr(10).join(states_html)}
                </div>
            </div>
        </section>

        <!-- Popular Cities Section -->
        <section class="cities-section">
            <div class="container">
                <h2>Popular Cities ({total_cities:,} cities total)</h2>
                <p class="section-subtitle">Browse consignment stores in major cities across the United States</p>
                <div class="cities-grid">
{chr(10).join(popular_cities_html)}
                </div>
            </div>
        </section>

        <!-- Summary Statistics -->
        <section class="stats-section">
            <div class="container">
                <h2>Directory Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">2,600+</div>
                        <div class="stat-label">Consignment Stores</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{total_cities:,}</div>
                        <div class="stat-label">Cities Covered</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{total_states}</div>
                        <div class="stat-label">States + DC</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">1,775</div>
                        <div class="stat-label">Total Pages</div>
                    </div>
                </div>
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
                    <h3>Top States</h3>
                    <ul>
                        <li><a href="/california/">California ({len(state_cities.get("California", []))} cities)</a></li>
                        <li><a href="/texas/">Texas ({len(state_cities.get("Texas", []))} cities)</a></li>
                        <li><a href="/florida/">Florida ({len(state_cities.get("Florida", []))} cities)</a></li>
                        <li><a href="/new-york/">New York ({len(state_cities.get("New York", []))} cities)</a></li>
                        <li><a href="/pennsylvania/">Pennsylvania ({len(state_cities.get("Pennsylvania", []))} cities)</a></li>
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
                <p>&copy; 2024 Consignment Stores Near Me. All rights reserved. Comprehensive directory of {total_cities:,} cities with consignment stores.</p>
            </div>
        </div>
    </footer>

    <style>
        .page-hero {{
            background: linear-gradient(135deg, var(--primary-blue), var(--dark-blue));
            color: var(--white);
            padding: 3rem 0;
            text-align: center;
            margin-bottom: 3rem;
        }}
        
        .page-hero h1 {{
            color: var(--white);
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }}
        
        .main-pages, .states-section, .cities-section, .stats-section {{
            padding: 3rem 0;
        }}
        
        .states-section {{
            background-color: var(--light-gray);
        }}
        
        .section-subtitle {{
            text-align: center;
            color: var(--gray);
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }}
        
        .pages-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }}
        
        .page-card {{
            background-color: var(--white);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: var(--shadow);
        }}
        
        .page-card h3 a {{
            color: var(--dark-blue);
            text-decoration: none;
            font-size: 1.2rem;
        }}
        
        .states-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }}
        
        .cities-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }}
        
        .stats-section {{
            background-color: var(--light-gray);
        }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }}
        
        .stat-card {{
            background-color: var(--white);
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            box-shadow: var(--shadow);
        }}
        
        .stat-number {{
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary-blue);
            margin-bottom: 0.5rem;
        }}
        
        .stat-label {{
            color: var(--gray);
            font-size: 1.1rem;
        }}
        
        @media (max-width: 768px) {{
            .page-hero h1 {{
                font-size: 2rem;
            }}
            
            .stat-number {{
                font-size: 2rem;
            }}
        }}
    </style>
</body>
</html>'''

    # Write the HTML sitemap
    with open('sitemap/index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Comprehensive HTML sitemap generated successfully!")
    print(f"  - {total_states} states")
    print(f"  - {total_cities:,} cities")
    print(f"  - Complete navigation structure")
    print(f"  - SEO optimized with structured data")

if __name__ == '__main__':
    generate_html_sitemap()