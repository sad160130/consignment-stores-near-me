import { ConsignmentStore } from './data-processor';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url ? { "item": `${baseUrl}${item.url}` } : {})
    }))
  };
  
  return breadcrumbList;
}

export function generateStatePageSchema(
  stateName: string,
  stateSlug: string,
  stores: ConsignmentStore[],
  cities: string[],
  baseUrl: string
) {
  // For state pages, baseUrl should be the subdomain URL
  const stateUrl = baseUrl.includes(stateSlug) ? baseUrl : `https://${stateSlug}.consignmentstores.site`;
  
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.consignmentstores.site/" },
    { name: stateName }
  ], "");

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${stateUrl}/`,
    "url": `${stateUrl}/`,
    "name": `Consignment Stores in ${stateName}`,
    "description": `Find the best consignment stores in ${stateName}. Browse ${stores.length} stores across ${cities.length} cities. Quality second-hand furniture, clothing, and vintage items.`,
    "breadcrumb": {
      "@id": `${baseUrl}/${stateSlug}/#breadcrumb`
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": stores.length,
      "itemListElement": stores.slice(0, 10).map((store, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": store.businessName,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": store.address,
            "addressLocality": store.city,
            "addressRegion": store.state
          },
          ...(store.phone ? { "telephone": store.phone } : {}),
          ...(store.site ? { "url": store.site } : {}),
          ...(store.numberOfReviews > 0 ? {
            "aggregateRating": {
              "@type": "AggregateRating",
              "reviewCount": store.numberOfReviews
            }
          } : {})
        }
      }))
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Consignment Stores Directory",
      "url": "https://www.consignmentstores.site"
    }
  };

  return [breadcrumbs, collectionPage];
}

export function generateCityPageSchema(
  cityName: string,
  citySlug: string,
  stateName: string,
  stateSlug: string,
  stores: ConsignmentStore[],
  baseUrl: string
) {
  // For city pages, baseUrl should be the subdomain URL
  const stateUrl = baseUrl.includes(stateSlug) ? baseUrl : `https://${stateSlug}.consignmentstores.site`;
  
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.consignmentstores.site/" },
    { name: stateName, url: `${stateUrl}/` },
    { name: cityName }
  ], "");

  const webPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${stateUrl}/${citySlug}/`,
    "url": `${stateUrl}/${citySlug}/`,
    "name": `Consignment Stores in ${cityName}, ${stateName}`,
    "description": `Find the best consignment stores in ${cityName}, ${stateName}. Browse ${stores.length} top-rated stores with reviews. Quality second-hand furniture, clothing, and vintage items.`,
    "breadcrumb": {
      "@id": `${stateUrl}/${citySlug}/#breadcrumb`
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Consignment Stores Directory",
      "url": "https://www.consignmentstores.site"
    }
  };

  // Generate detailed LocalBusiness schema for each store
  const localBusinesses = stores.map(store => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${stateUrl}/${citySlug}/#${store.businessName.toLowerCase().replace(/\s+/g, '-')}`,
    "name": store.businessName,
    "description": store.seoDescription || `${store.businessName} is a consignment store located in ${store.city}, ${store.state} offering quality second-hand items.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": store.address,
      "addressLocality": store.city,
      "addressRegion": store.state,
      "addressCountry": "US"
    },
    ...(store.phone ? { "telephone": store.phone } : {}),
    ...(store.site ? { 
      "url": store.site,
      "sameAs": [store.site]
    } : {}),
    ...(store.photo ? { "image": store.photo } : {}),
    ...(store.numberOfReviews > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "reviewCount": store.numberOfReviews
      }
    } : {}),
    // Add product categories offered
    "makesOffer": [
      ...(store.sellClothes ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Clothing" }}] : []),
      ...(store.sellFurniture ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Furniture" }}] : []),
      ...(store.sellJewelry ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Jewelry" }}] : []),
      ...(store.sellAntiques ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Antiques" }}] : []),
      ...(store.sellBooks ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Books" }}] : []),
      ...(store.sellGiftItems ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Gift Items" }}] : []),
      ...(store.sellPremiumBrand ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Premium Brands" }}] : []),
      ...(store.sellMerchandise ? [{ "@type": "Offer", "itemOffered": { "@type": "Product", "name": "General Merchandise" }}] : [])
    ].filter(offer => offer !== undefined),
    // Add store features
    ...(store.pricing ? { "priceRange": "$" } : {}),
    "amenityFeature": [
      ...(store.wideSelection ? [{ "@type": "LocationFeatureSpecification", "name": "Wide Selection" }] : []),
      ...(store.cleanOrganized ? [{ "@type": "LocationFeatureSpecification", "name": "Clean & Organized" }] : []),
      ...(store.friendlyEmployees ? [{ "@type": "LocationFeatureSpecification", "name": "Friendly Staff" }] : [])
    ].filter(feature => feature !== undefined)
  }));

  return [breadcrumbs, webPage, ...localBusinesses];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateSchemaScript(schemas: any[]): string {
  return schemas.map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  ).join('\n');
}