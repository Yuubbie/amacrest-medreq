'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Upload, FileSpreadsheet, Plus, CheckCircle2, AlertCircle, 
  Search, ArrowDownToLine, Package, RefreshCw, Layers, ShieldCheck
} from 'lucide-react';

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  department: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  minLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const initialInventory: InventoryItem[] = [
  { id: '1', code: 'PHR-001', name: 'Paracetamol Infusion 1000mg/100ml', department: 'Pharmacy', category: 'Medications', quantity: 180, unit: 'Units', unitPrice: 375, minLevel: 50, status: 'In Stock' },
  { id: '2', code: 'LAB-014', name: 'PCR Test Reagent Kit (Complete)', department: 'Laboratory', category: 'Lab Supplies', quantity: 12, unit: 'Kits', unitPrice: 3600, minLevel: 25, status: 'Low Stock' },
  { id: '3', code: 'NUR-089', name: 'Latex Surgical Gloves Medium (Box of 100)', department: 'Nursing (Ward 3)', category: 'PPE', quantity: 240, unit: 'Boxes', unitPrice: 620, minLevel: 80, status: 'In Stock' },
  { id: '4', code: 'LOG-003', name: 'Toyota HiAce Ambulance Tyres (215/70 R15)', department: 'Transport & Logistics (Drivers)', category: 'Vehicle Parts', quantity: 2, unit: 'Units', unitPrice: 42000, minLevel: 4, status: 'Low Stock' },
  { id: '5', code: 'ENV-011', name: 'Hospital-Grade Bleach (Sodium Hypochlorite 25L)', department: 'Environmental & Janitorial', category: 'Sanitation', quantity: 18, unit: 'Jerry Cans', unitPrice: 14500, minLevel: 5, status: 'In Stock' },
  { id: '6', code: 'MNT-042', name: 'Industrial Generator Diesel (AGO)', department: 'Maintenance & Engineering', category: 'Fuel', quantity: 650, unit: 'Litres', unitPrice: 750, minLevel: 300, status: 'In Stock' },
  { id: '7', code: 'SEC-009', name: 'Deep Cycle Tubular Inverter Battery 12V 220Ah', department: 'Security & Safety', category: 'Infrastructure', quantity: 0, unit: 'Units', unitPrice: 175000, minLevel: 2, status: 'Out of Stock' },
  { id: '8', code: 'ADM-022', name: 'A4 Copy Printing Paper 80gsm (Carton of 5 Reams)', department: 'Administration & HR', category: 'Stationery', quantity: 35, unit: 'Cartons', unitPrice: 22500, minLevel: 10, status: 'In Stock' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Manual Add Form State
  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    department: 'Pharmacy',
    category: 'General Supplies',
    quantity: 1,
    unit: 'Units',
    unitPrice: 0,
    minLevel: 5,
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || newItem.unitPrice <= 0) return;

    const created: InventoryItem = {
      id: Date.now().toString(),
      code: newItem.code || `MED-${Math.floor(100 + Math.random() * 900)}`,
      name: newItem.name,
      department: newItem.department,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      unitPrice: Number(newItem.unitPrice),
      minLevel: Number(newItem.minLevel),
      status: Number(newItem.quantity) > Number(newItem.minLevel) ? 'In Stock' : Number(newItem.quantity) === 0 ? 'Out of Stock' : 'Low Stock',
    };

    setItems([created, ...items]);
    setShowAddModal(false);
    setUploadSuccess(`Successfully added custom item "${created.name}" to inventory.`);
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  const handleCsvSimulation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate CSV Parsing
    setUploadSuccess(`Parsing and importing "${file.name}"...`);
    setTimeout(() => {
      const simulatedImport: InventoryItem[] = [
        { id: `csv-${Date.now()}-1`, code: 'IMP-091', name: 'Catheter Foley 2-Way Silicone 16Fr', department: 'Nursing (Ward 3)', category: 'Consumables', quantity: 95, unit: 'Units', unitPrice: 1200, minLevel: 30, status: 'In Stock' },
        { id: `csv-${Date.now()}-2`, code: 'IMP-092', name: 'Total Quartz 20W-50 Engine Oil (5L)', department: 'Transport & Logistics (Drivers)', category: 'Lubricants', quantity: 12, unit: 'Gallons', unitPrice: 18000, minLevel: 4, status: 'In Stock' },
        { id: `csv-${Date.now()}-3`, code: 'IMP-093', name: 'Yellow Biohazard Clinical Bags', department: 'Environmental & Janitorial', category: 'Sanitation', quantity: 50, unit: 'Packs', unitPrice: 4800, minLevel: 15, status: 'In Stock' },
      ];
      setItems(prev => [...simulatedImport, ...prev]);
      setUploadSuccess(`✅ 3 items successfully imported and synced from "${file.name}"!`);
      setTimeout(() => setUploadSuccess(null), 5000);
    }, 1200);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Store Keeper / Materials Head" userName="Mr. Babatunde Lawal" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Central Materials & Inventory Management
              </span>
              <span className="text-xs text-slate-400">AMACREST Hospital Store</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 mt-2">Hospital Department Stock & Master Register</h1>
            <p className="text-slate-500 text-sm mt-1">
              Live database of consumables, spares, drugs & supplies with CSV batch upload & custom item entry.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold cursor-pointer shadow-sm transition-all">
              <Upload size={16} className="text-teal-600" />
              <span>Import CSV File</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleCsvSimulation} />
            </label>

            <a 
              href="/inventory-template.csv" 
              download 
              onClick={(e) => {
                e.preventDefault();
                const csvContent = "data:text/csv;charset=utf-8,ItemCode,ItemName,Department,Category,Quantity,Unit,UnitPrice,MinLevel\nDRG-101,Amoxicillin 500mg,Pharmacy,Medications,50,Packs,8500,20\nTYR-202,Ambulance Tyres,Transport & Logistics (Drivers),Vehicle,4,Units,42000,2\nSAN-303,Bleach 25L,Environmental & Janitorial,Sanitation,10,JerryCans,14500,5";
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "amacrest_inventory_template.csv");
                document.body.appendChild(link);
                link.click();
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              <ArrowDownToLine size={16} />
              <span>Download CSV Template</span>
            </a>

            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              <Plus size={16} />
              <span>Add Custom Item</span>
            </button>
          </div>
        </div>

        {/* Upload feedback banner */}
        {uploadSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-3 text-teal-800 text-sm font-medium animate-fadeIn">
            <CheckCircle2 size={20} className="text-teal-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Best Practices Banner for CA & Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">CSV Bulk Onboarding</h4>
              <p className="text-xs text-slate-500 mt-1">Each department uploads their opening balance spreadsheet in seconds without manual single typing.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Custom / Unlisted Items</h4>
              <p className="text-xs text-slate-500 mt-1">Allows staff to requisition non-catalog items with manual quote & justification, subject to HOD & Finance approval.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Par-Level Reorder Thresholds</h4>
              <p className="text-xs text-slate-500 mt-1">Auto-flags stockouts before clinical procedures or ambulance transfers are disrupted.</p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by item name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Dept:</span>
            <select 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="All">All Hospital Departments</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Nursing (Ward 3)">Nursing</option>
              <option value="Transport & Logistics (Drivers)">Transport & Logistics (Drivers)</option>
              <option value="Environmental & Janitorial">Environmental & Janitorial</option>
              <option value="Security & Safety">Security & Safety</option>
              <option value="Maintenance & Engineering">Maintenance & Engineering</option>
              <option value="Administration & HR">Administration & HR</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Item Code</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Available Qty</th>
                  <th className="py-3.5 px-4">Unit Price (₦)</th>
                  <th className="py-3.5 px-4">Total Value</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600">{item.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{item.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      ₦{item.unitPrice.toLocaleString('en-NG')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                      ₦{(item.quantity * item.unitPrice).toLocaleString('en-NG')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'In Stock' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : item.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-1">Add Custom / Unlisted Inventory Item</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new item specification not found in default hospital master catalog.</p>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Name / Description *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Special Surgical Clamp 15cm" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select 
                    value={newItem.department} 
                    onChange={(e) => setNewItem({...newItem, department: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Nursing (Ward 3)">Nursing</option>
                    <option value="Transport & Logistics (Drivers)">Transport (Drivers)</option>
                    <option value="Environmental & Janitorial">Environmental</option>
                    <option value="Security & Safety">Security</option>
                    <option value="Maintenance & Engineering">Maintenance</option>
                    <option value="Administration & HR">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Item Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CUS-901" 
                    value={newItem.code} 
                    onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Qty</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newItem.quantity} 
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <input 
                    type="text" 
                    placeholder="Units/Boxes/Sets" 
                    value={newItem.unit} 
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Est. Unit Price (₦)</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={newItem.unitPrice || ''} 
                    onChange={(e) => setNewItem({...newItem, unitPrice: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 shadow-md"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
