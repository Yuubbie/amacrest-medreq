export type Urgency = 'routine' | 'priority' | 'stat';

export type RequisitionType = 'material' | 'cash' | 'store-issue' | 'transport';

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'supervisor-review'
  | 'store-review'
  | 'finance-review'
  | 'coordinator-review'
  | 'national-coordinator-review'
  | 'disbursement-ready'
  | 'procurement-queue'
  | 'approved'
  | 'rejected'
  | 'dispatched'
  | 'closed';

export type ApprovalLevel =
  | 'requester'
  | 'supervisor'
  | 'finance'
  | 'coordinator'
  | 'national-coordinator';

export interface RequestItem {
  id: string;
  sn?: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  transactionCode?: string;
}

export interface TransportPassenger {
  id: string;
  sn: number;
  name: string;
  type: 'patient' | 'caregiver';
  stateOfOrigin: string;
  transportCost: number;
  direction: 'incoming' | 'discharge';
}

export interface ApprovalSignature {
  level: ApprovalLevel;
  actor: string;
  role: string;
  timestamp: string;
  signatureStamp: string;
}

export interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  comment?: string;
  type: 'submitted' | 'approved' | 'rejected' | 'queried' | 'dispatched' | 'finance' | 'procurement' | 'reviewed' | 'coordinator' | 'national';
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
  requisitionType?: RequisitionType;
  department: string;
  unit: string;
  category: string;
  transactionCode?: string;
  items: RequestItem[];
  transportPassengers?: TransportPassenger[];
  urgency: Urgency;
  status: RequestStatus;
  currentApprovalLevel?: ApprovalLevel;
  signatures?: ApprovalSignature[];
  requestedBy: string;
  requestedByRole: string;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
  justification: string;
  timeline: TimelineEvent[];
  budgetCode: string;
  donorGrantCode?: string;
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  unit?: string;
  avatar: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  units: string[];
  budget: number;
  spent: number;
}

export interface BudgetItem {
  department: string;
  allocated: number;
  spent: number;
  committed: number;
}

export interface StateTransportRate {
  state: string;
  rateIncoming: number;
  rateDischarge: number;
}
