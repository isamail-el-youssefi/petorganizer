import H1 from "@/components/h1";
import AuthForm from "@/components/authForm";
import Link from "next/link";

export default function page() {
  return (
    <main>
      <H1 className="text-center">Log in</H1>
      <AuthForm />
      <p className="mt-6 text-sm text-zinc-500">
        No account yet?{" "}
        <Link href="/signup" className="font-medium">
          Sign up
        </Link>
      </p>
    </main>
  );
}
