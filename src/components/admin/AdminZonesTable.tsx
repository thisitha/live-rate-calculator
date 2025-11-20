import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Upload, Download } from 'lucide-react';
import { Zone } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AdminZonesTableProps {
  zones: Zone[];
  onUpdate: (zones: Zone[]) => void;
}

export function AdminZonesTable({ zones, onUpdate }: AdminZonesTableProps) {
  const { toast } = useToast();
  const [editedZones, setEditedZones] = useState<Zone[]>(zones);

  const handleEdit = (index: number, field: keyof Zone, value: string | string[]) => {
    const updated = [...editedZones];
    if (field === 'countries' && typeof value === 'string') {
      updated[index] = { ...updated[index], [field]: value.split(',').map(c => c.trim()) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditedZones(updated);
  };

  const handleAdd = () => {
    setEditedZones([...editedZones, { id: `zone_${Date.now()}`, name: '', countries: [] }]);
  };

  const handleDelete = (index: number) => {
    setEditedZones(editedZones.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    onUpdate(editedZones);
    toast({ title: "Success", description: "Zones updated successfully" });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        const imported: Zone[] = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            id: values[0]?.trim() || '',
            name: values[1]?.trim() || '',
            countries: values[2]?.split('|').map(c => c.trim()).filter(Boolean) || []
          };
        });

        setEditedZones(imported);
        toast({ title: "CSV Imported", description: `${imported.length} zones loaded` });
      } catch (error) {
        toast({ title: "Import Failed", description: "Invalid CSV format", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const csv = [
      'id,name,countries',
      ...editedZones.map(z => `${z.id},${z.name},"${z.countries.join('|')}"`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zones.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Zones</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Zone
          </Button>
          <label htmlFor="import-zones">
            <Button size="sm" variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input
              id="import-zones"
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Countries (comma-separated)</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedZones.map((zone, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={zone.id}
                    onChange={(e) => handleEdit(index, 'id', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={zone.name}
                    onChange={(e) => handleEdit(index, 'name', e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={zone.countries.join(', ')}
                    onChange={(e) => handleEdit(index, 'countries', e.target.value.split(',').map(c => c.trim()))}
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
