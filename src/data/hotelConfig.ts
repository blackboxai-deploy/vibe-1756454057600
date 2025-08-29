export interface HotelInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstNumber: string;
  website?: string;
}

export interface RoomType {
  id: string;
  name: string;
  baseRate: number;
  description: string;
}

export interface TaxConfig {
  gst: number;
  serviceCharge: number;
}

export const hotelInfo: HotelInfo = {
  name: "Hotel Jatashanker",
  address: "Near By Bus Stand, Main Market Road",
  city: "Chatterpur",
  state: "Madhya Pradesh",
  pincode: "471001",
  phone: "+91-9009024681",
  email: "info@hoteljatashanker.com",
  gstNumber: "23ABCDE1234F1Z5",
  website: "www.hoteljatashanker.com"
};

export const roomTypes: RoomType[] = [
  {
    id: "standard",
    name: "Standard Room",
    baseRate: 650,
    description: "Comfortable standard room with basic amenities"
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    baseRate: 850,
    description: "Spacious deluxe room with premium amenities"
  },
  {
    id: "suite",
    name: "Suite",
    baseRate: 1200,
    description: "Luxurious suite with separate living area"
  }
];

export const taxConfig: TaxConfig = {
  gst: 18, // 18% GST
  serviceCharge: 10 // 10% Service Charge
};

export const additionalServices = [
  { id: "laundry", name: "Laundry Service", rate: 100 },
  { id: "restaurant", name: "Restaurant Charges", rate: 200 },
  { id: "minibar", name: "Mini Bar", rate: 150 },
  { id: "spa", name: "Spa Services", rate: 500 },
  { id: "parking", name: "Parking", rate: 50 }
];