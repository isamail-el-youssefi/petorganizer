import AppFooter from "@/components/appFooter";
import AppHeader from "@/components/appHeader";
import BackroundPattern from "@/components/backroundPattern";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackroundPattern />

      <div className="min-h-screen flex flex-col max-w-[1050px] mx-auto px-4">
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
