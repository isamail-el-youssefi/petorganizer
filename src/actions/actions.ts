"use server";

import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(pet: PetEssentials) {
  await sleep(500);
  
  const validatedPet = petFormSchema.safeParse(pet); // validate the data
  if (!validatedPet.success) {
    return { message: "Invalid pet data" };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return { message: "Could not add pet" };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
  await sleep(500);

  const validatedNewPet = petFormSchema.safeParse(newPetData); // validate the data
  if (!validatedNewPet.success) {
    return { message: "Invalid pet data" };
  }

  try {
    await prisma.pet.update({
      where: { id: petId },
      data: validatedNewPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet",
    };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await sleep(500);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("/app", "layout");
}
