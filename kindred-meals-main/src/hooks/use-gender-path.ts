import { useLocation } from "react-router-dom";
import { getStoredGender } from "@/hooks/use-gender";

export function useGenderBasePath(options?: { defaultToSelect?: boolean }) {
  const { defaultToSelect = false } = options || {};
  const location = useLocation();
  if (location.pathname.startsWith("/men")) return "/men";
  if (location.pathname.startsWith("/women")) return "/women";
  const stored = getStoredGender();
  if (stored) return stored === "men" ? "/men" : "/women";
  return defaultToSelect ? "/select" : "";
}

