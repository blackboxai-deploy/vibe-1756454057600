"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { HotelBill } from "./HotelBill";
import { 
  generateBillNumber, 
  calculateNights, 
  calculateBill, 
  type GuestInfo, 
  type StayDetails, 
  type AdditionalService 
} from "@/lib/billUtils";
import { roomTypes, additionalServices, taxConfig } from "@/data/hotelConfig";

export function HotelBillGenerator() {
  const [billGenerated, setBillGenerated] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  
  // Guest Information - Pre-filled with Visal Sen
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "Visal Sen",
    address: "",
    phone: "",
    email: "",
    idProof: ""
  });

  // Stay Details
  const [stayDetails, setStayDetails] = useState<StayDetails>({
    checkIn: "",
    checkOut: "",
    roomType: "standard",
    numberOfGuests: 1,
    numberOfNights: 1,
    baseRate: 650
  });

  // Additional Services
  const [selectedServices, setSelectedServices] = useState<AdditionalService[]>([]);

  // Calculate nights when check-in/out dates change
  useEffect(() => {
    if (stayDetails.checkIn && stayDetails.checkOut) {
      const nights = calculateNights(stayDetails.checkIn, stayDetails.checkOut);
      setStayDetails(prev => ({ ...prev, numberOfNights: nights }));
    }
  }, [stayDetails.checkIn, stayDetails.checkOut]);

  // Update base rate when room type changes
  useEffect(() => {
    const selectedRoom = roomTypes.find(room => room.id === stayDetails.roomType);
    if (selectedRoom) {
      setStayDetails(prev => ({ ...prev, baseRate: selectedRoom.baseRate }));
    }
  }, [stayDetails.roomType]);

  const handleServiceToggle = (service: typeof additionalServices[0], checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, {
        id: service.id,
        name: service.name,
        amount: service.rate
      }]);
    } else {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    }
  };

  const handleGenerateBill = () => {
    setBillNumber(generateBillNumber());
    setBillGenerated(true);
  };

  const handleNewBill = () => {
    setBillGenerated(false);
    setBillNumber("");
    setGuestInfo({
      name: "Visal Sen",
      address: "",
      phone: "",
      email: "",
      idProof: ""
    });
    setStayDetails({
      checkIn: "",
      checkOut: "",
      roomType: "standard",
      numberOfGuests: 1,
      numberOfNights: 1,
      baseRate: 650
    });
    setSelectedServices([]);
  };

  const roomAmount = stayDetails.baseRate * stayDetails.numberOfNights;
  const billCalculation = calculateBill(
    roomAmount,
    selectedServices,
    taxConfig.gst,
    taxConfig.serviceCharge
  );

  if (billGenerated) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Generated Bill</h2>
          <Button onClick={handleNewBill} variant="outline">
            Generate New Bill
          </Button>
        </div>
        <HotelBill
          billNumber={billNumber}
          guestInfo={guestInfo}
          stayDetails={stayDetails}
          selectedServices={selectedServices}
          billCalculation={billCalculation}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input
              id="guestName"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter guest name"
            />
          </div>
          
          <div>
            <Label htmlFor="guestAddress">Address</Label>
            <Textarea
              id="guestAddress"
              value={guestInfo.address}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter guest address"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="guestPhone">Phone Number</Label>
            <Input
              id="guestPhone"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <Label htmlFor="guestEmail">Email</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <Label htmlFor="idProof">ID Proof</Label>
            <Input
              id="idProof"
              value={guestInfo.idProof}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, idProof: e.target.value }))}
              placeholder="ID proof number (optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stay Details */}
      <Card>
        <CardHeader>
          <CardTitle>Stay Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="roomType">Room Type</Label>
            <Select value={stayDetails.roomType} onValueChange={(value) => 
              setStayDetails(prev => ({ ...prev, roomType: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - ₹{room.baseRate}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in Date *</Label>
              <Input
                id="checkIn"
                type="datetime-local"
                value={stayDetails.checkIn}
                onChange={(e) => setStayDetails(prev => ({ ...prev, checkIn: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="checkOut">Check-out Date *</Label>
              <Input
                id="checkOut"
                type="datetime-local"
                value={stayDetails.checkOut}
                onChange={(e) => setStayDetails(prev => ({ ...prev, checkOut: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numberOfGuests">Number of Guests</Label>
              <Input
                id="numberOfGuests"
                type="number"
                min="1"
                value={stayDetails.numberOfGuests}
                onChange={(e) => setStayDetails(prev => ({ 
                  ...prev, 
                  numberOfGuests: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
            
            <div>
              <Label>Number of Nights</Label>
              <Input
                value={stayDetails.numberOfNights}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Base Rate per Night:</span>
              <span className="font-medium">₹{stayDetails.baseRate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Number of Nights:</span>
              <span className="font-medium">{stayDetails.numberOfNights}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Room Total:</span>
              <span>₹{roomAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Additional Services (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalServices.map(service => (
              <div key={service.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox
                  id={service.id}
                  checked={selectedServices.some(s => s.id === service.id)}
                  onCheckedChange={(checked) => handleServiceToggle(service, !!checked)}
                />
                <div className="flex-1">
                  <Label htmlFor={service.id} className="text-sm font-medium">
                    {service.name}
                  </Label>
                  <p className="text-sm text-gray-600">₹{service.rate}</p>
                </div>
              </div>
            ))}
          </div>
          
          {selectedServices.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Services:</h4>
              {selectedServices.map(service => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name}</span>
                  <span>₹{service.amount}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Services Total:</span>
                <span>₹{selectedServices.reduce((sum, s) => sum + s.amount, 0)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill Summary & Generate */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Bill Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Room Charges:</span>
              <span>₹{roomAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Services:</span>
              <span>₹{selectedServices.reduce((sum, s) => sum + s.amount, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{billCalculation.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Service Charge ({taxConfig.serviceCharge}%):</span>
              <span>₹{billCalculation.serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>GST ({taxConfig.gst}%):</span>
              <span>₹{billCalculation.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{billCalculation.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateBill}
            className="w-full mt-6"
            size="lg"
            disabled={!guestInfo.name || !stayDetails.checkIn || !stayDetails.checkOut}
          >
            Generate Bill
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}