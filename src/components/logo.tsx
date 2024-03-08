import Image from "next/image";
import Link from "next/link";
import logo from "../public/pet-house.png"

export default function Logo() {
  return (
    <Link href="/">
      <Image src={logo} alt="PetSoft logo" width={50} height={50}  />
    </Link>
  );
}
