import { useCallback, useEffect, useState } from "react";

export type UserGender = "men" | "women";

const STORAGE_KEY = "app.gender";

export function getStoredGender(): UserGender | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "men" || value === "women" ? value : null;
}

export function useGender() {
  const [gender, setGenderState] = useState<UserGender | null>(null);

  useEffect(() => {
    setGenderState(getStoredGender());
  }, []);

  const setGender = useCallback((value: UserGender) => {
    localStorage.setItem(STORAGE_KEY, value);
    setGenderState(value);
  }, []);

  const clearGender = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGenderState(null);
  }, []);

  return { gender, setGender, clearGender };
}

