"use client";

import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

export default function signOutBtn() {
  return <Button onClick={async () => await logOut()}>Sign out</Button>;
}
