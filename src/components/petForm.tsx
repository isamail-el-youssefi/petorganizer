"use client";

import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet } from "@/actions/actions";

type actionTypeProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
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

  return (
    <form
      action={async (formData) => {
        await addPet(formData);
        onFormSubmission();
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            required
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            required
            defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
          />
        </div>
      </div>

      <Button type="submit" className="mt-6 px-20 py-5 self-end">
        {actionType === "add" ? "Add a new pet" : "Edit pet"}
      </Button>
    </form>
  );
}
