import { z } from "zod";

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(50, "Too long"),
    ownerName: z
      .string()
      .trim()
      .min(1, "Owner name is required")
      .max(50, "Too long"),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Image url must be a valid url" }),
    ]),
    age: z.coerce.number().int().positive().max(999),
    notes: z.string().trim().max(1000, "Too long"),
  })
  .transform((data) => ({
    ...data,
    imageUrl:
      data.imageUrl ||
      "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
  }));

// taking typescript type from zod
export type PetFormType = z.infer<typeof petFormSchema>;