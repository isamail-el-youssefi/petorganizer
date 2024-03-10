"use client";
import { usePetContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function PetList() {
  const { pets, setSelectedPetId, selectedPetId } = usePetContext();

  return (
    <ul className="bg-white border-b bg-black/[0.08]">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => setSelectedPetId(pet.id)}
            className={cn(
              "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-4 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition duration-300",
              { "bg-[#eff1f2]": selectedPetId === pet.id }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="Pet Image"
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
