import Image from "next/image";

export default function PetList() {
  return (
    <ul className="bg-white border-b bg-black/[0.08]">
      <li>
        <button className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-4 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition duration-300">
          <Image
            src={"/pet-house.png"}
            alt="Pet Image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Richard</p>
        </button>
      </li>
      <li>
        <button className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-4 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition duration-300">
          <Image
            src="/pet-house.png"
            alt="Pet Image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Richard</p>
        </button>
      </li>
    </ul>
  );
}
