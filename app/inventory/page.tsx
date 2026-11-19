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
    unitType: 'Units',
    unitPrice: 1000,
    minLevel: 5,
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || newItem.unitPrice <= 0) return;

    const created: InventoryItem = {
      id: Date.now().toString(),
      code: newItem.code,
      name: newItem.name,
      department: newItem.department,
      unit: newItem.unit,
      category: newItem.category,
      quantity: Number(newItem.quantity),
      unitType: newItem.unitType,
      unitPrice: Number(newItem.unitPrice),
      minLevel: Number(newItem.minLevel),
      status: Number(newItem.quantity) > Number(newItem.minLevel) ? 'In Stock' : Number(newItem.quantity) === 0 ? 'Out of Stock' : 'Low Stock',
    };

    setItems([created, ...items]);
    setShowAddModal(false);
    showToast(`✓ Registered "${created.name}" in Central Store Register.`);
  };

  // Internal Store Issue Execution
  const handleStoreIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueItem) return;

    if (issueQuantity > selectedIssueItem.quantity) {
      showToast(`Error: Requested ${issueQuantity} exceeds available stock of ${selectedIssueItem.quantity}.`);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-teal-500 selection:text-zinc-950">
      <Navbar role="Storekeeper & Inventory" userName="Mr. Babatunde Lawal" />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-teal-950 border border-teal-500 text-teal-300 shadow-2xl flex items-center gap-3 animate-in fade-in text-xs font-bold font-sans">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span>{toast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>NOMA AID NIGERIA INITIATIVE</span>
              <span>/</span>
              <span>CENTRAL MEDICAL & OPERATIONAL STORES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Central Store & Inventory Register
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Track surgical consumables, medicines, sanitation chemicals, and issue Internal Store Vouchers with automatic stock deduction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast('Exporting active inventory to CSV / Excel...')}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ Register New Item</span>
            </button>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by code, drug, or item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-zinc-400">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Clinicals">Clinicals</option>
              <option value="Facility">Facility</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* ── Inventory Register Table ── */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase">
                  <th className="py-2.5 px-3">Item Code</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Item Description</th>
                  <th className="py-2.5 px-3">Department / Unit</th>
                  <th className="py-2.5 px-3 text-center">Available Stock</th>
                  <th className="py-2.5 px-3 text-right">Unit Value</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    
                    {/* Code */}
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">
                      {item.code}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">{item.name}</div>
                      <span className="text-[10px] text-zinc-500">{item.category}</span>
                    </td>

                    {/* Department / Unit */}
                    <td className="py-3 px-3 font-mono text-zinc-300">
                      {item.department} <span className="text-zinc-500">({item.unit})</span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-base font-black text-white">{item.quantity}</span>{' '}
                      <span className="text-[10px] text-zinc-500">{item.unitType}</span>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-zinc-300">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        item.status === 'In Stock' 
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                          : item.status === 'Low Stock'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
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
                        className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">INTERNAL STORE ISSUE WORKFLOW</span>
                <h3 className="text-base font-black text-white mt-0.5">Issue Stock from Central Store</h3>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleStoreIssue} className="space-y-4 mt-4">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs">
                <div className="text-zinc-400">Item: <strong className="text-white">{selectedIssueItem.name}</strong></div>
                <div className="text-zinc-400 mt-1">Available in Store: <strong className="text-teal-400">{selectedIssueItem.quantity} {selectedIssueItem.unitType}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Quantity to Issue</label>
                <input
                  type="number"
                  min={1}
                  max={selectedIssueItem.quantity}
                  value={issueQuantity}
                  onChange={(e) => setIssueQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Receiving Ward / Unit</label>
                <select
                  value={issueRecipient}
                  onChange={(e) => setIssueRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Post-Op Nursing Ward">Post-Op Nursing Ward (Ward 3)</option>
                  <option value="Hostel Unit">Hostel Unit (Patient Welfare)</option>
                  <option value="Pharmacy Dispensary">Pharmacy Dispensary</option>
                  <option value="Dental Clinic">Dental Clinic</option>
                  <option value="Kitchen Facility">Kitchen Facility</option>
                  <option value="Janitorial Cleaning Team">Janitorial Cleaning Team</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-black text-white">Register Item in Central Store</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-400 mb-1">Item Description / Brand</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surgical Suction Tubing (Sterile)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">Transaction Code</label>
                  <select
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-teal-300 font-mono"
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
                  <label className="block font-bold text-zinc-400 mb-1">Department</label>
                  <select
                    value={newItem.department}
                    onChange={(e) => setNewItem({ ...newItem, department: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
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
                  <label className="block font-bold text-zinc-400 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItem.unitType}
                    onChange={(e) => setNewItem({ ...newItem, unitType: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">Unit Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl"
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
