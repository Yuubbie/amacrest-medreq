'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Check, ChevronRight, ChevronLeft, AlertTriangle, Plus, Trash2, Info } from 'lucide-react';

const departments = [
  'Pharmacy',
  'Laboratory',
  'Nursing (Ward 3)',
  'Radiology',
  'Transport & Logistics (Drivers)',
  'Environmental & Janitorial',
  'Security & Safety',
  'Administration & HR',
  'Maintenance & Engineering',
  'IT & Communications',
  'Catering & Nutrition',
  'Emergency & Theatre'
];

const categoryMap: Record<string, string[]> = {
  'Pharmacy': ['Medications', 'IV Fluids', 'Medical Gas', 'Surgical Supplies'],
  'Laboratory': ['Lab Supplies', 'Reagents', 'Sample Containers', 'Equipment'],
  'Nursing (Ward 3)': ['PPE', 'Medical Consumables', 'Wound Care', 'Patient Care'],
  'Radiology': ['Lab Supplies', 'Film & Chemicals', 'Equipment', 'Consumables'],
  'Transport & Logistics (Drivers)': ['Vehicle Maintenance', 'Fuel & Lubricants', 'Tyres & Batteries', 'Logistics Supplies'],
  'Environmental & Janitorial': ['Sanitation Supplies', 'Waste Disposal Bags', 'Cleaning Chemicals', 'Industrial Cleaning Gear'],
  'Security & Safety': ['Security Infrastructure', 'Uniforms & Accessories', 'Lighting & Power', 'Communication Radios'],
  'Administration & HR': ['Office Supplies', 'Printing & Stationery', 'Board Materials', 'Staff Welfare'],
  'Maintenance & Engineering': ['Spare Parts', 'Generator Fuel (Diesel)', 'Plumbing & Electrical', 'Tools & Hardware'],
  'IT & Communications': ['Equipment', 'Software & Licenses', 'Network Supplies', 'Accessories & Peripherals'],
  'Catering & Nutrition': ['Food Items', 'Beverages', 'Kitchen Supplies', 'Cleaning'],
  'Emergency & Theatre': ['Medical Gas', 'Surgical Supplies', 'Medications', 'Equipment'],
};

const catalogItems: Record<string, { name: string; unit: string; price: number }[]> = {
  'Vehicle Maintenance': [
    { name: 'Toyota HiAce Ambulance Tyres (215/70 R15)', unit: 'Units', price: 42000 },
    { name: 'Engine Oil (Total Quartz 20W-50 - 5L)', unit: 'Gallons', price: 18000 },
    { name: 'Heavy Duty Car Battery 12V 75Ah', unit: 'Units', price: 65000 },
    { name: 'Brake Pads Set (Front & Rear)', unit: 'Sets', price: 28000 },
  ],
  'Sanitation Supplies': [
    { name: 'Hospital-Grade Bleach (Sodium Hypochlorite 25L)', unit: 'Jerry Cans', price: 14500 },
    { name: 'Biohazard Yellow Clinical Waste Bags (Pack of 100)', unit: 'Packs', price: 4800 },
    { name: 'Industrial Floor Mops with Metal Wringer', unit: 'Sets', price: 12000 },
    { name: 'Antiseptic Hand Wash Liquid (5L Canister)', unit: 'Units', price: 9500 },
  ],
  'Office Supplies': [
    { name: 'A4 Printing Paper 80gsm (Carton of 5 Reams)', unit: 'Cartons', price: 22500 },
    { name: 'Hospital Folder Files & Archival Notepads', unit: 'Packs of 50', price: 18500 },
    { name: 'HP Original Black Toner Cartridge 85A', unit: 'Units', price: 34000 },
  ],
  'Medications': [
    { name: 'Paracetamol Infusion 1000mg/100ml', unit: 'Units', price: 375 },
    { name: 'Amoxicillin 500mg Capsules (500-pack)', unit: 'Packs', price: 8500 },
    { name: 'Metformin 500mg Tablets (100-pack)', unit: 'Packs', price: 2200 },
    { name: 'Omeprazole 20mg Capsules (30-pack)', unit: 'Packs', price: 1800 },
    { name: 'Lisinopril 10mg Tablets (100-pack)', unit: 'Packs', price: 3200 },
  ],
  'Lab Supplies': [
    { name: 'PCR Test Reagent Kit', unit: 'Kits', price: 3600 },
    { name: 'Blood Collection Tube EDTA (100-pack)', unit: 'Packs', price: 4500 },
    { name: 'Microscope Glass Slides (box of 72)', unit: 'Boxes', price: 1200 },
    { name: 'Urinalysis Reagent Strips (100-pack)', unit: 'Packs', price: 2800 },
    { name: 'HIV Test Kits (25-pack)', unit: 'Packs', price: 7500 },
  ],
  'PPE': [
    { name: 'Latex Surgical Gloves Medium (box of 100)', unit: 'Boxes', price: 620 },
    { name: 'Latex Surgical Gloves Large (box of 100)', unit: 'Boxes', price: 620 },
    { name: 'Surgical Face Masks (box of 50)', unit: 'Boxes', price: 1800 },
    { name: 'Disposable Aprons (pack of 100)', unit: 'Packs', price: 950 },
    { name: 'Safety Goggles', unit: 'Units', price: 850 },
  ],
  'Medical Consumables': [
    { name: 'IV Administration Set Sterile', unit: 'Units', price: 75 },
    { name: 'Syringe 5ml (100-pack)', unit: 'Packs', price: 1200 },
    { name: 'Nasogastric Tube Size 16', unit: 'Units', price: 450 },
    { name: 'Urinary Catheter 16Fr', unit: 'Units', price: 800 },
    { name: 'Gauze Swabs 10cm x 10cm (100-pack)', unit: 'Packs', price: 650 },
  ],
};

