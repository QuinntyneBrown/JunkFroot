export interface TruckLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  updatedAt: string;
  estimatedCloseTime: string | null;
}

export interface TruckLocationUpdate {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

export interface OperatingSchedule {
  id: string;
  dayOfWeek: number;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  isActive: boolean;
}

export interface EventBooking {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  isPublic: boolean;
}

export interface CateringRequest {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  headcount: number;
  eventType: string;
  message: string;
}
