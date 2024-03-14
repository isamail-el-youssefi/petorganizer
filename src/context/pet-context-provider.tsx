"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  pet: Pet[];
  children: React.ReactNode;
};

type PetContextType = {
  pets: Pet[];
  selectedPetId: string | null;
  numberOfpets: number;
  setSelectedPetId: React.Dispatch<React.SetStateAction<string | null>>;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleAddPet: (newPet: Omit<Pet, "id">) => Promise<void>;
  handleEditPet: (id: string, updatedPet: Omit<Pet, "id">) => Promise<void>;
  selectedPet: Pet | undefined;
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
          return [...state, { ...payload, id: Date.now().toString() }];
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
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
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

  const handleEditPet = async (petId: string, updatedPet: Omit<Pet, "id">) => {
    /*     setPets(
      pets.map((pet) => (pet.id === petId ? { id: petId, ...updatedPet } : pet))
    ); */
    setOptimisticPets({ action: "edit", payload: { id: petId, updatedPet }});

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
