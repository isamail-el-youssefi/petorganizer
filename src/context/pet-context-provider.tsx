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
  numberOfpets: number;
  setSelectedPetId: React.Dispatch<React.SetStateAction<string | null>>;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleEditPet: (id: string, updatedPet: Omit<Pet, "id">) => void;
  selectedPet: Pet | undefined;
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
  const numberOfpets = pets.length;

  // Event handlers / Actions
  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    const newPetWithId = { ...newPet, id: crypto.randomUUID() };
    setPets([...pets, newPetWithId]);
  };

  const handleEditPet = (petId: string, updatedPet: Omit<Pet, "id">) => {
    setPets(
      pets.map((pet) => (pet.id === petId ? { id: petId, ...updatedPet } : pet))
    );
  };

  const handleCheckoutPet = (id: string) => {
    setPets(pets.filter((pet) => pet.id !== id));
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfpets,
        setSelectedPetId,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
