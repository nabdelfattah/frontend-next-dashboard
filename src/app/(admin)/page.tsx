import type { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title:
    "Dashboard",
  description: "This is the Home page",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
      </div>
    </div>
  );
}
