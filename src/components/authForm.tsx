"use client";
import { logIn, register } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./authFormBtn";
import { useFormState } from "react-dom";

type authFormProps = {
  type: "login" | "Sign up";
};

export default function AuthForm({ type }: authFormProps) {
  const [registerError, dispatchregister] = useFormState(register, undefined);
  const [loginError, dispatchLogin] = useFormState(logIn, undefined);

  return (
    <form action={type === "login" ? dispatchLogin : dispatchregister}>
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

      {registerError && (
        <p className="text-red-500 text-sm mt-2">{registerError.message}</p>
      )}

      {loginError && (
        <p className="text-red-500 text-sm mt-2">{loginError.message}</p>
      )}
    </form>
  );
}
