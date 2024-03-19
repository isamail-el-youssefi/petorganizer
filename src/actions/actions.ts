"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// --- user actions ---

export async function logIn(formData: FormData) {
  // const authData ={
  //  email: formData.get("email"),
  //  password: formData.get("password")
  //}
  //const authData = Object.fromEntries(formData.entries());
  await signIn("credentials", formData);
}

export async function register(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

// Destroy the cookie
export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// --- pet actions ---

//!! Add Pet Action
export async function addPet(pet: PetEssentials) {
  await sleep(500);

  // first chicking if the user is logged in
  const session = await auth();
  if (!session?.user) redirect("login");

  const validatedPet = petFormSchema.safeParse(pet); // validate the data
  if (!validatedPet.success) {
    return { message: "Invalid pet data" };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        User: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    //return { message: error };
    throw new Error(error);
  }

  revalidatePath("/app", "layout");
}

//!! Update Pet Action
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

//!! Delete Pet Action
export async function deletePet(petId: Pet["id"]) {
  await sleep(500);

  // authentication check
  const session = await auth();
  if (!session?.user) redirect("login");

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return { message: "Invalid pet data" };
  }

  // authorisation check
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
    select: {
      userId: true,
    },
  });
  if (pet.userId !== session.user.id) {
    return {
      message: "You are not authorised to delete this pet",
    };
  }

  // database mutation
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("/app", "layout");
}
