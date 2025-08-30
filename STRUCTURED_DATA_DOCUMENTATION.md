# Structured Data Implementation Documentation

## Overview
This document explains the comprehensive structured data implementation using JSON-LD with entities, predicates, and triples to establish semantic relationships between Stores, Cities, and States.

## Entity Types and Relationships

### 1. Store Entity (LocalBusiness)
Each consignment store is represented as a `LocalBusiness` entity with the following key properties and relationships:

```json
{
  "@type": ["Store", "LocalBusiness"],
  "@id": "https://california.consignmentstores.site/victorville/#store-goodwill",
  "name": "Goodwill Store",
  "location": {
    "@type": "Place",
    "@id": "https://california.consignmentstores.site/victorville/#city"
  }
}
```

**Key Relationships:**
- `location` → links to City entity (Store *is located in* City)
- `address` → contains detailed PostalAddress
- `makesOffer` → lists products/services offered
- `parentOrganization` → links to the directory

### 2. City Entity
Cities are represented as `City` type entities:

```json
{
  "@type": "City",
  "@id": "https://california.consignmentstores.site/victorville/#city",
  "name": "Victorville",
  "containedInPlace": {
    "@type": "State",
    "@id": "https://california.consignmentstores.site/#state"
  }
}
```

**Key Relationships:**
- `containedInPlace` → links to State entity (City *is part of* State)

### 3. State Entity
States are represented as `State` type entities:

```json
{
  "@type": "State",
  "@id": "https://california.consignmentstores.site/#state",
  "name": "California",
  "containedInPlace": {
    "@type": "Country",
    "name": "United States"
  }
}
```

**Key Relationships:**
- `containedInPlace` → links to Country (State *is part of* USA)

## Triple Relationships (Subject-Predicate-Object)

The implementation creates semantic triples that search engines can understand:

1. **Store → is located in → City**
   - Subject: Store (e.g., "Goodwill Store")
   - Predicate: location/is located in
   - Object: City (e.g., "Victorville")

2. **City → is part of → State**
   - Subject: City (e.g., "Victorville")
   - Predicate: containedInPlace/is part of
   - Object: State (e.g., "California")

3. **State → is part of → Country**
   - Subject: State (e.g., "California")
   - Predicate: containedInPlace/is part of
   - Object: Country (e.g., "United States")

4. **Store → offers → Product**
   - Subject: Store
   - Predicate: makesOffer
   - Object: Product types (Clothing, Furniture, Jewelry, etc.)

## Implementation Files

### 1. Enhanced Structured Data Generator (`lib/structured-data-enhanced.ts`)
Contains functions to generate:
- `generateStateEntity()` - Creates State entities
- `generateCityEntity()` - Creates City entities
- `generateEnhancedStoreEntity()` - Creates detailed Store entities
- `generateSemanticGraph()` - Creates complete graph with all relationships
- `generateCompleteCityPageStructuredData()` - Full city page structured data
- `generateCompleteStatePageStructuredData()` - Full state page structured data

### 2. Page Implementations

#### City Pages (`app/[state]/[city]/page.tsx`)
- Implements `generateCompleteCityPageStructuredData()`
- Creates a graph containing:
  - All stores in the city
  - City entity
  - State entity
  - Relationships between all entities

#### State Pages (`app/[state]/page.tsx`)
- Implements `generateCompleteStatePageStructuredData()`
- Creates a graph containing:
  - State entity
  - List of cities
  - Aggregate store information

#### Home Page (`app/page.tsx`)
- Implements WebSite and Organization entities
- Creates ItemList of all states
- Implements SearchAction for site search

## Example: Complete Store Entity

Here's a full example of a store in Victorville, California:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Store", "LocalBusiness"],
      "@id": "https://california.consignmentstores.site/victorville/#store-vintage-finds",
      "name": "Vintage Finds Consignment",
      "description": "Quality consignment store offering vintage clothing and furniture",
      "location": {
        "@type": "Place",
        "@id": "https://california.consignmentstores.site/victorville/#city",
        "name": "Victorville",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Main St",
          "addressLocality": "Victorville",
          "addressRegion": "CA",
          "addressCountry": "US"
        }
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main St",
        "addressLocality": "Victorville",
        "addressRegion": "CA",
        "addressCountry": "US"
      },
      "telephone": "(760) 555-0123",
      "url": "https://vintagefinds.com",
      "aggregateRating": {
        "@type": "AggregateRating",
        "reviewCount": 45
      },
      "makesOffer": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Clothing",
            "category": "Apparel"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Furniture",
            "category": "Home & Garden"
          }
        }
      ],
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Wide Selection",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Friendly Staff",
          "value": true
        }
      ],
      "priceRange": "$-$$"
    },
    {
      "@type": "City",
      "@id": "https://california.consignmentstores.site/victorville/#city",
      "name": "Victorville",
      "containedInPlace": {
        "@type": "State",
        "@id": "https://california.consignmentstores.site/#state",
        "name": "California"
      }
    },
    {
      "@type": "State",
      "@id": "https://california.consignmentstores.site/#state",
      "name": "California",
      "containedInPlace": {
        "@type": "Country",
        "name": "United States"
      }
    }
  ]
}
```

## Benefits of This Implementation

1. **Rich Entity Relationships**: Search engines understand the hierarchical relationship between stores, cities, and states
2. **Enhanced Local SEO**: Detailed location data helps with local search rankings
3. **Product/Service Recognition**: Clear indication of what each store offers
4. **Review Integration**: Aggregate ratings are properly structured
5. **Semantic Understanding**: Search engines can answer complex queries like "furniture stores in California cities"
6. **Knowledge Graph Integration**: Data is formatted for inclusion in Google's Knowledge Graph

## Testing the Implementation

You can test the structured data using:
1. [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)
3. [Google Search Console](https://search.google.com/search-console)

## Future Enhancements

Potential additions to the structured data:
- Opening hours for each store
- Price range indicators
- Special offers or events
- Store images and galleries
- Customer reviews with detailed content
- Geo-coordinates for map integration
- Accessibility information
- Payment methods accepted