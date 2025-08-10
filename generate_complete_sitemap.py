#!/usr/bin/env python3

import csv
import xml.dom.minidom
from datetime import datetime
from collections import defaultdict

def slugify(text):
    """Convert text to URL-friendly slug"""
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def generate_complete_sitemap():
    """Generate complete XML sitemap with all pages"""
    
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
    
    # Current date for sitemap
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    # Start building XML
    xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    # Homepage
    xml_content.append('    <!-- Homepage -->')
    xml_content.append('    <url>')
    xml_content.append('        <loc>https://consignmentstoresnearme.com/</loc>')
    xml_content.append(f'        <lastmod>{current_date}</lastmod>')
    xml_content.append('        <changefreq>daily</changefreq>')
    xml_content.append('        <priority>1.0</priority>')
    xml_content.append('    </url>')
    xml_content.append('')
    
    # About Page
    xml_content.append('    <!-- About Page -->')
    xml_content.append('    <url>')
    xml_content.append('        <loc>https://consignmentstoresnearme.com/about/</loc>')
    xml_content.append(f'        <lastmod>{current_date}</lastmod>')
    xml_content.append('        <changefreq>monthly</changefreq>')
    xml_content.append('        <priority>0.8</priority>')
    xml_content.append('    </url>')
    xml_content.append('')
    
    # HTML Sitemap
    xml_content.append('    <!-- HTML Sitemap -->')
    xml_content.append('    <url>')
    xml_content.append('        <loc>https://consignmentstoresnearme.com/sitemap/</loc>')
    xml_content.append(f'        <lastmod>{current_date}</lastmod>')
    xml_content.append('        <changefreq>weekly</changefreq>')
    xml_content.append('        <priority>0.6</priority>')
    xml_content.append('    </url>')
    xml_content.append('')
    
    # State Pages
    xml_content.append('    <!-- State Pages -->')
    states_list = list(state_cities.keys())
    states_list.sort()
    
    for state in states_list:
        state_slug = state_slugs.get(state, slugify(state))
        xml_content.append('    <url>')
        xml_content.append(f'        <loc>https://consignmentstoresnearme.com/{state_slug}/</loc>')
        xml_content.append(f'        <lastmod>{current_date}</lastmod>')
        xml_content.append('        <changefreq>weekly</changefreq>')
        xml_content.append('        <priority>0.9</priority>')
        xml_content.append('    </url>')
    
    xml_content.append('')
    
    # City Pages
    xml_content.append('    <!-- City Pages -->')
    total_cities = 0
    
    for state in states_list:
        state_slug = state_slugs.get(state, slugify(state))
        cities = sorted(list(state_cities[state]))
        
        for city in cities:
            city_slug = slugify(city)
            xml_content.append('    <url>')
            xml_content.append(f'        <loc>https://consignmentstoresnearme.com/{state_slug}/{city_slug}/</loc>')
            xml_content.append(f'        <lastmod>{current_date}</lastmod>')
            xml_content.append('        <changefreq>weekly</changefreq>')
            xml_content.append('        <priority>0.8</priority>')
            xml_content.append('    </url>')
            total_cities += 1
    
    xml_content.append('</urlset>')
    
    # Write sitemap
    sitemap_content = '\n'.join(xml_content)
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print(f"Complete XML sitemap generated successfully!")
    print(f"Total pages in sitemap:")
    print(f"  - 1 Homepage")
    print(f"  - 1 About page") 
    print(f"  - 1 HTML sitemap")
    print(f"  - {len(states_list)} State pages")
    print(f"  - {total_cities} City pages")
    print(f"  - TOTAL: {3 + len(states_list) + total_cities} pages")
    
    # Also create a simplified version for testing
    with open('sitemap_summary.txt', 'w', encoding='utf-8') as f:
        f.write(f"Sitemap Summary - Generated {current_date}\n")
        f.write("="*50 + "\n\n")
        f.write("MAIN PAGES:\n")
        f.write("- Homepage (/)\n")
        f.write("- About page (/about/)\n")
        f.write("- HTML sitemap (/sitemap/)\n\n")
        
        f.write(f"STATE PAGES ({len(states_list)} total):\n")
        for state in states_list:
            state_slug = state_slugs.get(state, slugify(state))
            f.write(f"- {state} (/{state_slug}/)\n")
        
        f.write(f"\nCITY PAGES ({total_cities} total):\n")
        for state in states_list[:5]:  # Show first 5 states as example
            state_slug = state_slugs.get(state, slugify(state))
            cities = sorted(list(state_cities[state]))
            f.write(f"\n{state} cities:\n")
            for city in cities[:10]:  # Show first 10 cities per state
                city_slug = slugify(city)
                f.write(f"  - {city} (/{state_slug}/{city_slug}/)\n")
            if len(cities) > 10:
                f.write(f"  ... and {len(cities) - 10} more cities\n")
        
        f.write(f"\n... and cities for {len(states_list) - 5} more states\n")
        f.write(f"\nTOTAL PAGES: {3 + len(states_list) + total_cities}\n")

if __name__ == '__main__':
    generate_complete_sitemap()