import ContentBlock from "@/components/contentBlock";
import H1 from "@/components/h1";
import SignOutBtn from "@/components/signOutBtn";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>
      <ContentBlock className="flex justify-center items-center h-[500px]">
        <p>Logged in as {session?.user.email}</p>
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}
