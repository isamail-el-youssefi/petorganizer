"use client";

import { createContext, useState } from "react";

type PetContextProviderProps = {
  children: React.ReactNode;
};

type SearchContextType = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export default function SearchContextProvider({
  children,
}: PetContextProviderProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state

  // Event handlers / Actions

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
