# Schema Markup Examples for consignmentstores.site

## State Page Example: https://www.consignmentstores.site/new-hampshire/

```json
[
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.consignmentstores.site/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "New Hampshire"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.consignmentstores.site/new-hampshire/",
    "url": "https://www.consignmentstores.site/new-hampshire/",
    "name": "Consignment Stores in New Hampshire",
    "description": "Find the best consignment stores in New Hampshire. Browse 45 stores across 12 cities. Quality second-hand furniture, clothing, and vintage items.",
    "breadcrumb": {
      "@id": "https://www.consignmentstores.site/new-hampshire/#breadcrumb"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 45,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "LocalBusiness",
            "name": "Timeless Treasures Consignment",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Main St",
              "addressLocality": "Manchester",
              "addressRegion": "NH"
            },
            "telephone": "(603) 555-0123",
            "url": "https://timelesstreasures.com",
            "aggregateRating": {
              "@type": "AggregateRating",
              "reviewCount": 127
            }
          }
        }
      ]
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Consignment Stores Directory",
      "url": "https://www.consignmentstores.site"
    }
  }
]
```

## City Page Example: https://www.consignmentstores.site/new-hampshire/intervale/

```json
[
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.consignmentstores.site/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "New Hampshire",
        "item": "https://www.consignmentstores.site/new-hampshire/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Intervale"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.consignmentstores.site/new-hampshire/intervale/",
    "url": "https://www.consignmentstores.site/new-hampshire/intervale/",
    "name": "Consignment Stores in Intervale, New Hampshire",
    "description": "Find the best consignment stores in Intervale, New Hampshire. Browse 3 top-rated stores with reviews. Quality second-hand furniture, clothing, and vintage items.",
    "breadcrumb": {
      "@id": "https://www.consignmentstores.site/new-hampshire/intervale/#breadcrumb"
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Consignment Stores Directory",
      "url": "https://www.consignmentstores.site"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.consignmentstores.site/new-hampshire/intervale/#vintage-valley-consignment",
    "name": "Vintage Valley Consignment",
    "description": "Vintage Valley Consignment is a consignment store located in Intervale, NH offering quality second-hand items.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "456 Route 16",
      "addressLocality": "Intervale",
      "addressRegion": "NH",
      "addressCountry": "US"
    },
    "telephone": "(603) 555-0456",
    "url": "https://vintagevalley.com",
    "sameAs": ["https://vintagevalley.com"],
    "image": "https://vintagevalley.com/images/storefront.jpg",
    "aggregateRating": {
      "@type": "AggregateRating",
      "reviewCount": 89
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Clothing"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Furniture"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Antiques"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Jewelry"
        }
      }
    ],
    "priceRange": "$",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wide Selection"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Clean & Organized"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Friendly Staff"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.consignmentstores.site/new-hampshire/intervale/#mountain-treasures",
    "name": "Mountain Treasures",
    "description": "Mountain Treasures is a consignment store located in Intervale, NH offering quality second-hand items.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "789 White Mountain Hwy",
      "addressLocality": "Intervale",
      "addressRegion": "NH",
      "addressCountry": "US"
    },
    "telephone": "(603) 555-0789",
    "aggregateRating": {
      "@type": "AggregateRating",
      "reviewCount": 45
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Books"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Gift Items"
        }
      }
    ],
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Friendly Staff"
      }
    ]
  }
]
```

## Key Features of the Schema Implementation:

### State Pages Include:
- **BreadcrumbList**: Navigation path from home to state
- **CollectionPage**: Main page schema with description and store count
- **ItemList**: Up to 10 featured stores with LocalBusiness details
- **WebSite**: Reference to parent website

### City Pages Include:
- **BreadcrumbList**: Full navigation path (Home > State > City)
- **CollectionPage**: Page schema with local description
- **LocalBusiness** (multiple): Detailed schema for EACH store including:
  - Complete postal address
  - Phone numbers and website URLs
  - Review counts (aggregateRating)
  - Product categories (makesOffer)
  - Store features (amenityFeature)
  - Price range indicators
  - Images (when available)

### Benefits:
1. **Enhanced Search Results**: Rich snippets in Google with ratings, addresses, and contact info
2. **Local SEO**: Improved visibility in local search and Google Maps
3. **Knowledge Graph**: Better chance of appearing in Google's Knowledge Panel
4. **Voice Search**: Optimized for voice assistants and smart speakers
5. **Mobile Search**: Better display on mobile devices with structured data

The schema markup is automatically generated and inserted into every state and city page, ensuring consistent structured data across the entire website.