export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface Manager {
  _id: string;
  name: string;
  email: string;
  role: string;
  areaId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  areaId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  supportEmail: string;
  defaultCurrency: string;
  minimumPayment: number;
  serviceCommission: number;
  allowManagerRegistration: boolean;
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    sessionTimeout: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
} 