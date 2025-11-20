import { Zone, FulfillmentRate, ShippingRate, DutyRate } from './mockData';

export interface CalculationInput {
  weight: number; // kg
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
  quantity: number;
  destinationCountry: string;
  carrier: string;
  service: 'standard' | 'express';
  declaredValue: number; // USD per unit
  useVolumetric: boolean;
}

export interface CalculationResult {
  fulfillmentFee: number;
  shippingCost: number;
  dutyAmount: number;
  vatAmount: number;
  totalPerUnit: number;
  totalAmount: number;
  estimatedDays: { min: number; max: number };
  confidence: number; // 0-100
  notes: string[];
  breakdown: {
    weight: number;
    volumetricWeight?: number;
    chargeableWeight: number;
    zone: string;
  };
}

export class ShippingCalculator {
  constructor(
    private zones: Zone[],
    private fulfillmentRates: FulfillmentRate[],
    private shippingRates: ShippingRate[],
    private dutyRates: DutyRate[]
  ) {}

  calculate(input: CalculationInput): CalculationResult {
    const notes: string[] = [];
    let confidence = 100;

    // Calculate volumetric weight if dimensions provided
    let volumetricWeight: number | undefined;
    if (input.length && input.width && input.height && input.useVolumetric) {
      volumetricWeight = (input.length * input.width * input.height) / 5000;
    }

    // Determine chargeable weight
    const chargeableWeight = volumetricWeight && volumetricWeight > input.weight ? volumetricWeight : input.weight;
    
    if (volumetricWeight && volumetricWeight > input.weight) {
      notes.push(`Volumetric weight (${volumetricWeight.toFixed(2)}kg) used instead of actual weight`);
    }

    // Find zone
    const zone = this.findZone(input.destinationCountry);
    if (!zone) {
      notes.push(`Country ${input.destinationCountry} mapped to default zone`);
      confidence -= 20;
    }

    // Calculate fulfillment fee
    const fulfillmentFee = this.getFulfillmentFee(zone?.id || 'ROW', chargeableWeight);
    if (!fulfillmentFee) {
      notes.push('Fulfillment rate not found, using fallback estimate');
      confidence -= 30;
    }

    // Calculate shipping cost
    const shippingResult = this.getShippingCost(
      input.carrier,
      input.service,
      zone?.id || 'ROW',
      chargeableWeight
    );
    if (!shippingResult) {
      notes.push('Shipping rate not found, using fallback estimate');
      confidence -= 30;
    }

    // Calculate duties and VAT
    const dutyInfo = this.dutyRates.find(d => d.country === input.destinationCountry);
    let dutyAmount = 0;
    let vatAmount = 0;

    if (dutyInfo) {
      const totalGoodsValue = input.declaredValue * input.quantity;
      
      if (totalGoodsValue > dutyInfo.threshold) {
        // Calculate duty on goods value
        dutyAmount = (totalGoodsValue * dutyInfo.dutyRate) / 100;
        
        // Calculate VAT on (goods + shipping + duty)
        const taxableBase = totalGoodsValue + (shippingResult?.rate || 0) + dutyAmount;
        vatAmount = (taxableBase * dutyInfo.vatRate) / 100;
      } else {
        notes.push(`Below de minimis threshold ($${dutyInfo.threshold}) - no duties or VAT`);
      }
    } else {
      notes.push('No duty/VAT rates found for destination, assuming 0%');
      confidence -= 15;
    }

    const totalPerUnit = (fulfillmentFee || 5) + (shippingResult?.rate || 30) + dutyAmount + vatAmount;
    const totalAmount = totalPerUnit * input.quantity;

    return {
      fulfillmentFee: fulfillmentFee || 5,
      shippingCost: shippingResult?.rate || 30,
      dutyAmount,
      vatAmount,
      totalPerUnit: totalPerUnit / input.quantity,
      totalAmount,
      estimatedDays: shippingResult?.estimatedDays || { min: 5, max: 10 },
      confidence,
      notes,
      breakdown: {
        weight: input.weight,
        volumetricWeight,
        chargeableWeight,
        zone: zone?.id || 'ROW'
      }
    };
  }

  private findZone(country: string): Zone | undefined {
    for (const zone of this.zones) {
      if (zone.countries.includes(country) || zone.countries.includes('*')) {
        return zone;
      }
    }
    return undefined;
  }

  private getFulfillmentFee(zone: string, weight: number): number | null {
    const rate = this.fulfillmentRates.find(
      r => r.zone === zone && weight >= r.weightBracket.min && weight < r.weightBracket.max
    );
    return rate ? rate.fee : null;
  }

  private getShippingCost(
    carrier: string,
    service: string,
    zone: string,
    weight: number
  ): { rate: number; estimatedDays: { min: number; max: number } } | null {
    const rate = this.shippingRates.find(
      r => r.carrier === carrier &&
           r.service === service &&
           r.zone === zone &&
           weight >= r.weightBracket.min &&
           weight < r.weightBracket.max
    );
    return rate ? { rate: rate.rate, estimatedDays: rate.estimatedDays } : null;
  }

  updateZones(zones: Zone[]) {
    this.zones = zones;
  }

  updateFulfillmentRates(rates: FulfillmentRate[]) {
    this.fulfillmentRates = rates;
  }

  updateShippingRates(rates: ShippingRate[]) {
    this.shippingRates = rates;
  }

  updateDutyRates(rates: DutyRate[]) {
    this.dutyRates = rates;
  }
}
