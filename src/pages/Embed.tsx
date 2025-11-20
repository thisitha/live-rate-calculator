import { useState } from 'react';
import { Calculator } from '@/components/Calculator';
import { ResultsCard } from '@/components/ResultsCard';
import { ShippingCalculator, CalculationInput, CalculationResult } from '@/lib/calculator';
import { defaultZones, defaultFulfillmentRates, defaultShippingRates, defaultDutyRates } from '@/lib/mockData';

const Embed = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const calculator = new ShippingCalculator(defaultZones, defaultFulfillmentRates, defaultShippingRates, defaultDutyRates);

  const handleCalculate = (input: CalculationInput) => {
    const calcResult = calculator.calculate(input);
    setResult(calcResult);
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
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Calculator onCalculate={handleCalculate} />
        {result && <ResultsCard result={result} onExport={handleExport} />}
      </div>
    </div>
  );
};

export default Embed;
