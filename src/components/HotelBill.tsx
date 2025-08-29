"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  formatCurrency, 
  formatDateTime, 
  type GuestInfo, 
  type StayDetails, 
  type AdditionalService, 
  type BillCalculation 
} from "@/lib/billUtils";
import { hotelInfo, taxConfig } from "@/data/hotelConfig";

interface HotelBillProps {
  billNumber: string;
  guestInfo: GuestInfo;
  stayDetails: StayDetails;
  selectedServices: AdditionalService[];
  billCalculation: BillCalculation;
}

export function HotelBill({ 
  billNumber, 
  guestInfo, 
  stayDetails, 
  selectedServices, 
  billCalculation 
}: HotelBillProps) {
  const handlePrint = () => {
    window.print();
  };

  const currentDateTime = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="print:shadow-none shadow-lg">
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8 print:p-6">
            {/* Hotel Header */}
            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">{hotelInfo.name}</h1>
              <p className="text-lg text-gray-600">{hotelInfo.address}</p>
              <p className="text-lg text-gray-600">{hotelInfo.city}, {hotelInfo.state} - {hotelInfo.pincode}</p>
              <p className="text-gray-600">Phone: {hotelInfo.phone} | Email: {hotelInfo.email}</p>
              <p className="text-sm text-gray-500 mt-2">GST No: {hotelInfo.gstNumber}</p>
            </div>

            {/* Bill Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">HOTEL BILL</h2>
                <p className="text-gray-600">Bill No: <span className="font-semibold">{billNumber}</span></p>
                <p className="text-gray-600">Date: <span className="font-semibold">{currentDateTime}</span></p>
              </div>
              
              <div className="text-right">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-blue-800">
                    {formatCurrency(billCalculation.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Guest Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {guestInfo.name}</p>
                  {guestInfo.address && <p><span className="font-medium">Address:</span> {guestInfo.address}</p>}
                  {guestInfo.phone && <p><span className="font-medium">Phone:</span> {guestInfo.phone}</p>}
                  {guestInfo.email && <p><span className="font-medium">Email:</span> {guestInfo.email}</p>}
                  {guestInfo.idProof && <p><span className="font-medium">ID Proof:</span> {guestInfo.idProof}</p>}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Stay Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Check-in:</span> {formatDateTime(stayDetails.checkIn)}</p>
                  <p><span className="font-medium">Check-out:</span> {formatDateTime(stayDetails.checkOut)}</p>
                  <p><span className="font-medium">Room Type:</span> {stayDetails.roomType.charAt(0).toUpperCase() + stayDetails.roomType.slice(1)}</p>
                  <p><span className="font-medium">Guests:</span> {stayDetails.numberOfGuests}</p>
                  <p><span className="font-medium">Nights:</span> {stayDetails.numberOfNights}</p>
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Billing Details</h3>
              
              <div className="space-y-3">
                {/* Room Charges */}
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">Room Charges</span>
                    <span className="text-sm text-gray-600 ml-2">
                      (₹{stayDetails.baseRate} × {stayDetails.numberOfNights} night{stayDetails.numberOfNights > 1 ? 's' : ''})
                    </span>
                  </div>
                  <span className="font-medium">{formatCurrency(stayDetails.baseRate * stayDetails.numberOfNights)}</span>
                </div>

                {/* Additional Services */}
                {selectedServices.length > 0 && (
                  <>
                    <Separator />
                    <div className="text-sm font-medium text-gray-700 mt-2">Additional Services:</div>
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center py-1 pl-4">
                        <span className="text-sm">{service.name}</span>
                        <span className="text-sm">{formatCurrency(service.amount)}</span>
                      </div>
                    ))}
                  </>
                )}

                <Separator className="my-4" />

                {/* Subtotal */}
                <div className="flex justify-between items-center py-2 font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(billCalculation.subtotal)}</span>
                </div>

                {/* Service Charge */}
                <div className="flex justify-between items-center py-1 text-sm text-gray-600">
                  <span>Service Charge ({taxConfig.serviceCharge}%)</span>
                  <span>{formatCurrency(billCalculation.serviceCharge)}</span>
                </div>

                {/* GST */}
                <div className="flex justify-between items-center py-1 text-sm text-gray-600">
                  <span>GST ({taxConfig.gst}%)</span>
                  <span>{formatCurrency(billCalculation.gstAmount)}</span>
                </div>

                <Separator className="my-4" />

                {/* Total Amount */}
                <div className="flex justify-between items-center py-3 text-xl font-bold bg-blue-50 px-4 rounded-lg">
                  <span>Total Amount</span>
                  <span className="text-blue-800">{formatCurrency(billCalculation.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
              <p className="mb-2">Thank you for choosing {hotelInfo.name}!</p>
              <p>We hope you had a comfortable stay with us.</p>
              <p className="mt-4 text-xs">
                This is a computer generated bill and does not require signature.
              </p>
              {hotelInfo.website && (
                <p className="text-xs mt-2">Visit us at: {hotelInfo.website}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Button */}
      <div className="mt-6 text-center print:hidden">
        <Button onClick={handlePrint} size="lg" className="px-8">
          Print Bill
        </Button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}