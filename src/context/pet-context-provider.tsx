"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextProviderProps = {
  pet: Pet[];
  children: React.ReactNode;
};

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  setSelectedPetId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPet: Pet | null;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  pet,
  children,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(pet);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  // Event handlers

  return (
    <PetContext.Provider
      value={{ pets, selectedPetId, selectedPet, setSelectedPetId }}
    >
      {children}
    </PetContext.Provider>
  );
}