const defaultCatalog = [
  { name: 'General Supply Item', unit: 'Units', price: 1000 },
  { name: 'Standard Equipment Part', unit: 'Units', price: 5000 },
  { name: 'Consumable Item', unit: 'Units', price: 500 },
];

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

const budgetMap: Record<string, { allocated: number; spent: number }> = {
  'Pharmacy': { allocated: 2500000, spent: 1890000 },
  'Laboratory': { allocated: 1800000, spent: 1420000 },
  'Nursing (Ward 3)': { allocated: 1200000, spent: 890000 },
  'Radiology': { allocated: 1100000, spent: 780000 },
  'Maintenance': { allocated: 950000, spent: 810000 },
  'IT Department': { allocated: 1500000, spent: 645000 },
  'Catering': { allocated: 600000, spent: 412000 },
  'Emergency/Theatre': { allocated: 800000, spent: 670000 },
};

export default function NewRequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'priority' | 'stat'>('routine');
  const [justification, setJustification] = useState('');

  // Step 2
  const [items, setItems] = useState<LineItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [showCatalog, setShowCatalog] = useState(false);

  const totalValue = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const budget = budgetMap[department] || { allocated: 1000000, spent: 500000 };
  const remaining = budget.allocated - budget.spent;
  const pct = remaining > 0 ? Math.min(100, Math.round((totalValue / remaining) * 100)) : 0;

  const catalogOptions = catalogItems[category] || defaultCatalog;
  const filtered = catalogSearch
    ? catalogOptions.filter(c => c.name.toLowerCase().includes(catalogSearch.toLowerCase()))
    : catalogOptions;

  const addItem = (cat: { name: string; unit: string; price: number }) => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name: cat.name,
      quantity: 1,
      unit: cat.unit,
      unitPrice: cat.price,
    }]);
    setShowCatalog(false);
    setCatalogSearch('');
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

  const steps = [
    { n: 1, label: 'Request Details' },
    { n: 2, label: 'Items' },
    { n: 3, label: 'Review & Submit' },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Requisition Submitted!</h2>
          <p className="text-slate-500 mb-4">Your request has been submitted for HOD approval.</p>
          <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="Staff Nurse" userName="Nurse Fatima Aliyu" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">New Requisition</h1>
          <p className="text-slate-500 mt-1">Create a supply request for departmental approval</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step > s.n ? 'bg-teal-600 text-white' :
                  step === s.n ? 'bg-teal-600 text-white ring-4 ring-teal-100' :
                  'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                  {step > s.n ? <Check size={16} /> : s.n}
                </div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${step >= s.n ? 'text-teal-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${step > s.n ? 'bg-teal-600' : 'bg-slate-200'}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800">Request Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Department *</label>
                  <select
                    value={department}
                    onChange={e => { setDepartment(e.target.value); setCategory(''); }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                  >
                    <option value="">Select department...</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    disabled={!department}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 disabled:opacity-50 disabled:bg-slate-50"
                  >
                    <option value="">Select category...</option>
                    {(categoryMap[department] || []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Urgency Level *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'routine' as const, label: 'Routine', emoji: '🟢', desc: 'Standard 48h SLA', color: 'border-slate-200 hover:border-slate-300', active: 'border-slate-500 bg-slate-50' },
                    { value: 'priority' as const, label: 'Priority', emoji: '🟡', desc: 'Needed within 24h', color: 'border-amber-200 hover:border-amber-300', active: 'border-amber-500 bg-amber-50' },
                    { value: 'stat' as const, label: 'STAT', emoji: '🔴', desc: 'Immediate — critical', color: 'border-red-200 hover:border-red-300', active: 'border-red-500 bg-red-50' },
                  ].map(opt => (
                    <label key={opt.value} className={`relative flex flex-col items-center gap-1 p-3 border-2 rounded-xl cursor-pointer transition-all ${urgency === opt.value ? opt.active : opt.color}`}>
                      <input type="radio" name="urgency" value={opt.value} checked={urgency === opt.value} onChange={() => setUrgency(opt.value)} className="sr-only" />
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-sm font-bold text-slate-700">{opt.label}</span>
                      <span className="text-[11px] text-slate-500 text-center">{opt.desc}</span>
                      {urgency === opt.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-teal-600 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {urgency === 'stat' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    <strong>STAT requests</strong> are escalated immediately and bypass standard SLA timelines. Only use for life-critical shortages.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Clinical Justification *</label>
                <textarea
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  rows={4}
                  placeholder="Explain why this requisition is needed, current stock levels, and patient impact if not fulfilled..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">{justification.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800">Add Items</h2>

              {/* Budget preview */}
              {department && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-800">Budget Impact Preview — {department}</p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Available budget: <strong>₦{remaining.toLocaleString()}</strong> · This request will use approximately <strong>{pct}%</strong> of remaining budget
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-teal-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-600 mt-1">
                    <span>₦0</span>
                    <span>₦{budget.allocated.toLocaleString()} allocated</span>
                  </div>
                </div>
              )}

              {/* Item catalog search */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Search Item Catalog</label>
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={e => { setCatalogSearch(e.target.value); setShowCatalog(true); }}
                  onFocus={() => setShowCatalog(true)}
                  placeholder="Search by item name..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                />
                {showCatalog && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    {filtered.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => addItem(cat)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-2 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-700">{cat.name}</p>
                          <p className="text-xs text-slate-400">Unit: {cat.unit} · ₦{cat.price.toLocaleString()} per unit</p>
                        </div>
                        <Plus size={14} className="text-teal-600 flex-shrink-0" />
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400">No items found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Items list */}
              {items.length > 0 ? (
                <div className="space-y-3">
                  <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    <span className="col-span-5">Item Name</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2">Unit</span>
                    <span className="col-span-2 text-right">Total</span>
                    <span className="col-span-1"></span>
                  </div>
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-lg p-3">
                      <div className="col-span-12 sm:col-span-5 text-sm font-medium text-slate-700 truncate">{item.name}</div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 text-xs text-slate-500">{item.unit}</div>
                      <div className="col-span-3 sm:col-span-2 text-sm font-semibold text-slate-700 text-right">
                        ₦{(item.quantity * item.unitPrice).toLocaleString()}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex justify-between items-center px-3 py-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <span className="text-sm font-semibold text-teal-700">Estimated Total Value</span>
                    <span className="text-lg font-black text-teal-700">₦{totalValue.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-400 text-sm">No items added yet. Search the catalog above to add items.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800">Review & Submit</h2>

              <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-800">{department || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Category</p>
                    <p className="text-sm font-medium text-slate-800">{category || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Urgency</p>
                    <p className="text-sm font-medium text-slate-800 capitalize">{urgency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Requested By</p>
                    <p className="text-sm font-medium text-slate-800">Nurse Fatima Aliyu</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Justification</p>
                  <p className="text-sm text-slate-700">{justification || 'No justification provided'}</p>
                </div>
              </div>

              {/* Items summary */}
              {items.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-3">Items ({items.length})</p>
                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2.5">Item</th>
                          <th className="text-center text-xs font-semibold text-slate-500 px-4 py-2.5">Qty</th>
                          <th className="text-right text-xs font-semibold text-slate-500 px-4 py-2.5">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-2.5 font-medium text-slate-700">{item.name}</td>
                            <td className="px-4 py-2.5 text-center text-slate-600">{item.quantity} {item.unit}</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-slate-700">₦{(item.quantity * item.unitPrice).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-teal-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-bold text-slate-700">Total Value</td>
                          <td className="px-4 py-3 text-right font-black text-teal-700">₦{totalValue.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Approval flow info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">📋 Approval Workflow</p>
                <div className="flex items-center gap-2 text-xs text-blue-700 flex-wrap">
                  <span className="bg-blue-100 px-2 py-1 rounded">You Submit</span>
                  <ChevronRight size={12} />
                  <span className="bg-blue-100 px-2 py-1 rounded">HOD Review</span>
                  <ChevronRight size={12} />
                  <span className="bg-blue-100 px-2 py-1 rounded">Finance Review</span>
                  <ChevronRight size={12} />
                  <span className="bg-blue-100 px-2 py-1 rounded">{totalValue > 500000 ? 'Executive Review →' : ''} Procurement</span>
                  <ChevronRight size={12} />
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Dispatch</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!department || !category || !justification.trim())}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-teal-200"
              >
                <Check size={16} />
                Submit Requisition
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
