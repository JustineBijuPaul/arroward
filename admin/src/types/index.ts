export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}

export interface Manager {
  _id: string;
  managerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  assignedArea: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  _id: string;
  name: string;
  description?: string;
  coordinates?: [number, number]; // [longitude, latitude]
  country?: string;
  state?: string;
  city?: string;
  active?: boolean;
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

// Add a type for area form data
export interface AreaFormData {
  name: string;
  description?: string;
  coordinates?: [string | number, string | number];
  country?: string;
  state?: string;
  city?: string;
} 