"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  pet: Pet[];
  children: React.ReactNode;
};

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfpets: number;
  setSelectedPetId: React.Dispatch<React.SetStateAction<string | null>>;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (id: Pet["id"], updatedPet: PetEssentials) => Promise<void>;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  pet: pets,
  children,
}: PetContextProviderProps) {
  //const [pets, setPets] = useState(pet);
  const [optimicPets, setOptimisticPets] = useOptimistic(
    pets,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random() }];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.updatedPet };
            }
            return pet;
          });
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Derived state
  const selectedPet = optimicPets.find((pet) => pet.id === selectedPetId);
  const numberOfpets = optimicPets.length;

  // Event handlers / Actions
  const handleAddPet = async (newPet: PetEssentials) => {
    /*     const newPetWithId = { ...newPet, id: crypto.randomUUID() };
    setPets([...pets, newPetWithId]); */
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    } else {
      toast.success("Pet added successfully");
    }
  };

  const handleEditPet = async (petId: Pet["id"], updatedPet: PetEssentials) => {
    /*     setPets(
      pets.map((pet) => (pet.id === petId ? { id: petId, ...updatedPet } : pet))
    ); */
    setOptimisticPets({ action: "edit", payload: { id: petId, updatedPet } });

    const error = await editPet(petId, updatedPet);
    if (error) {
      toast.warning(error.message);
      return;
    } else {
      toast.success("Pet edited successfully");
    }
  };

  const handleCheckoutPet = async (petId: string) => {
    //setPets(pets.filter((pet) => pet.id !== id));
    setOptimisticPets({ action: "delete", payload: petId });
    await deletePet(petId);
    toast.success("Pet deleted successfully");
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimicPets,
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
