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
  handlePetSelect: (petId: string) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  pet,
  children,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(pet);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  console.log(setSelectedPetId);

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(petId);
  };

  return (
    <PetContext.Provider value={{ pets, selectedPetId, handlePetSelect }}>
      {children}
    </PetContext.Provider>
  );
}
