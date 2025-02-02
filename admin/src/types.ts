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
  phone: string; // Remove optional modifier
  assignedArea: string;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  _id?: string;
  name: string;
  description: string;
  areaId: string;  // Add this field
  category: 'farm_maintenance' | 'home_cleaning' | 'house_painting' | 'blight_removal' | 'tree_services' | 'other';
  basePrice: number;
  priceUnit: 'per_hour' | 'per_square_meter' | 'per_job';
  active: boolean;
  requiredSkills?: string[];
  estimatedDuration: number;
  createdAt?: Date;
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