export interface Zone {
  id: string;
  name: string;
  countries: string[];
}

export interface FulfillmentRate {
  zone: string;
  weightBracket: { min: number; max: number };
  fee: number;
}

export interface ShippingRate {
  carrier: string;
  service: string;
  zone: string;
  weightBracket: { min: number; max: number };
  rate: number;
  estimatedDays: { min: number; max: number };
}

export interface DutyRate {
  country: string;
  dutyRate: number; // percentage
  vatRate: number; // percentage
  threshold: number; // USD
}

export const defaultZones: Zone[] = [
  { id: "US", name: "United States", countries: ["US"] },
  { id: "EU", name: "European Union", countries: ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "IE", "GR", "FI", "SE", "DK", "PL", "CZ", "RO", "HU"] },
  { id: "UK", name: "United Kingdom", countries: ["GB"] },
  { id: "CA", name: "Canada", countries: ["CA"] },
  { id: "AU", name: "Australia & NZ", countries: ["AU", "NZ"] },
  { id: "ASIA", name: "Asia", countries: ["JP", "CN", "SG", "HK", "KR", "TW", "TH", "MY", "ID", "PH", "VN"] },
  { id: "ROW", name: "Rest of World", countries: ["*"] }
];

export const defaultFulfillmentRates: FulfillmentRate[] = [
  { zone: "US", weightBracket: { min: 0, max: 0.5 }, fee: 2.5 },
  { zone: "US", weightBracket: { min: 0.5, max: 2 }, fee: 3.5 },
  { zone: "US", weightBracket: { min: 2, max: 5 }, fee: 5.0 },
  { zone: "US", weightBracket: { min: 5, max: 10 }, fee: 7.5 },
  { zone: "US", weightBracket: { min: 10, max: 999 }, fee: 12.0 },
  
  { zone: "EU", weightBracket: { min: 0, max: 0.5 }, fee: 3.0 },
  { zone: "EU", weightBracket: { min: 0.5, max: 2 }, fee: 4.0 },
  { zone: "EU", weightBracket: { min: 2, max: 5 }, fee: 6.0 },
  { zone: "EU", weightBracket: { min: 5, max: 10 }, fee: 9.0 },
  { zone: "EU", weightBracket: { min: 10, max: 999 }, fee: 15.0 },
  
  { zone: "UK", weightBracket: { min: 0, max: 0.5 }, fee: 2.8 },
  { zone: "UK", weightBracket: { min: 0.5, max: 2 }, fee: 3.8 },
  { zone: "UK", weightBracket: { min: 2, max: 5 }, fee: 5.5 },
  { zone: "UK", weightBracket: { min: 5, max: 10 }, fee: 8.5 },
  { zone: "UK", weightBracket: { min: 10, max: 999 }, fee: 14.0 },
  
  { zone: "CA", weightBracket: { min: 0, max: 999 }, fee: 4.0 },
  { zone: "AU", weightBracket: { min: 0, max: 999 }, fee: 5.0 },
  { zone: "ASIA", weightBracket: { min: 0, max: 999 }, fee: 4.5 },
  { zone: "ROW", weightBracket: { min: 0, max: 999 }, fee: 6.0 }
];

