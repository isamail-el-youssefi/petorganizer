"use client";

import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { searchQuery, setSearchQuery } = useSearchContext();

  return (
    <form className="w-full h-ful">
      <input
        className="w-full h-full bg-white/20 py-3.5 rounded-md px-5 outline-none transition duration-300 focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        placeholder="Search pets"
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
