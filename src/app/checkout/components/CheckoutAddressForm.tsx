import React from "react";

interface CheckoutAddressFormProps {
  name: string;
  setName: (v: string) => void;
  mobile: string;
  setMobile: (v: string) => void;
  addressLine1: string;
  setAddressLine1: (v: string) => void;
  addressLine2: string;
  setAddressLine2: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  pincode: string;
  setPincode: (v: string) => void;
  saveAddress: boolean;
  setSaveAddress: (v: boolean) => void;
}

export function CheckoutAddressForm({
  name,
  setName,
  mobile,
  setMobile,
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  saveAddress,
  setSaveAddress,
}: CheckoutAddressFormProps) {
  return (
    <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
      <h2 className="font-serif font-bold text-lg text-dark border-b border-[#F2ECE4] pb-3">Shipping Address</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="checkout-name" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Contact Name
          </label>
          <input
            id="checkout-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rohan Sharma"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="checkout-mobile" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Mobile Number
          </label>
          <input
            id="checkout-mobile"
            name="mobile"
            type="tel"
            required
            pattern="[0-9]{10}"
            autoComplete="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10-digit number"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="checkout-addressLine1" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
          Address Line 1
        </label>
        <input
          id="checkout-addressLine1"
          name="addressLine1"
          type="text"
          required
          autoComplete="address-line1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          placeholder="Flat, House no., Building, Company, Apartment"
          className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="checkout-addressLine2" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
          Address Line 2 (Optional)
        </label>
        <input
          id="checkout-addressLine2"
          name="addressLine2"
          type="text"
          autoComplete="address-line2"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          placeholder="Area, Street, Sector, Village"
          className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="checkout-city" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Town/City
          </label>
          <input
            id="checkout-city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. New Delhi"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="checkout-state" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            State
          </label>
          <input
            id="checkout-state"
            name="state"
            type="text"
            required
            autoComplete="address-level1"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. Delhi"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="checkout-pincode" className="block text-xs font-bold text-[#6A5A4E] uppercase tracking-wider">
            Pincode
          </label>
          <input
            id="checkout-pincode"
            name="pincode"
            type="text"
            required
            pattern="[0-9]{6}"
            autoComplete="postal-code"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="6-digit pincode"
            className="w-full px-4 py-2.5 rounded-xl border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-sm text-[#3A332C] bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 select-none">
        <input
          type="checkbox"
          id="saveAddress"
          checked={saveAddress}
          onChange={(e) => setSaveAddress(e.target.checked)}
          className="w-4 h-4 rounded text-[#C82A54] border-[#DED6C9] focus:ring-[#C82A54]"
        />
        <label htmlFor="saveAddress" className="text-xs font-semibold text-[#6A5A4E] cursor-pointer">
          Save this address to my profile
        </label>
      </div>
    </div>
  );
}
