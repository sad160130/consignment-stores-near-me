import { ConsignmentStore } from './data-processor';

/**
 * Enhanced structured data generator with entities, predicates, and triples
 * Implements semantic relationships between Store, City, and State entities
 */

// Generate Place entity for State
export function generateStateEntity(stateName: string, stateSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "State",
    "@id": `https://${stateSlug}.consignmentstores.site/#state`,
    "name": stateName,
    "url": `https://${stateSlug}.consignmentstores.site/`,
    "sameAs": [
      `https://en.wikipedia.org/wiki/${stateName.replace(/ /g, '_')}`,
      `https://www.wikidata.org/wiki/${stateName.replace(/ /g, '_')}`
    ],
    "containedInPlace": {
      "@type": "Country",
      "@id": "https://www.consignmentstores.site/#usa",
      "name": "United States",
      "alternateName": "USA"
    },
    "geo": {
      "@type": "GeoShape",
      "addressCountry": "US"
    }
  };
}

// Generate Place entity for City
export function generateCityEntity(
  cityName: string,
  citySlug: string,
  stateName: string,
  stateSlug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "City",
    "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#city`,
    "name": cityName,
    "url": `https://${stateSlug}.consignmentstores.site/${citySlug}/`,
    "containedInPlace": {
      "@type": "State",
      "@id": `https://${stateSlug}.consignmentstores.site/#state`,
      "name": stateName,
      "url": `https://${stateSlug}.consignmentstores.site/`
    },
    "geo": {
      "@type": "GeoShape",
      "addressCountry": "US",
      "addressRegion": stateName
    }
  };
}

// Generate enhanced LocalBusiness entity with relationships
export function generateEnhancedStoreEntity(
  store: ConsignmentStore,
  citySlug: string,
  stateSlug: string
) {
  const storeId = store.businessName.toLowerCase().replace(/[^\w]+/g, '-');
  
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#store-${storeId}`,
    "name": store.businessName,
    "description": store.seoDescription || `${store.businessName} is a consignment store offering quality second-hand items in ${store.city}, ${store.state}.`,
    
    // Location relationship (Store -> is located in -> City)
    "location": {
      "@type": "Place",
      "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#city`,
      "name": store.city,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": store.address,
        "addressLocality": store.city,
        "addressRegion": store.state,
        "addressCountry": "US"
      }
    },
    
    // Detailed address
    "address": {
      "@type": "PostalAddress",
      "streetAddress": store.address,
      "addressLocality": store.city,
      "addressRegion": store.state,
      "addressCountry": "US",
      "availableLanguage": {
        "@type": "Language",
        "name": "English",
        "alternateName": "en"
      }
    },
    
    // Contact information
    ...(store.phone ? { 
      "telephone": store.phone,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": store.phone,
        "contactType": "customer service"
      }
    } : {}),
    
    ...(store.site ? { 
      "url": store.site,
      "sameAs": [store.site]
    } : {}),
    
    ...(store.photo ? { 
      "image": store.photo,
      "photo": {
        "@type": "ImageObject",
        "url": store.photo,
        "caption": `${store.businessName} storefront`
      }
    } : {}),
    
    // Reviews and ratings
    ...(store.numberOfReviews > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "reviewCount": store.numberOfReviews,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": {
        "@type": "Review",
        "reviewCount": store.numberOfReviews
      }
    } : {}),
    
    // Business categories and offerings
    "additionalType": [
      "https://schema.org/Store",
      "https://schema.org/LocalBusiness",
      "ConsignmentStore",
      "ThriftStore",
      "SecondHandStore"
    ],
    
    // Products and services offered
    "makesOffer": [
      ...(store.sellClothes ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Clothing",
          "category": "Apparel"
        }
      }] : []),
      ...(store.sellFurniture ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Furniture",
          "category": "Home & Garden"
        }
      }] : []),
      ...(store.sellJewelry ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Jewelry",
          "category": "Jewelry & Accessories"
        }
      }] : []),
      ...(store.sellAntiques ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Antiques",
          "category": "Antiques & Collectibles"
        }
      }] : []),
      ...(store.sellBooks ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Books",
          "category": "Books & Media"
        }
      }] : []),
      ...(store.sellGiftItems ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Gift Items",
          "category": "Gifts"
        }
      }] : []),
      ...(store.sellPremiumBrand ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Premium Brands",
          "category": "Designer & Luxury"
        }
      }] : []),
      ...(store.sellMerchandise ? [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "General Merchandise",
          "category": "Various"
        }
      }] : [])
    ].filter(offer => offer !== undefined),
    
    // Store features and amenities
    "amenityFeature": [
      ...(store.wideSelection ? [{
        "@type": "LocationFeatureSpecification",
        "name": "Wide Selection",
        "value": true
      }] : []),
      ...(store.cleanOrganized ? [{
        "@type": "LocationFeatureSpecification",
        "name": "Clean & Organized",
        "value": true
      }] : []),
      ...(store.friendlyEmployees ? [{
        "@type": "LocationFeatureSpecification",
        "name": "Friendly Staff",
        "value": true
      }] : []),
      ...(store.pricing ? [{
        "@type": "LocationFeatureSpecification",
        "name": "Competitive Pricing",
        "value": true
      }] : [])
    ].filter(feature => feature !== undefined),
    
    // Price range
    ...(store.pricing ? { "priceRange": "$-$$" } : {}),
    
    // Business type
    "businessType": ["Retail", "Consignment", "Second-hand"],
    
    // Payment accepted (common for consignment stores)
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    
    // Accessibility (standard assumption)
    "publicAccess": true,
    
    // Parent organization relationship
    "parentOrganization": {
      "@type": "Organization",
      "name": "Consignment Stores Directory",
      "url": "https://www.consignmentstores.site"
    }
  };
}

