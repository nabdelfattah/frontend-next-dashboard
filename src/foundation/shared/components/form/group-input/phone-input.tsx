"use client";
import React, { useState } from "react";

interface CountryCode {
  code: string;
  label: string;
}

interface PhoneInputProps {
  countries: CountryCode[];
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end"; // New prop for dropdown position
}

/**
 * Phone number input with a country-code dropdown attached to either end.
 *
 * @param countries - Selectable countries. `code` is the dropdown option (e.g. "US"); `label` is the value written into the phone field when that country is selected (e.g. its dial code).
 * @param placeholder - Placeholder for the phone field. Defaults to `"+1 (555) 000-0000"`.
 * @param onChange - Called with the phone field's current value, both when a country is picked and when the field is typed into.
 * @param selectPosition - Which side the country dropdown sits on. Defaults to `"start"`.
 *
 * @example
 * <PhoneInput
 *   countries={[{ code: "US", label: "+1" }, { code: "EG", label: "+20" }]}
 *   onChange={setPhone}
 * />
 */
const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "+1 (555) 000-0000",
  onChange,
  selectPosition = "start", // Default position is 'start'
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [phoneNumber, setPhoneNumber] = useState<string>("+1");

  const countryCodes: Record<string, string> = countries.reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {}
  );

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setPhoneNumber(countryCodes[newCountry]);
    if (onChange) {
      onChange(countryCodes[newCountry]);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  return (
    <div className="relative flex">
      {/* Dropdown position: Start */}
      {selectPosition === "start" && (
        <div className="absolute">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="appearance-none bg-none rounded-l-lg border-0 border-r border-border bg-transparent py-3 pl-3.5 pr-8 leading-tight text-muted-foreground focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-muted-foreground bg-input-background"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-muted-foreground pointer-events-none bg-none right-3">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Input field */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={`h-11 w-full ${
          selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"
        } rounded-lg border border-input bg-input-background py-3 px-4 text-sm text-foreground shadow-theme-xs placeholder:text-placeholder focus:border-focus-brand focus:outline-hidden focus:ring-3 focus:ring-brand-500/10`}
      />

      {/* Dropdown position: End */}
      {selectPosition === "end" && (
        <div className="absolute right-0">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="appearance-none bg-none rounded-r-lg border-0 border-l border-border bg-transparent py-3 pl-3.5 pr-8 leading-tight text-muted-foreground focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-muted-foreground bg-input-background"
              >
                {country.code}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 flex items-center text-muted-foreground pointer-events-none right-3">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
