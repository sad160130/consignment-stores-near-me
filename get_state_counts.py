#!/usr/bin/env python3

import csv
import json
from collections import defaultdict

def get_state_counts():
    """Read CSV and return state counts and store data"""
    
    state_counts = defaultdict(int)
    state_stores = defaultdict(list)
    
    with open('consignment_stores.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            state = row['State']
            state_counts[state] += 1
            state_stores[state].append({
                'name': row['Business Name'],
                'city': row['City'],
                'reviews': int(row['Number of Reviews']) if row['Number of Reviews'].isdigit() else 0
            })
    
    # Sort states by count (descending)
    sorted_states = sorted(state_counts.items(), key=lambda x: x[1], reverse=True)
    
    print("State counts (sorted by store count):")
    for state, count in sorted_states:
        print(f"{state}: {count} stores")
    
    print(f"\nTotal states: {len(state_counts)}")
    print(f"Total stores: {sum(state_counts.values())}")
    
    # Get top stores by reviews for each state
    top_states_data = {}
    for state, stores in state_stores.items():
        # Sort by reviews descending and take top 3
        top_stores = sorted(stores, key=lambda x: x['reviews'], reverse=True)[:3]
        top_states_data[state] = {
            'count': state_counts[state],
            'top_stores': top_stores
        }
    
    return sorted_states, top_states_data

def create_state_links_html(sorted_states):
    """Create HTML for state links section"""
    
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
    
    # Take top 12 states for the main grid
    top_12_states = sorted_states[:12]
    
    html_links = []
    for state, count in top_12_states:
        slug = state_slugs.get(state, state.lower().replace(' ', '-'))
        store_text = f"{count} store{'s' if count != 1 else ''}"
        
        html_links.append(f'''<a href="/{slug}/" style="background: var(--light-blue); padding: 20px; text-align: center; text-decoration: none; color: var(--dark-blue); border-radius: 8px; font-weight: 500; transition: all 0.3s ease;">
                        {state}
                        <span style="display: block; font-size: 14px; color: var(--dark-gray); margin-top: 5px;">{store_text}</span>
                    </a>''')
    
    return '\n                    '.join(html_links)

if __name__ == '__main__':
    sorted_states, top_states_data = get_state_counts()
    
    # Generate HTML for homepage
    html_content = create_state_links_html(sorted_states)
    
    print("\n" + "="*50)
    print("HTML for homepage state links section:")
    print("="*50)
    print(html_content)
    
    # Also save to JSON for future use
    with open('state_data.json', 'w', encoding='utf-8') as f:
        json.dump({
            'sorted_states': sorted_states,
            'state_details': top_states_data
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\nState data saved to state_data.json")