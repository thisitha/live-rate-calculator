import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Package, Ruler, DollarSign, MapPin, Truck } from 'lucide-react';
import { CalculationInput } from '@/lib/calculator';

interface CalculatorProps {
  onCalculate: (input: CalculationInput) => void;
}

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "SG", name: "Singapore" },
];

const carriers = ["DHL", "FedEx"];

export function Calculator({ onCalculate }: CalculatorProps) {
  const [weight, setWeight] = useState("1");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [country, setCountry] = useState("US");
  const [carrier, setCarrier] = useState("DHL");
  const [service, setService] = useState<"standard" | "express">("standard");
  const [declaredValue, setDeclaredValue] = useState("50");
  const [useVolumetric, setUseVolumetric] = useState(true);

  const handleCalculate = () => {
    const input: CalculationInput = {
      weight: parseFloat(weight) || 0,
      length: length ? parseFloat(length) : undefined,
      width: width ? parseFloat(width) : undefined,
      height: height ? parseFloat(height) : undefined,
      quantity: parseInt(quantity) || 1,
      destinationCountry: country,
      carrier,
      service,
      declaredValue: parseFloat(declaredValue) || 0,
      useVolumetric,
    };
    onCalculate(input);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-medium)]">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Package className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Package Details</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="1.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <Label>Dimensions (cm)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="volumetric" className="text-sm text-muted-foreground">Use volumetric</Label>
              <Switch
                id="volumetric"
                checked={useVolumetric}
                onCheckedChange={setUseVolumetric}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              step="0.1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="Length"
            />
            <Input
              type="number"
              step="0.1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Width"
            />
            <Input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="value">Declared Value (USD per unit)</Label>
          </div>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={declaredValue}
            onChange={(e) => setDeclaredValue(e.target.value)}
            placeholder="50.00"
          />
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Shipping Details</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Destination Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="carrier">Carrier</Label>
            </div>
            <Select value={carrier} onValueChange={setCarrier}>
              <SelectTrigger id="carrier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {carriers.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service Level</Label>
            <Select value={service} onValueChange={(v) => setService(v as "standard" | "express")}>
              <SelectTrigger id="service">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
          size="lg"
        >
          Calculate Shipping Cost
        </Button>
      </div>
    </Card>
  );
}
