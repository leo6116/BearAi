"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="dark"
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#131313",
          border: "1px solid #2A2A2A",
          color: "#FFFFFF",
        },
      }}
      icons={{
        success: <span className="text-accent">✓</span>,
      }}
    />
  );
}
