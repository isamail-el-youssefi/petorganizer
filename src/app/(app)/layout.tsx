import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import BackroundPattern from "@/components/backroundPattern";
import PetContextProvider from "@/context/pet-context-provider";
import { Pet } from "@/lib/types";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const res = await fetch(
    "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  const pets: Pet[] = await res.json();

  return (
    <>
      <BackroundPattern />

      <div className="min-h-screen flex flex-col max-w-[1050px] mx-auto px-4">
        <AppHeader />
        <PetContextProvider pet={pets}>{children}</PetContextProvider>

        <AppFooter />
      </div>
    </>
  );
}
