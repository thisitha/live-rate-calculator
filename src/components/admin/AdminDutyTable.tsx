import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Upload, Download } from 'lucide-react';
import { DutyRate } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AdminDutyTableProps {
  dutyRates: DutyRate[];
  onUpdate: (rates: DutyRate[]) => void;
}

export function AdminDutyTable({ dutyRates, onUpdate }: AdminDutyTableProps) {
  const { toast } = useToast();
  const [editedRates, setEditedRates] = useState<DutyRate[]>(dutyRates);

  const handleEdit = (index: number, field: string, value: string | number) => {
    const updated = [...editedRates];
    if (field === 'country') {
      updated[index] = { ...updated[index], [field]: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) };
    }
    setEditedRates(updated);
  };

  const handleAdd = () => {
    setEditedRates([...editedRates, {
      country: '',
      dutyRate: 0,
      vatRate: 0,
      threshold: 0
    }]);
  };

  const handleDelete = (index: number) => {
    setEditedRates(editedRates.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onUpdate(editedRates);
    toast({ title: "Success", description: "Duty & VAT rates updated successfully" });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        const imported: DutyRate[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            country: values[0]?.trim() || '',
            dutyRate: Number(values[1]) || 0,
            vatRate: Number(values[2]) || 0,
            threshold: Number(values[3]) || 0
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
      'country,dutyRate,vatRate,threshold',
      ...editedRates.map(r => `${r.country},${r.dutyRate},${r.vatRate},${r.threshold}`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'duty_vat_rates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Duties & VAT Rates</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
          <label htmlFor="import-duty">
            <Button size="sm" variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input
              id="import-duty"
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
              <TableHead>Country</TableHead>
              <TableHead>Duty Rate (%)</TableHead>
              <TableHead>VAT Rate (%)</TableHead>
              <TableHead>Threshold ($)</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={rate.country}
                    onChange={(e) => handleEdit(index, 'country', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={rate.dutyRate}
                    onChange={(e) => handleEdit(index, 'dutyRate', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={rate.vatRate}
                    onChange={(e) => handleEdit(index, 'vatRate', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={rate.threshold}
                    onChange={(e) => handleEdit(index, 'threshold', e.target.value)}
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
