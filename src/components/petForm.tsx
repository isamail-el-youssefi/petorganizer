"use client";

import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";

type actionTypeProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

type PetFormType = {
  name: string;
  ownerName: string;
  imageUrl: string;
  age: number;
  notes: string;
};

export default function petForm({
  actionType,
  onFormSubmission,
}: actionTypeProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { handleAddPet, selectedPet, handleEditPet } = usePetContext();
  /*   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const addEditPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: +(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };
    console.log(addEditPet);
    handleAddPet(addEditPet);

    // {
    //  actionType === "edit" ?
    //      handleEditPet(selectedPet!.id, addEditPet)
    //     : handleAddPet(addEditPet);
    // }

    if (actionType === "add") {
      handleAddPet(addEditPet);
    } else if (actionType === "edit") {
      handleEditPet(selectedPet!.id, addEditPet);  // (!) is for telling typescript fuck off i know what i am doing 
    }

    // to close the dialog after submitting
    onFormSubmission();
  }; */

  const {
    register,
    trigger,
    formState: { isSubmitting, errors },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm<PetFormType>();

  return (
    <form
      action={async (formData) => {
        
        const result = await trigger();
        //if the result not okay stop here and show the user where he did mistake errors formstate in useForm
        if (!result) return;

        onFormSubmission();

        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl:
            (formData.get("imageUrl") as string) ||
            "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
          age: Number(formData.get("age")),
          notes: formData.get("notes") as string,
        };

        //ADD
        if (actionType === "add") {
          // Add needs just the formDta to add new pet
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          // Edit needs the selected id and the form data to update
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name", {
              required: "Name is required",
              maxLength: { value: 50, message: "Name is too long" },
            })}
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register("ownerName")}
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            {...register("imageUrl")}
            defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register("age")}
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}

type PetFormBtnProps = {
  actionType: "add" | "edit";
};

const PetFormBtn = ({ actionType }: PetFormBtnProps) => {
  //const { pending } = useFormStatus(); //We dont need this anymore after using useOptimistic
  return (
    <Button
      type="submit"
      //disabled={pending}
      className="mt-6 px-20 py-5 self-end"
    >
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
};
