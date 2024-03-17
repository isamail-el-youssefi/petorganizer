import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type authFormProps = {
  type: "login" | "register";
};

export default function AuthForm({ type }: authFormProps) {
  return (
    <form className="">
      <div className="space-y-1 mt-5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>

      <div className="space-y-1 mb-4 mt-2 ">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>

      <Button>{type === "login" ? "Log in" : "Sign up"}</Button>
    </form>
  );
}
