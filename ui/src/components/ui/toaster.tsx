import { Toaster as SoonerToaster } from "sonner";
import { isMobile } from "../../lib/utils";

export function Toaster() {
  return (
    <SoonerToaster
      position={`${isMobile() ? "top-center" : "bottom-right"}`}
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          boxShadow: "none"
        },
      }}
      visibleToasts={1}
    />
  );
}
