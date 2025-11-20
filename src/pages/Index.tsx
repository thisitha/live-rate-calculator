import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator } from '@/components/Calculator';
import { ResultsCard } from '@/components/ResultsCard';
import { AdminPanel } from '@/components/AdminPanel';
import { Footer } from '@/components/Footer';
import { ShippingCalculator, CalculationInput, CalculationResult } from '@/lib/calculator';
import { defaultZones, defaultFulfillmentRates, defaultShippingRates, defaultDutyRates, Zone, FulfillmentRate, ShippingRate, DutyRate } from '@/lib/mockData';
import { Settings, Calculator as CalcIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [zones, setZones] = useState<Zone[]>(defaultZones);
  const [fulfillmentRates, setFulfillmentRates] = useState<FulfillmentRate[]>(defaultFulfillmentRates);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(defaultShippingRates);
  const [dutyRates, setDutyRates] = useState<DutyRate[]>(defaultDutyRates);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const calculator = new ShippingCalculator(zones, fulfillmentRates, shippingRates, dutyRates);

  const handleCalculate = (input: CalculationInput) => {
    const calcResult = calculator.calculate(input);
    setResult(calcResult);
    toast({
      title: "Calculation complete",
      description: `Total landed cost: $${calcResult.totalAmount.toFixed(2)}`,
    });
  };

  const handleAdminUpdate = (data: {
    zones?: Zone[];
    fulfillmentRates?: FulfillmentRate[];
    shippingRates?: ShippingRate[];
    dutyRates?: DutyRate[];
  }) => {
    if (data.zones) setZones(data.zones);
    if (data.fulfillmentRates) setFulfillmentRates(data.fulfillmentRates);
    if (data.shippingRates) setShippingRates(data.shippingRates);
    if (data.dutyRates) setDutyRates(data.dutyRates);
  };

  const handleExport = () => {
    if (!result) return;

    const csv = [
      ['Item', 'Amount'],
      ['Fulfillment Fee', `$${result.fulfillmentFee.toFixed(2)}`],
      ['Shipping Cost', `$${result.shippingCost.toFixed(2)}`],
      ['Duty', `$${result.dutyAmount.toFixed(2)}`],
      ['VAT/Tax', `$${result.vatAmount.toFixed(2)}`],
      ['Total Per Unit', `$${result.totalPerUnit.toFixed(2)}`],
      ['Total Amount', `$${result.totalAmount.toFixed(2)}`],
      ['Estimated Days', `${result.estimatedDays.min}-${result.estimatedDays.max}`],
      ['Confidence', `${result.confidence}%`],
      ['Zone', result.breakdown.zone],
      ['Chargeable Weight (kg)', result.breakdown.chargeableWeight.toFixed(2)],
      ...result.notes.map(note => ['Note', note])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipping-calculation-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Results exported to CSV",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CalcIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Shipping Calculator</h1>
              <p className="text-xs text-muted-foreground">Logistics Cost Estimator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Calculate Your Landed Costs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant pricing estimates for international shipping including fulfillment, duties, and taxes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <Calculator onCalculate={handleCalculate} />
            </div>
            <div>
              {result ? (
                <ResultsCard result={result} onExport={handleExport} />
              ) : (
                <Card className="p-12 flex flex-col items-center justify-center text-center h-full border-dashed shadow-[var(--shadow-soft)]">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CalcIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter package details and click calculate to see your results here.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        zones={zones}
        fulfillmentRates={fulfillmentRates}
        shippingRates={shippingRates}
        dutyRates={dutyRates}
        onUpdate={handleAdminUpdate}
      />
      <Footer />
    </div>
  );
};

export default Index;
