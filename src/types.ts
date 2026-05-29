/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Appointment {
  id: string;
  patientName: string;
  mobileNumber: string;
  treatment: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  doctorName: string;
}

export interface DentalRecord {
  id: string;
  date: string;
  treatmentType: string;
  toothNumbers: string[];
  notes: string;
  attachment?: {
    name: string;
    type: 'X-Ray' | '3D Scan' | 'Photo';
    url: string;
  };
  doctorName: string;
  cost: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  mobileNumber: string;
  treatment: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  patientId: string; // e.g. "BABEL-2026-1049"
  registeredAt: string;
}
