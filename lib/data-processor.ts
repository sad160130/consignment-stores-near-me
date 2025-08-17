import path from 'path';

export interface ConsignmentStore {
  businessName: string;
  address: string;
  city: string;
  state: string;
  numberOfReviews: number;
  site: string;
  phone: string;
  photo: string;
  seoDescription: string;
  pricing: boolean;
  wideSelection: boolean;
  sellAntiques: boolean;
  sellBooks: boolean;
  cleanOrganized: boolean;
  sellClothes: boolean;
  sellFurniture: boolean;
  sellJewelry: boolean;
  sellGiftItems: boolean;
  sellPremiumBrand: boolean;
  sellMerchandise: boolean;
  friendlyEmployees: boolean;
}

export interface ProcessedData {
  stores: ConsignmentStore[];
  statesList: string[];
  citiesByState: Record<string, string[]>;
  storesByState: Record<string, ConsignmentStore[]>;
  storesByCity: Record<string, ConsignmentStore[]>;
}

function parseYesNo(value: string): boolean {
  return value?.toLowerCase() === 'yes';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function processExcelData(): ProcessedData {
  try {
    // Try to load from generated JSON file first
    let jsonData;
    try {
      if (typeof window !== 'undefined') {
        // Client side - fetch the JSON
        console.warn('Client-side data loading not implemented, using sample data');
        return getSampleData();
      } else {
        // Server side - read the JSON file
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs');
        const jsonPath = path.join(process.cwd(), 'public', 'stores-data.json');
        if (fs.existsSync(jsonPath)) {
          const jsonContent = fs.readFileSync(jsonPath, 'utf8');
          jsonData = JSON.parse(jsonContent);
          console.log('Successfully loaded real data from Excel file:', jsonData.length, 'stores');
        } else {
          console.warn('JSON data file not found, using sample data');
          return getSampleData();
        }
      }
    } catch (error) {
      console.warn('Error loading data, using sample data for development');
      console.warn('Error:', error);
      return getSampleData();
    }

    const stores: ConsignmentStore[] = (jsonData as Record<string, unknown>[]).map((row) => ({
      businessName: String(row['Business Name'] || ''),
      address: String(row['Address'] || ''),
      city: String(row['City'] || ''),
      state: String(row['State'] || '').trim(),
      numberOfReviews: parseInt(String(row['Number of Reviews'] || '0')) || 0,
      site: String(row['Site'] || ''),
      phone: String(row['Phone'] || ''),
      photo: String(row['Photo'] || ''),
      seoDescription: String(row['SEO Description'] || ''),
      pricing: parseYesNo(String(row['pricing'] || '')),
      wideSelection: parseYesNo(String(row['wide_selection'] || '')),
      sellAntiques: parseYesNo(String(row['sell_antiques'] || '')),
      sellBooks: parseYesNo(String(row['sell_books'] || '')),
      cleanOrganized: parseYesNo(String(row['clean_organized'] || '')),
      sellClothes: parseYesNo(String(row['sell_clothes'] || '')),
      sellFurniture: parseYesNo(String(row['sell_furniture'] || '')),
      sellJewelry: parseYesNo(String(row['sell_jewelry'] || '')),
      sellGiftItems: parseYesNo(String(row['sell_gift_items'] || '')),
      sellPremiumBrand: parseYesNo(String(row['sell_premium_brand'] || '')),
      sellMerchandise: parseYesNo(String(row['sell_merchandise'] || '')),
      friendlyEmployees: parseYesNo(String(row['friendly_employees'] || '')),
    }));

    // Remove duplicates based on business name, address, and city combination
    const uniqueStores = stores.filter((store, index, array) => {
      const key = `${store.businessName.toLowerCase().trim()}-${store.address.toLowerCase().trim()}-${store.city.toLowerCase().trim()}`;
      return array.findIndex(s => {
        const compareKey = `${s.businessName.toLowerCase().trim()}-${s.address.toLowerCase().trim()}-${s.city.toLowerCase().trim()}`;
        return compareKey === key;
      }) === index;
    });

    console.log(`Removed ${stores.length - uniqueStores.length} duplicate stores from dataset`);

    // Sort stores by number of reviews (descending)
    uniqueStores.sort((a, b) => b.numberOfReviews - a.numberOfReviews);

    // Process states and cities
    const statesSet = new Set<string>();
    const citiesByState: Record<string, Set<string>> = {};
    const storesByState: Record<string, ConsignmentStore[]> = {};
    const storesByCity: Record<string, ConsignmentStore[]> = {};

    uniqueStores.forEach(store => {
      const state = store.state.trim();
      const city = store.city.trim();
      
      statesSet.add(state);
      
      if (!citiesByState[state]) {
        citiesByState[state] = new Set();
      }
      citiesByState[state].add(city);
      
      if (!storesByState[state]) {
        storesByState[state] = [];
      }
      storesByState[state].push(store);
      
      const cityKey = `${city}, ${state}`;
      if (!storesByCity[cityKey]) {
        storesByCity[cityKey] = [];
      }
      storesByCity[cityKey].push(store);
    });

    // Convert sets to arrays and sort
    const statesList = Array.from(statesSet).sort();
    const citiesByStateArray: Record<string, string[]> = {};
    
    Object.keys(citiesByState).forEach(state => {
      citiesByStateArray[state] = Array.from(citiesByState[state]).sort();
    });

    // Sort stores within each state and city by reviews
    Object.keys(storesByState).forEach(state => {
      storesByState[state].sort((a, b) => b.numberOfReviews - a.numberOfReviews);
    });

    Object.keys(storesByCity).forEach(cityKey => {
      storesByCity[cityKey].sort((a, b) => b.numberOfReviews - a.numberOfReviews);
    });

    return {
      stores: uniqueStores,
      statesList,
      citiesByState: citiesByStateArray,
      storesByState,
      storesByCity,
    };
  } catch (error) {
    console.error('Error processing Excel data:', error);
    return {
      stores: [],
      statesList: [],
      citiesByState: {},
      storesByState: {},
      storesByCity: {},
    };
  }
}

export function getStateSlug(stateName: string): string {
  return slugify(stateName);
}

export function getCitySlug(cityName: string): string {
  return slugify(cityName);
}

export function getStoresByCity(city: string, state: string, data: ProcessedData): ConsignmentStore[] {
  const cityKey = `${city}, ${state}`;
  return data.storesByCity[cityKey] || [];
}

export function getNearbyCities(currentCity: string, state: string, data: ProcessedData, limit: number = 10): string[] {
  const allCitiesInState = data.citiesByState[state] || [];
  return allCitiesInState
    .filter(city => city !== currentCity)
    .slice(0, limit);
}

function getSampleData(): ProcessedData {
  const sampleStores: ConsignmentStore[] = [
    {
      businessName: "Vintage Treasures",
      address: "123 Main St",
      city: "Los Angeles",
      state: "California",
      numberOfReviews: 45,
      site: "https://example.com",
      phone: "(555) 123-4567",
      photo: "",
      seoDescription: "Find unique vintage treasures and quality secondhand items at our Los Angeles consignment store.",
      pricing: true,
      wideSelection: true,
      sellAntiques: true,
      sellBooks: false,
      cleanOrganized: true,
      sellClothes: true,
      sellFurniture: true,
      sellJewelry: true,
      sellGiftItems: false,
      sellPremiumBrand: true,
      sellMerchandise: false,
      friendlyEmployees: true,
    },
    {
      businessName: "Second Chance Consignment",
      address: "456 Oak Ave",
      city: "San Francisco",
      state: "California",
      numberOfReviews: 32,
      site: "https://example2.com",
      phone: "(555) 987-6543",
      photo: "",
      seoDescription: "Quality consignment shopping in San Francisco with books, clothing, and gift items at affordable prices.",
      pricing: true,
      wideSelection: false,
      sellAntiques: false,
      sellBooks: true,
      cleanOrganized: true,
      sellClothes: true,
      sellFurniture: false,
      sellJewelry: false,
      sellGiftItems: true,
      sellPremiumBrand: false,
      sellMerchandise: true,
      friendlyEmployees: true,
    },
    {
      businessName: "Austin Consignment Co",
      address: "789 Elm St",
      city: "Austin",
      state: "Texas",
      numberOfReviews: 28,
      site: "",
      phone: "(555) 456-7890",
      photo: "",
      seoDescription: "Austin's premier consignment destination for antiques, furniture, books, and clothing with friendly service.",
      pricing: true,
      wideSelection: true,
      sellAntiques: true,
      sellBooks: true,
      cleanOrganized: false,
      sellClothes: true,
      sellFurniture: true,
      sellJewelry: false,
      sellGiftItems: false,
      sellPremiumBrand: false,
      sellMerchandise: false,
      friendlyEmployees: true,
    },
  ];

  const statesList = ["California", "Texas"];
  const citiesByState = {
    "California": ["Los Angeles", "San Francisco"],
    "Texas": ["Austin"]
  };
  const storesByState = {
    "California": sampleStores.slice(0, 2),
    "Texas": sampleStores.slice(2, 3)
  };
  const storesByCity = {
    "Los Angeles, California": [sampleStores[0]],
    "San Francisco, California": [sampleStores[1]],
    "Austin, Texas": [sampleStores[2]]
  };

  return {
    stores: sampleStores,
    statesList,
    citiesByState,
    storesByState,
    storesByCity,
  };
}