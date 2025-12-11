
export enum DriverStatus {
  AVAILABLE = 'Available',
  EN_ROUTE = 'En Route',
  AT_PICKUP = 'At Pickup',
  LOADED = 'Loaded',
  DELIVERED = 'Delivered',
  OFF_DUTY = 'Off Duty'
}

export enum LoadType {
  LOCAL = 'Local',
  OTR = 'OTR', // Over The Road
  REGIONAL = 'Regional'
}

export interface DriverPerformance {
  onTimeDeliveryRate: number; // Percentage 0-100
  safetyViolations: number; // Count
  averageMpg: number;
  scheduleAdherence: number; // Percentage 0-100
  managerScore: number; // Score assigned by admin 0-100
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  status: DriverStatus;
  truckType: string;
  currentLocation: string;
  rating: number;
  earningsWeek: number;
  performance: DriverPerformance;
}

export interface Load {
  id: string;
  origin: string;
  destination: string;
  rate: number;
  distance: number;
  weight: number;
  type: LoadType;
  status: 'Open' | 'Assigned' | 'In Progress' | 'Completed';
  commodity: string;
  pickupDate: string;
  assignedDriverId?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  category: 'Safety' | 'Compliance' | 'Skills';
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AdminProfile {
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export type DocumentType = 'BOL' | 'POD' | 'Fuel Receipt' | 'Scale Ticket' | 'Lumper Receipt' | 'Other';
export type DocumentStatus = 'Pending' | 'Verified' | 'Rejected';

export interface Document {
  id: string;
  type: DocumentType;
  loadId: string;
  driverName: string;
  uploadDate: string;
  status: DocumentStatus;
  notes?: string;
  fileSize: string;
}