export const defaultShippingRates: ShippingRate[] = [
  // DHL Standard - US
  { carrier: "DHL", service: "standard", zone: "US", weightBracket: { min: 0, max: 0.5 }, rate: 8.5, estimatedDays: { min: 3, max: 5 } },
  { carrier: "DHL", service: "standard", zone: "US", weightBracket: { min: 0.5, max: 2 }, rate: 12.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "DHL", service: "standard", zone: "US", weightBracket: { min: 2, max: 5 }, rate: 18.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "DHL", service: "standard", zone: "US", weightBracket: { min: 5, max: 10 }, rate: 28.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "DHL", service: "standard", zone: "US", weightBracket: { min: 10, max: 999 }, rate: 45.0, estimatedDays: { min: 3, max: 5 } },
  
  // DHL Express - US
  { carrier: "DHL", service: "express", zone: "US", weightBracket: { min: 0, max: 0.5 }, rate: 15.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "DHL", service: "express", zone: "US", weightBracket: { min: 0.5, max: 2 }, rate: 22.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "DHL", service: "express", zone: "US", weightBracket: { min: 2, max: 5 }, rate: 35.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "DHL", service: "express", zone: "US", weightBracket: { min: 5, max: 10 }, rate: 55.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "DHL", service: "express", zone: "US", weightBracket: { min: 10, max: 999 }, rate: 85.0, estimatedDays: { min: 1, max: 2 } },
  
  // FedEx Standard - US
  { carrier: "FedEx", service: "standard", zone: "US", weightBracket: { min: 0, max: 0.5 }, rate: 7.5, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "US", weightBracket: { min: 0.5, max: 2 }, rate: 11.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "US", weightBracket: { min: 2, max: 5 }, rate: 16.5, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "US", weightBracket: { min: 5, max: 10 }, rate: 25.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "US", weightBracket: { min: 10, max: 999 }, rate: 42.0, estimatedDays: { min: 3, max: 5 } },
  
  // FedEx Express - US
  { carrier: "FedEx", service: "express", zone: "US", weightBracket: { min: 0, max: 0.5 }, rate: 14.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "FedEx", service: "express", zone: "US", weightBracket: { min: 0.5, max: 2 }, rate: 20.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "FedEx", service: "express", zone: "US", weightBracket: { min: 2, max: 5 }, rate: 32.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "FedEx", service: "express", zone: "US", weightBracket: { min: 5, max: 10 }, rate: 50.0, estimatedDays: { min: 1, max: 2 } },
  { carrier: "FedEx", service: "express", zone: "US", weightBracket: { min: 10, max: 999 }, rate: 80.0, estimatedDays: { min: 1, max: 2 } },
  
  // EU rates
  { carrier: "DHL", service: "standard", zone: "EU", weightBracket: { min: 0, max: 5 }, rate: 22.0, estimatedDays: { min: 4, max: 6 } },
  { carrier: "DHL", service: "standard", zone: "EU", weightBracket: { min: 5, max: 999 }, rate: 38.0, estimatedDays: { min: 4, max: 6 } },
  { carrier: "DHL", service: "express", zone: "EU", weightBracket: { min: 0, max: 5 }, rate: 40.0, estimatedDays: { min: 2, max: 3 } },
  { carrier: "DHL", service: "express", zone: "EU", weightBracket: { min: 5, max: 999 }, rate: 70.0, estimatedDays: { min: 2, max: 3 } },
  
  { carrier: "FedEx", service: "standard", zone: "EU", weightBracket: { min: 0, max: 5 }, rate: 20.0, estimatedDays: { min: 4, max: 6 } },
  { carrier: "FedEx", service: "standard", zone: "EU", weightBracket: { min: 5, max: 999 }, rate: 35.0, estimatedDays: { min: 4, max: 6 } },
  { carrier: "FedEx", service: "express", zone: "EU", weightBracket: { min: 0, max: 5 }, rate: 38.0, estimatedDays: { min: 2, max: 3 } },
  { carrier: "FedEx", service: "express", zone: "EU", weightBracket: { min: 5, max: 999 }, rate: 65.0, estimatedDays: { min: 2, max: 3 } },
  
  // UK rates
  { carrier: "DHL", service: "standard", zone: "UK", weightBracket: { min: 0, max: 5 }, rate: 18.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "DHL", service: "standard", zone: "UK", weightBracket: { min: 5, max: 999 }, rate: 32.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "DHL", service: "express", zone: "UK", weightBracket: { min: 0, max: 5 }, rate: 35.0, estimatedDays: { min: 2, max: 3 } },
  { carrier: "DHL", service: "express", zone: "UK", weightBracket: { min: 5, max: 999 }, rate: 60.0, estimatedDays: { min: 2, max: 3 } },
  
  { carrier: "FedEx", service: "standard", zone: "UK", weightBracket: { min: 0, max: 5 }, rate: 16.5, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "UK", weightBracket: { min: 5, max: 999 }, rate: 30.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "express", zone: "UK", weightBracket: { min: 0, max: 5 }, rate: 33.0, estimatedDays: { min: 2, max: 3 } },
  { carrier: "FedEx", service: "express", zone: "UK", weightBracket: { min: 5, max: 999 }, rate: 58.0, estimatedDays: { min: 2, max: 3 } },
  
  // Other zones
  { carrier: "DHL", service: "standard", zone: "CA", weightBracket: { min: 0, max: 999 }, rate: 25.0, estimatedDays: { min: 5, max: 7 } },
  { carrier: "DHL", service: "express", zone: "CA", weightBracket: { min: 0, max: 999 }, rate: 45.0, estimatedDays: { min: 2, max: 4 } },
  { carrier: "FedEx", service: "standard", zone: "CA", weightBracket: { min: 0, max: 999 }, rate: 23.0, estimatedDays: { min: 5, max: 7 } },
  { carrier: "FedEx", service: "express", zone: "CA", weightBracket: { min: 0, max: 999 }, rate: 42.0, estimatedDays: { min: 2, max: 4 } },
  
  { carrier: "DHL", service: "standard", zone: "AU", weightBracket: { min: 0, max: 999 }, rate: 35.0, estimatedDays: { min: 6, max: 9 } },
  { carrier: "DHL", service: "express", zone: "AU", weightBracket: { min: 0, max: 999 }, rate: 65.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "AU", weightBracket: { min: 0, max: 999 }, rate: 32.0, estimatedDays: { min: 6, max: 9 } },
  { carrier: "FedEx", service: "express", zone: "AU", weightBracket: { min: 0, max: 999 }, rate: 60.0, estimatedDays: { min: 3, max: 5 } },
  
  { carrier: "DHL", service: "standard", zone: "ASIA", weightBracket: { min: 0, max: 999 }, rate: 28.0, estimatedDays: { min: 5, max: 8 } },
  { carrier: "DHL", service: "express", zone: "ASIA", weightBracket: { min: 0, max: 999 }, rate: 55.0, estimatedDays: { min: 3, max: 5 } },
  { carrier: "FedEx", service: "standard", zone: "ASIA", weightBracket: { min: 0, max: 999 }, rate: 26.0, estimatedDays: { min: 5, max: 8 } },
  { carrier: "FedEx", service: "express", zone: "ASIA", weightBracket: { min: 0, max: 999 }, rate: 52.0, estimatedDays: { min: 3, max: 5 } },
  
  { carrier: "DHL", service: "standard", zone: "ROW", weightBracket: { min: 0, max: 999 }, rate: 40.0, estimatedDays: { min: 7, max: 12 } },
  { carrier: "DHL", service: "express", zone: "ROW", weightBracket: { min: 0, max: 999 }, rate: 75.0, estimatedDays: { min: 4, max: 6 } },
  { carrier: "FedEx", service: "standard", zone: "ROW", weightBracket: { min: 0, max: 999 }, rate: 38.0, estimatedDays: { min: 7, max: 12 } },
  { carrier: "FedEx", service: "express", zone: "ROW", weightBracket: { min: 0, max: 999 }, rate: 70.0, estimatedDays: { min: 4, max: 6 } }
];

