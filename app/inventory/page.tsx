'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Upload, FileSpreadsheet, Plus, CheckCircle2, AlertCircle, 
  Search, ArrowDownToLine, Package, RefreshCw, Layers, ShieldCheck,
  Send, X, Check, Heart, Building2, Trash2
} from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  department: string;
  unit: string;
  category: string;
  quantity: number;
  unitType: string;
  unitPrice: number;
  minLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const initialInventory: InventoryItem[] = [
  { id: '1', code: 'MED-001', name: 'Amoxicillin 500mg Capsules (Pack of 500)', department: 'Clinicals', unit: 'Pharmacy', category: 'Medicines', quantity: 85, unitType: 'Packs', unitPrice: 18000, minLevel: 20, status: 'In Stock' },
  { id: '2', code: 'MED-002', name: 'Sterile Wound Dressing Packs (10x10cm)', department: 'Clinicals', unit: 'Nursing', category: 'Medical Consumables', quantity: 18, unitType: 'Packs', unitPrice: 1200, minLevel: 40, status: 'Low Stock' },
  { id: '3', code: 'MED-004', name: 'Dental Extraction Forceps (Upper Molars)', department: 'Clinicals', unit: 'Dental Clinic', category: 'Surgical Tools', quantity: 6, unitType: 'Pairs', unitPrice: 18000, minLevel: 2, status: 'In Stock' },
  { id: '4', code: 'MED-005', name: 'Resistance Therapy Bands Set (Post-Op Facial)', department: 'Clinicals', unit: 'Physiotherapy', category: 'Rehabilitation', quantity: 12, unitType: 'Sets', unitPrice: 8500, minLevel: 10, status: 'In Stock' },
  { id: '5', code: 'FAC-001', name: 'Hospital-Grade Disinfectant (25L Jerry Can)', department: 'Facility', unit: 'Janitorial', category: 'Sanitation', quantity: 24, unitType: 'Jerry Cans', unitPrice: 16000, minLevel: 5, status: 'In Stock' },
  { id: '6', code: 'FAC-002', name: 'Industrial Laundry Bleach (Sodium Hypochlorite 25L)', department: 'Facility', unit: 'Laundry', category: 'Sanitation', quantity: 4, unitType: 'Jerry Cans', unitPrice: 12000, minLevel: 10, status: 'Low Stock' },
  { id: '7', code: 'FAC-004', name: 'Diesel Fuel AGO (Generator & Ambulance)', department: 'Facility', unit: 'Logistics/Fleet', category: 'Fuel', quantity: 850, unitType: 'Litres', unitPrice: 950, minLevel: 300, status: 'In Stock' },
  { id: '8', code: 'ADM-002', name: 'Parboiled Rice (50kg Bag) — Kitchen Supply', department: 'Admin', unit: 'Kitchen', category: 'Nutrition', quantity: 15, unitType: 'Bags', unitPrice: 35000, minLevel: 8, status: 'In Stock' },
  { id: '9', code: 'ADM-001', name: 'A4 Printing Paper (Carton of 5 Reams)', department: 'Admin', unit: 'Admin', category: 'Stationery', quantity: 20, unitType: 'Cartons', unitPrice: 22500, minLevel: 10, status: 'In Stock' },
  { id: '10', code: 'MED-005', name: 'Art Therapy Coloured Pencils & Drawing Pads', department: 'Clinicals', unit: 'Art & Craft', category: 'Rehabilitation', quantity: 0, unitType: 'Sets', unitPrice: 3700, minLevel: 15, status: 'Out of Stock' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssueItem, setSelectedIssueItem] = useState<InventoryItem | null>(null);
  const [issueQuantity, setIssueQuantity] = useState(1);
  const [issueRecipient, setIssueRecipient] = useState('Post-Op Nursing Ward');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Add Item State
  const [newItem, setNewItem] = useState({
    code: 'MED-002',
    name: '',
    department: 'Clinicals',
    unit: 'Nursing',
    category: 'Medical Consumables',
    quantity: 10,
    unitType: 'Packs',
    unitPrice: 5000,
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const item: InventoryItem = {
      id: Date.now().toString(),
      code: newItem.code,
      name: newItem.name,
      department: newItem.department,
      unit: newItem.unit,
      category: newItem.category,
      quantity: newItem.quantity,
      unitType: newItem.unitType,
      unitPrice: newItem.unitPrice,
      minLevel: 10,
      status: newItem.quantity > 10 ? 'In Stock' : newItem.quantity > 0 ? 'Low Stock' : 'Out of Stock',
    };

    setItems([item, ...items]);
    showToast(`✓ "${item.name}" registered in Central Store under ${item.department} (${item.unit})`);
    setShowAddModal(false);
    setNewItem({
      code: 'MED-002',
      name: '',
      department: 'Clinicals',
      unit: 'Nursing',
      category: 'Medical Consumables',
      quantity: 10,
      unitType: 'Packs',
      unitPrice: 5000,
    });
  };

  const handleStoreIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueItem) return;

    if (issueQuantity > selectedIssueItem.quantity) {
      alert('Cannot issue more items than currently in stock!');
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === selectedIssueItem.id) {
        const remaining = item.quantity - issueQuantity;
        return {
          ...item,
          quantity: remaining,
          status: remaining > item.minLevel ? 'In Stock' : remaining === 0 ? 'Out of Stock' : 'Low Stock',
        };
      }
      return item;
    }));

    showToast(`✓ Issued ${issueQuantity} ${selectedIssueItem.unitType} of "${selectedIssueItem.name}" to ${issueRecipient}. Stock updated.`);
    setShowIssueModal(false);
    setSelectedIssueItem(null);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || item.department.toLowerCase() === deptFilter.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar role="Storekeeper & Inventory" userName="Mr. Babatunde Lawal" />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-teal-50 border border-teal-300 text-teal-900 shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans">
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></div>
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-700 font-bold mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>CENTRAL MEDICAL & OPERATIONAL STORES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Central Store & Inventory Register
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track surgical consumables, medicines, sanitation chemicals, and issue Internal Store Vouchers with automatic stock deduction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast('Exporting active inventory to CSV / Excel...')}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet size={14} className="text-emerald-700" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ Register New Item</span>
            </button>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, drug, or item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Clinicals">Clinicals</option>
              <option value="Facility">Facility</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* ── Inventory Register Table ── */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-100 text-slate-700">
                <tr className="border-b border-slate-200 font-mono uppercase">
                  <th className="py-2.5 px-3">Item Code</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Item Description</th>
                  <th className="py-2.5 px-3">Department / Unit</th>
                  <th className="py-2.5 px-3 text-center">Available Stock</th>
                  <th className="py-2.5 px-3 text-right">Unit Value</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans bg-white">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Code */}
                    <td className="py-3 px-3 font-mono font-bold text-teal-700">
                      {item.code}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                      <span className="text-[10px] text-slate-500">{item.category}</span>
                    </td>

                    {/* Department / Unit */}
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {item.department} <span className="text-slate-500">({item.unit})</span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-base font-black text-slate-900">{item.quantity}</span>{' '}
                      <span className="text-[10px] text-slate-500">{item.unitType}</span>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        item.status === 'In Stock' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : item.status === 'Low Stock'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Store Issue Action */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedIssueItem(item);
                          setIssueQuantity(1);
                          setShowIssueModal(true);
                        }}
                        disabled={item.quantity === 0}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                      >
                        <Send size={12} />
                        <span>Issue Store Requisition</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ── Internal Store Issue Modal ── */}
      {showIssueModal && selectedIssueItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono text-teal-700 font-bold uppercase">INTERNAL STORE ISSUE WORKFLOW</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">Issue Stock from Central Store</h3>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 hover:bg-slate-200">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleStoreIssue} className="space-y-4 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
                <div className="text-slate-600">Item: <strong className="text-slate-900">{selectedIssueItem.name}</strong></div>
                <div className="text-slate-600 mt-1">Available in Store: <strong className="text-teal-700">{selectedIssueItem.quantity} {selectedIssueItem.unitType}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity to Issue</label>
                <input
                  type="number"
                  min={1}
                  max={selectedIssueItem.quantity}
                  value={issueQuantity}
                  onChange={(e) => setIssueQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Receiving Ward / Unit</label>
                <select
                  value={issueRecipient}
                  onChange={(e) => setIssueRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Post-Op Nursing Ward">Post-Op Nursing Ward (Ward 3)</option>
                  <option value="Hostel Unit">Hostel Unit (Patient Welfare)</option>
                  <option value="Pharmacy Dispensary">Pharmacy Dispensary</option>
                  <option value="Dental Clinic">Dental Clinic</option>
                  <option value="Kitchen Facility">Kitchen Facility</option>
                  <option value="Janitorial Cleaning Team">Janitorial Cleaning Team</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={14} strokeWidth={3} />
                  <span>Confirm Issue & Deduct Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Custom Item Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Register Item in Central Store</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 hover:bg-slate-200">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item Description / Brand</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surgical Suction Tubing (Sterile)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transaction Code</label>
                  <select
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-teal-700 font-mono font-bold"
                  >
                    <option value="MED-001">MED-001 (Medicines)</option>
                    <option value="MED-002">MED-002 (Medical Consumables)</option>
                    <option value="MED-003">MED-003 (Surgical Supplies)</option>
                    <option value="FAC-001">FAC-001 (Janitorial)</option>
                    <option value="FAC-004">FAC-004 (Fleet & Fuel)</option>
                    <option value="ADM-002">ADM-002 (Kitchen Food)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newItem.department}
                    onChange={(e) => setNewItem({ ...newItem, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="Clinicals">Clinicals</option>
                    <option value="Facility">Facility</option>
                    <option value="Admin">Admin</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItem.unitType}
                    onChange={(e) => setNewItem({ ...newItem, unitType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}