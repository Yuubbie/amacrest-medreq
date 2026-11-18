export type Urgency = 'routine' | 'priority' | 'stat';

export type RequisitionType = 'material' | 'cash';

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'hod-review'
  | 'store-review'
  | 'finance-review'
  | 'executive-review'
  | 'disbursement-ready'
  | 'procurement-queue'
  | 'approved'
  | 'rejected'
  | 'dispatched'
  | 'closed';

export interface RequestItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  comment?: string;
  type: 'submitted' | 'approved' | 'rejected' | 'queried' | 'dispatched' | 'finance' | 'procurement' | 'reviewed';
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface Request {
  id: string;
  title: string;
  requisitionType?: RequisitionType; // 'material' = Internal store transfer | 'cash' = Financial disbursement
  department: string;
  category: string;
  items: RequestItem[];
  urgency: Urgency;
  status: RequestStatus;
  requestedBy: string;
  requestedByRole: string;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
  justification: string;
  timeline: TimelineEvent[];
  budgetCode: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  spent: number;
}

export interface BudgetItem {
  department: string;
  allocated: number;
  spent: number;
  committed: number;
}
