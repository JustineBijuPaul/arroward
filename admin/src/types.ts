export interface User {
  id: string;
  email: string;
  role: string;
  // add other user properties as needed
}

export interface Area {
  _id: string;
  name: string;
  description?: string;
  coordinates: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  country: string;
  state: string;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Manager {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  assignedArea: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  areaId?: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Settings {
  id: number;
  key: string;
  value: string | number | boolean;
  description?: string;
  security?: {
    twoFactorEnabled: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
    };
  };
  notifications?: {
    email: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
} 