import ContentBlock from "@/components/contentBlock";
import H1 from "@/components/h1";

export default function Page() {
  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>
      <ContentBlock className="flex justify-center items-center h-[500px]">
        <p>Logged in as ...</p>
      </ContentBlock>
    </main>
  );
}
