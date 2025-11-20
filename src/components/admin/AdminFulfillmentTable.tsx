import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Upload, Download } from 'lucide-react';
import { FulfillmentRate } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AdminFulfillmentTableProps {
  fulfillmentRates: FulfillmentRate[];
  onUpdate: (rates: FulfillmentRate[]) => void;
}

export function AdminFulfillmentTable({ fulfillmentRates, onUpdate }: AdminFulfillmentTableProps) {
  const { toast } = useToast();
  const [editedRates, setEditedRates] = useState<FulfillmentRate[]>(fulfillmentRates);

  const handleEdit = (index: number, field: string, value: string | number) => {
    const updated = [...editedRates];
    if (field === 'zone') {
      updated[index] = { ...updated[index], zone: value as string };
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
    } else if (field === 'fee') {
      updated[index] = { ...updated[index], fee: Number(value) };
    }
    setEditedRates(updated);
  };

  const handleAdd = () => {
    setEditedRates([...editedRates, { zone: '', weightBracket: { min: 0, max: 0 }, fee: 0 }]);
  };

  const handleDelete = (index: number) => {
    setEditedRates(editedRates.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onUpdate(editedRates);
    toast({ title: "Success", description: "Fulfillment rates updated successfully" });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        const imported: FulfillmentRate[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            zone: values[0]?.trim() || '',
            weightBracket: { 
              min: Number(values[1]) || 0,
              max: Number(values[2]) || 0 
            },
            fee: Number(values[3]) || 0
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
      'zone,weightMin,weightMax,fee',
      ...editedRates.map(r => `${r.zone},${r.weightBracket.min},${r.weightBracket.max},${r.fee}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fulfillment_rates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Fulfillment Rates</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
          <label htmlFor="import-fulfillment">
            <Button size="sm" variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input
              id="import-fulfillment"
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
              <TableHead>Zone</TableHead>
              <TableHead>Weight Min (kg)</TableHead>
              <TableHead>Weight Max (kg)</TableHead>
              <TableHead>Fee ($)</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedRates.map((rate, index) => (
              <TableRow key={index}>
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
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={rate.weightBracket.max}
                    onChange={(e) => handleEdit(index, 'weightMax', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={rate.fee}
                    onChange={(e) => handleEdit(index, 'fee', e.target.value)}
                    className="h-8"
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
