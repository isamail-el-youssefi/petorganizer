import Logo from "@/components/logo";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center min-h-screen">
      <Logo />
      {children}
    </div>
  );
}
