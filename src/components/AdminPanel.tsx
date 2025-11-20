import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Zone, FulfillmentRate, ShippingRate, DutyRate } from '@/lib/mockData';
import { AdminZonesTable } from './admin/AdminZonesTable';
import { AdminFulfillmentTable } from './admin/AdminFulfillmentTable';
import { AdminShippingTable } from './admin/AdminShippingTable';
import { AdminDutyTable } from './admin/AdminDutyTable';
import { Home, MapPin, Package, Truck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type Section = 'zones' | 'fulfillment' | 'shipping' | 'duty';

export function AdminPanel({
  isOpen,
  onClose,
  zones,
  fulfillmentRates,
  shippingRates,
  dutyRates,
  onUpdate
}: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<Section>('zones');

  const navItems = [
    { id: 'zones' as Section, label: 'Zones', icon: MapPin },
    { id: 'fulfillment' as Section, label: 'Fulfillment Rates', icon: Package },
    { id: 'shipping' as Section, label: 'Shipping Rates', icon: Truck },
    { id: 'duty' as Section, label: 'Duties & VAT', icon: FileText },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 gap-0">
        <div className="flex h-[95vh]">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r bg-muted/30 p-4 space-y-2">
            <div className="px-3 py-2 mb-4">
              <h2 className="text-lg font-semibold text-foreground">Admin Dashboard</h2>
              <p className="text-xs text-muted-foreground mt-1">Manage mock data</p>
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'zones' && (
              <AdminZonesTable
                zones={zones}
                onUpdate={(newZones) => onUpdate({ zones: newZones })}
              />
            )}
            
            {activeSection === 'fulfillment' && (
              <AdminFulfillmentTable
                fulfillmentRates={fulfillmentRates}
                onUpdate={(newRates) => onUpdate({ fulfillmentRates: newRates })}
              />
            )}
            
            {activeSection === 'shipping' && (
              <AdminShippingTable
                shippingRates={shippingRates}
                onUpdate={(newRates) => onUpdate({ shippingRates: newRates })}
              />
            )}
            
            {activeSection === 'duty' && (
              <AdminDutyTable
                dutyRates={dutyRates}
                onUpdate={(newRates) => onUpdate({ dutyRates: newRates })}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
