export interface BillCalculation {
  subtotal: number;
  serviceCharge: number;
  gstAmount: number;
  totalAmount: number;
}

export interface GuestInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  idProof?: string;
}

export interface StayDetails {
  checkIn: string;
  checkOut: string;
  roomType: string;
  numberOfGuests: number;
  numberOfNights: number;
  baseRate: number;
}

export interface AdditionalService {
  id: string;
  name: string;
  amount: number;
}

export function generateBillNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const time = now.getTime().toString().slice(-4);
  
  return `MR${year}${month}${day}${time}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return nights > 0 ? nights : 1;
}

export function calculateBill(
  baseAmount: number,
  additionalServices: AdditionalService[] = [],
  gstRate: number = 18,
  serviceChargeRate: number = 10
): BillCalculation {
  const servicesTotal = additionalServices.reduce((sum, service) => sum + service.amount, 0);
  const subtotal = baseAmount + servicesTotal;
  
  const serviceCharge = (subtotal * serviceChargeRate) / 100;
  const taxableAmount = subtotal + serviceCharge;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const totalAmount = taxableAmount + gstAmount;

  return {
    subtotal,
    serviceCharge,
    gstAmount,
    totalAmount
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}