export const defaultDutyRates: DutyRate[] = [
  { country: "US", dutyRate: 0, vatRate: 0, threshold: 800 },
  { country: "GB", dutyRate: 2.5, vatRate: 20, threshold: 135 },
  { country: "DE", dutyRate: 4.0, vatRate: 19, threshold: 150 },
  { country: "FR", dutyRate: 4.0, vatRate: 20, threshold: 150 },
  { country: "IT", dutyRate: 4.0, vatRate: 22, threshold: 150 },
  { country: "ES", dutyRate: 4.0, vatRate: 21, threshold: 150 },
  { country: "NL", dutyRate: 4.0, vatRate: 21, threshold: 150 },
  { country: "BE", dutyRate: 4.0, vatRate: 21, threshold: 150 },
  { country: "AT", dutyRate: 4.0, vatRate: 20, threshold: 150 },
  { country: "PT", dutyRate: 4.0, vatRate: 23, threshold: 150 },
  { country: "IE", dutyRate: 4.0, vatRate: 23, threshold: 150 },
  { country: "GR", dutyRate: 4.0, vatRate: 24, threshold: 150 },
  { country: "FI", dutyRate: 4.0, vatRate: 24, threshold: 150 },
  { country: "SE", dutyRate: 4.0, vatRate: 25, threshold: 150 },
  { country: "DK", dutyRate: 4.0, vatRate: 25, threshold: 150 },
  { country: "PL", dutyRate: 4.0, vatRate: 23, threshold: 150 },
  { country: "CZ", dutyRate: 4.0, vatRate: 21, threshold: 150 },
  { country: "RO", dutyRate: 4.0, vatRate: 19, threshold: 150 },
  { country: "HU", dutyRate: 4.0, vatRate: 27, threshold: 150 },
  { country: "CA", dutyRate: 6.0, vatRate: 5, threshold: 20 },
  { country: "AU", dutyRate: 5.0, vatRate: 10, threshold: 1000 },
  { country: "NZ", dutyRate: 5.0, vatRate: 15, threshold: 1000 },
  { country: "JP", dutyRate: 3.0, vatRate: 10, threshold: 10000 },
  { country: "CN", dutyRate: 8.0, vatRate: 13, threshold: 50 },
  { country: "SG", dutyRate: 0, vatRate: 9, threshold: 400 },
  { country: "HK", dutyRate: 0, vatRate: 0, threshold: 999999 },
  { country: "KR", dutyRate: 8.0, vatRate: 10, threshold: 150 },
  { country: "TW", dutyRate: 5.0, vatRate: 5, threshold: 2000 },
  { country: "TH", dutyRate: 10.0, vatRate: 7, threshold: 1500 },
  { country: "MY", dutyRate: 6.0, vatRate: 10, threshold: 500 },
  { country: "ID", dutyRate: 10.0, vatRate: 11, threshold: 75 },
  { country: "PH", dutyRate: 10.0, vatRate: 12, threshold: 10000 },
  { country: "VN", dutyRate: 12.0, vatRate: 10, threshold: 1000000 }
];
