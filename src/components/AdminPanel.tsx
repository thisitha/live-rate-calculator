import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Upload, Code } from 'lucide-react';
import { Zone, FulfillmentRate, ShippingRate, DutyRate } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  fulfillmentRates: FulfillmentRate[];
  shippingRates: ShippingRate[];
  dutyRates: DutyRate[];
  onUpdate: (data: {
    zones?: Zone[];
    fulfillmentRates?: FulfillmentRate[];
    shippingRates?: ShippingRate[];
    dutyRates?: DutyRate[];
  }) => void;
}

export function AdminPanel({
  isOpen,
  onClose,
  zones,
  fulfillmentRates,
  shippingRates,
  dutyRates,
  onUpdate
}: AdminPanelProps) {
  const { toast } = useToast();
  const [zonesJson, setZonesJson] = useState(JSON.stringify(zones, null, 2));
  const [fulfillmentJson, setFulfillmentJson] = useState(JSON.stringify(fulfillmentRates, null, 2));
  const [shippingJson, setShippingJson] = useState(JSON.stringify(shippingRates, null, 2));
  const [dutyJson, setDutyJson] = useState(JSON.stringify(dutyRates, null, 2));

  const handleApply = (type: 'zones' | 'fulfillment' | 'shipping' | 'duty') => {
    try {
      let parsed;
      let updateData: any = {};

      switch (type) {
        case 'zones':
          parsed = JSON.parse(zonesJson);
          updateData.zones = parsed;
          break;
        case 'fulfillment':
          parsed = JSON.parse(fulfillmentJson);
          updateData.fulfillmentRates = parsed;
          break;
        case 'shipping':
          parsed = JSON.parse(shippingJson);
          updateData.shippingRates = parsed;
          break;
        case 'duty':
          parsed = JSON.parse(dutyJson);
          updateData.dutyRates = parsed;
          break;
      }

      onUpdate(updateData);
      toast({
        title: "Data updated",
        description: `${type} data has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax and try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = (type: 'zones' | 'fulfillment' | 'shipping' | 'duty') => {
    switch (type) {
      case 'zones':
        setZonesJson(JSON.stringify(zones, null, 2));
        break;
      case 'fulfillment':
        setFulfillmentJson(JSON.stringify(fulfillmentRates, null, 2));
        break;
      case 'shipping':
        setShippingJson(JSON.stringify(shippingRates, null, 2));
        break;
      case 'duty':
        setDutyJson(JSON.stringify(dutyRates, null, 2));
        break;
    }
    toast({
      title: "Reset to current",
      description: "Editor has been reset to current data.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Panel - Edit Mock Data
          </DialogTitle>
          <DialogDescription>
            Edit the mock data directly in JSON format. Changes apply immediately to calculations.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="zones" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="duty">Duty/VAT</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Zones Configuration (JSON)
              </Label>
              <Textarea
                value={zonesJson}
                onChange={(e) => setZonesJson(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="Enter zones JSON..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleApply('zones')} className="flex-1">Apply Changes</Button>
              <Button onClick={() => handleReset('zones')} variant="outline">Reset</Button>
            </div>
          </TabsContent>

          <TabsContent value="fulfillment" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Fulfillment Rates (JSON)
              </Label>
              <Textarea
                value={fulfillmentJson}
                onChange={(e) => setFulfillmentJson(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="Enter fulfillment rates JSON..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleApply('fulfillment')} className="flex-1">Apply Changes</Button>
              <Button onClick={() => handleReset('fulfillment')} variant="outline">Reset</Button>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Shipping Rates (JSON)
              </Label>
              <Textarea
                value={shippingJson}
                onChange={(e) => setShippingJson(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="Enter shipping rates JSON..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleApply('shipping')} className="flex-1">Apply Changes</Button>
              <Button onClick={() => handleReset('shipping')} variant="outline">Reset</Button>
            </div>
          </TabsContent>

          <TabsContent value="duty" className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Duty & VAT Rates (JSON)
              </Label>
              <Textarea
                value={dutyJson}
                onChange={(e) => setDutyJson(e.target.value)}
                className="font-mono text-sm min-h-[400px]"
                placeholder="Enter duty rates JSON..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleApply('duty')} className="flex-1">Apply Changes</Button>
              <Button onClick={() => handleReset('duty')} variant="outline">Reset</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
