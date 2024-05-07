/* "use server";

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

  // authentification
  const session = await auth();
  if (!session?.user) redirect("login");

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedNewPet = petFormSchema.safeParse(newPetData); // validate the data
  if (!validatedNewPet.success || !validatedPetId.success) {
    return { message: "Invalid pet data" };
  }

  // authorization check
  const pet = await prisma.pet.findUnique({
    where: { id: validatedPetId.data },
    select: { userId: true },
  });
  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet?.userId !== session.user.id) {
    return { message: "You are not authorized to edit this pet" };
  }

  //?? database mutation
  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
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
  if (!pet) {
    return { message: "Pet not found" };
  }
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
} */

"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

//?? --- user actions --- ??//

//!! User Login
// prevState prop is just for useFormState for handling error in the authForm
// component to work properly
export async function logIn(prevState: unknown, formData: FormData) {

  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid email or password",
          };
        }
        default: {
          return {
            message: "Could not sign in",
          };
        }
      }
    }

    throw error; // nextjs redirects throws error, so we need to rethrow it
  }
}

//!! User Register
export async function register(prevState: unknown, formData: unknown) {
  // check if formData is FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  // convert formData to a plain object (bz of zod z.obj)
  const formDataObj = Object.fromEntries(formData.entries());

  // validation
  const validateFormData = authSchema.safeParse(formDataObj);
  if (!validateFormData.success) {
    return {
      message: "Invalid form data",
    };
  }

  const hashedPassword = await bcrypt.hash(validateFormData.data.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: validateFormData.data.email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
        };
      }
    }
    return {
      message: "Could not create user",
    };
  }

  await signIn("credentials", formData);
}

//!! User LogOut (destroy cookie)
export async function logOut() {
  await sleep(1000);
  await signOut({ redirectTo: "/" });
}

//?? --- pet actions --- ??//

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
    return { message: error };
  }

  revalidatePath("/app", "layout");
}

//!! Update Pet Action
export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
  await sleep(500);

  // authentification
  const session = await auth();
  if (!session?.user) redirect("login");

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedNewPet = petFormSchema.safeParse(newPetData); // validate the data
  if (!validatedNewPet.success || !validatedPetId.success) {
    return { message: "Invalid pet data" };
  }

  // authorization check
  const pet = await prisma.pet.findUnique({
    where: { id: validatedPetId.data },
    select: { userId: true },
  });
  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet?.userId !== session.user.id) {
    return { message: "You are not authorized to edit this pet" };
  }

  // database mutation
  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
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
  if (!pet) {
    return { message: "Pet not found" };
  }
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
