"use client";
import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export default function AuthFormBtn({ type }: { type: "login" | "Sign up" }) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending}>
      {type === "login" ? "Log in" : "register"}
    </Button>
  );
}
