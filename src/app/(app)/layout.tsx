import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import BackroundPattern from "@/components/backroundPattern";
import { Toaster } from "@/components/ui/sonner";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  /*   const res = await fetch(
    "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  const pets: Pet[] = await res.json(); */
  // first chicking if the user is logged in
  const session = await auth();
  if (!session?.user) redirect("login");
  
  // then display pets for the specific user
  const pets = await prisma.pet.findMany({
    where: { userId: session.user.id },
  });

  return (
    <>
      <BackroundPattern />

      <div className="min-h-screen flex flex-col max-w-[1050px] mx-auto px-4">
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider pet={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />

        <Toaster position="bottom-right" />
      </div>
    </>
  );
}
