import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Upload, Download } from 'lucide-react';
import { ShippingRate } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AdminShippingTableProps {
  shippingRates: ShippingRate[];
  onUpdate: (rates: ShippingRate[]) => void;
}

export function AdminShippingTable({ shippingRates, onUpdate }: AdminShippingTableProps) {
  const { toast } = useToast();
  const [editedRates, setEditedRates] = useState<ShippingRate[]>(shippingRates);

  const handleEdit = (index: number, field: string, value: string | number) => {
    const updated = [...editedRates];
    if (field === 'carrier' || field === 'service' || field === 'zone') {
      updated[index] = { ...updated[index], [field]: value };
    } else if (field === 'weightMin') {
      updated[index] = { 
        ...updated[index], 
        weightBracket: { ...updated[index].weightBracket, min: Number(value) } 
      };
    } else if (field === 'weightMax') {
      updated[index] = { 
        ...updated[index], 
        weightBracket: { ...updated[index].weightBracket, max: Number(value) } 
      };
    } else if (field === 'rate') {
      updated[index] = { ...updated[index], rate: Number(value) };
    } else if (field === 'estimatedDaysMin') {
      updated[index] = { 
        ...updated[index], 
        estimatedDays: { ...updated[index].estimatedDays, min: Number(value) } 
      };
    } else if (field === 'estimatedDaysMax') {
      updated[index] = { 
        ...updated[index], 
        estimatedDays: { ...updated[index].estimatedDays, max: Number(value) } 
      };
    }
    setEditedRates(updated);
  };

  const handleAdd = () => {
    setEditedRates([...editedRates, {
      carrier: '',
      service: '',
      zone: '',
      weightBracket: { min: 0, max: 0 },
      rate: 0,
      estimatedDays: { min: 0, max: 0 }
    }]);
  };

  const handleDelete = (index: number) => {
    setEditedRates(editedRates.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onUpdate(editedRates);
    toast({ title: "Success", description: "Shipping rates updated successfully" });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        const imported: ShippingRate[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            carrier: values[0]?.trim() || '',
            service: values[1]?.trim() || '',
            zone: values[2]?.trim() || '',
            weightBracket: {
              min: Number(values[3]) || 0,
              max: Number(values[4]) || 0
            },
            rate: Number(values[5]) || 0,
            estimatedDays: {
              min: Number(values[6]) || 0,
              max: Number(values[7]) || 0
            }
          };
        });

        setEditedRates(imported);
        toast({ title: "CSV Imported", description: `${imported.length} rates loaded` });
      } catch (error) {
        toast({ title: "Import Failed", description: "Invalid CSV format", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csv = [
      'carrier,service,zone,weightMin,weightMax,rate,estimatedDaysMin,estimatedDaysMax',
      ...editedRates.map(r => `${r.carrier},${r.service},${r.zone},${r.weightBracket.min},${r.weightBracket.max},${r.rate},${r.estimatedDays.min},${r.estimatedDays.max}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipping_rates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Shipping Rates</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
          <label htmlFor="import-shipping">
            <Button size="sm" variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input
              id="import-shipping"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportCSV}
            />
          </label>
          <Button onClick={handleExportCSV} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carrier</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Min (kg)</TableHead>
              <TableHead>Max (kg)</TableHead>
              <TableHead>Rate ($)</TableHead>
              <TableHead>Min Days</TableHead>
              <TableHead>Max Days</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={rate.carrier}
                    onChange={(e) => handleEdit(index, 'carrier', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={rate.service}
                    onChange={(e) => handleEdit(index, 'service', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={rate.zone}
                    onChange={(e) => handleEdit(index, 'zone', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={rate.weightBracket.min}
                    onChange={(e) => handleEdit(index, 'weightMin', e.target.value)}
                    className="h-8 w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={rate.weightBracket.max}
                    onChange={(e) => handleEdit(index, 'weightMax', e.target.value)}
                    className="h-8 w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={rate.rate}
                    onChange={(e) => handleEdit(index, 'rate', e.target.value)}
                    className="h-8 w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={rate.estimatedDays.min}
                    onChange={(e) => handleEdit(index, 'estimatedDaysMin', e.target.value)}
                    className="h-8 w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={rate.estimatedDays.max}
                    onChange={(e) => handleEdit(index, 'estimatedDaysMax', e.target.value)}
                    className="h-8 w-16"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(index)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Changes
      </Button>
    </div>
  );
}