// Generate Graph with all entities and relationships
export function generateSemanticGraph(
  store: ConsignmentStore,
  citySlug: string,
  stateSlug: string
) {
  const storeEntity = generateEnhancedStoreEntity(store, citySlug, stateSlug);
  const cityEntity = generateCityEntity(store.city, citySlug, store.state, stateSlug);
  const stateEntity = generateStateEntity(store.state, stateSlug);
  
  // Create a graph with all entities and their relationships
  return {
    "@context": "https://schema.org",
    "@graph": [
      storeEntity,
      cityEntity,
      stateEntity,
      {
        "@type": "WebPage",
        "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#webpage`,
        "url": `https://${stateSlug}.consignmentstores.site/${citySlug}/`,
        "name": `Consignment Stores in ${store.city}, ${store.state}`,
        "description": `Find consignment stores in ${store.city}, ${store.state}. Browse quality second-hand items, furniture, clothing, and vintage treasures.`,
        "breadcrumb": {
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
              "name": store.state,
              "item": `https://${stateSlug}.consignmentstores.site/`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": store.city,
              "item": `https://${stateSlug}.consignmentstores.site/${citySlug}/`
            }
          ]
        },
        "about": [
          { "@id": storeEntity["@id"] },
          { "@id": cityEntity["@id"] },
          { "@id": stateEntity["@id"] }
        ],
        "mainEntity": { "@id": storeEntity["@id"] },
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.consignmentstores.site/#website",
          "name": "Consignment Stores Near Me",
          "url": "https://www.consignmentstores.site/"
        }
      }
    ]
  };
}

// Generate ItemList for multiple stores on a page
export function generateStoreItemList(
  stores: ConsignmentStore[],
  cityName: string,
  citySlug: string,
  stateName: string,
  stateSlug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#itemlist`,
    "name": `Consignment Stores in ${cityName}, ${stateName}`,
    "description": `List of ${stores.length} consignment stores in ${cityName}, ${stateName}`,
    "numberOfItems": stores.length,
    "itemListElement": stores.map((store, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": generateEnhancedStoreEntity(store, citySlug, stateSlug)
    }))
  };
}

// Generate complete structured data for a city page
export function generateCompleteCityPageStructuredData(
  stores: ConsignmentStore[],
  cityName: string,
  citySlug: string,
  stateName: string,
  stateSlug: string
) {
  const cityEntity = generateCityEntity(cityName, citySlug, stateName, stateSlug);
  const stateEntity = generateStateEntity(stateName, stateSlug);
  const storesList = generateStoreItemList(stores, cityName, citySlug, stateName, stateSlug);
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      cityEntity,
      stateEntity,
      storesList,
      {
        "@type": "CollectionPage",
        "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#page`,
        "url": `https://${stateSlug}.consignmentstores.site/${citySlug}/`,
        "name": `Consignment Stores in ${cityName}, ${stateName}`,
        "description": `Browse ${stores.length} consignment stores in ${cityName}, ${stateName}. Find quality second-hand furniture, clothing, vintage items and more.`,
        "breadcrumb": {
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
              "name": stateName,
              "item": `https://${stateSlug}.consignmentstores.site/`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": cityName
            }
          ]
        },
        "about": [
          { "@id": cityEntity["@id"] },
          { "@id": stateEntity["@id"] }
        ],
        "mainEntity": { "@id": `https://${stateSlug}.consignmentstores.site/${citySlug}/#itemlist` },
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.consignmentstores.site/#website",
          "name": "Consignment Stores Near Me",
          "url": "https://www.consignmentstores.site/"
        }
      }
    ]
  };
}

// Generate complete structured data for a state page
export function generateCompleteStatePageStructuredData(
  stores: ConsignmentStore[],
  cities: string[],
  stateName: string,
  stateSlug: string
) {
  const stateEntity = generateStateEntity(stateName, stateSlug);
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      stateEntity,
      {
        "@type": "CollectionPage",
        "@id": `https://${stateSlug}.consignmentstores.site/#page`,
        "url": `https://${stateSlug}.consignmentstores.site/`,
        "name": `Consignment Stores in ${stateName}`,
        "description": `Find ${stores.length} consignment stores across ${cities.length} cities in ${stateName}. Browse quality second-hand items, furniture, clothing, and vintage treasures.`,
        "breadcrumb": {
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
              "name": stateName
            }
          ]
        },
        "about": { "@id": stateEntity["@id"] },
        "hasPart": cities.map(city => ({
          "@type": "WebPage",
          "name": `Consignment Stores in ${city}`,
          "url": `https://${stateSlug}.consignmentstores.site/${city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}/`
        })),
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.consignmentstores.site/#website",
          "name": "Consignment Stores Near Me",
          "url": "https://www.consignmentstores.site/"
        }
      },
      {
        "@type": "ItemList",
        "name": `Cities in ${stateName} with Consignment Stores`,
        "numberOfItems": cities.length,
        "itemListElement": cities.slice(0, 20).map((city, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://${stateSlug}.consignmentstores.site/${city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}/`
        }))
      }
    ]
  };
}