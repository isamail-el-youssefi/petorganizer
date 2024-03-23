import { logIn, register } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./authFormBtn";

type authFormProps = {
  type: "login" | "Sign up";
};

export default function AuthForm({ type }: authFormProps) {
  return (
    <form action={type === "login" ? logIn : register}>
      <div className="space-y-1 mt-5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required maxLength={50} />
      </div>

      <div className="space-y-1 mb-4 mt-2 ">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          maxLength={50}
        />
      </div>

      <AuthFormBtn type={type} />
    </form>
  );
}
