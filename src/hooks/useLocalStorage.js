// ─────────────────────────────────────────────────────────────
// src/hooks/useLocalStorage.js
//
// Hook générique pour lire/écrire dans localStorage.
// Utilisé par le contexte pour persister les questions custom.
//
// Usage :
//   const [value, setValue] = useLocalStorage("ma-cle", defaultValue);
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Accepte aussi les fonctions updater comme useState :
      // setValue(prev => ({ ...prev, newField: true }))
      const valueToStore =
        value instanceof Function ? value(stored) : value;
      setStored(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error("[useLocalStorage] Erreur lors de la sauvegarde :", e);
    }
  };

  const remove = () => {
    try {
      setStored(initialValue);
      localStorage.removeItem(key);
    } catch (e) {
      console.error("[useLocalStorage] Erreur lors de la suppression :", e);
    }
  };

  return [stored, setValue, remove];
}