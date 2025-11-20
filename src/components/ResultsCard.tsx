import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/lib/calculator';
import { Download, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface ResultsCardProps {
  result: CalculationResult;
  onExport: () => void;
}

export function ResultsCard({ result, onExport }: ResultsCardProps) {
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return { variant: "default" as const, label: "High Confidence" };
    if (confidence >= 60) return { variant: "secondary" as const, label: "Medium Confidence" };
    return { variant: "destructive" as const, label: "Low Confidence" };
  };

  const badge = getConfidenceBadge(result.confidence);

  return (
    <Card className="p-6 shadow-[var(--shadow-medium)]">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Landed Cost Estimate</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete breakdown of your shipping costs</p>
          </div>
          <Badge variant={badge.variant} className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {badge.label}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm font-medium">Fulfillment Fee</span>
            <span className="font-semibold">${result.fulfillmentFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm font-medium">Shipping Cost</span>
            <span className="font-semibold">${result.shippingCost.toFixed(2)}</span>
          </div>

          {result.dutyAmount > 0 && (
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">Duty</span>
              <span className="font-semibold">${result.dutyAmount.toFixed(2)}</span>
            </div>
          )}

          {result.vatAmount > 0 && (
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">VAT/Tax</span>
              <span className="font-semibold">${result.vatAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="h-px bg-border my-3" />

          <div className="flex justify-between items-center p-4 bg-accent/10 rounded-lg border-2 border-accent/20">
            <span className="text-base font-semibold">Total Per Unit</span>
            <span className="text-2xl font-bold text-accent">${result.totalPerUnit.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <span className="text-base font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">${result.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Estimated delivery: <span className="font-medium">{result.estimatedDays.min}-{result.estimatedDays.max} days</span>
          </span>
        </div>

        {result.notes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Notes
            </div>
            <ul className="space-y-1">
              {result.notes.map((note, idx) => (
                <li key={idx} className="text-sm text-muted-foreground pl-6">• {note}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p>Breakdown: Zone <span className="font-mono font-medium">{result.breakdown.zone}</span></p>
          <p>Chargeable weight: <span className="font-medium">{result.breakdown.chargeableWeight.toFixed(2)} kg</span></p>
          {result.breakdown.volumetricWeight && (
            <p>Volumetric weight: <span className="font-medium">{result.breakdown.volumetricWeight.toFixed(2)} kg</span></p>
          )}
        </div>

        <Button
          onClick={onExport}
          variant="outline"
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>
    </Card>
  );
}
