import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface License {
  id: string;
  name: string;
  authority: string;
  year: string;
  description: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'Manufacturer' | 'Logistics' | 'Research' | 'Healthcare Provider' | 'Retail Partner' | 'Clinic' | 'Non-Profit' | 'Technology';
  logoUrl: string;
}
