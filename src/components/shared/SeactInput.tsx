import { TextInput } from "flowbite-react";
import React, { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SeactInput({ onSearch }: SearchInputProps) {
  const [searcQuery, setSearchQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };
  return (
    <TextInput
      type="text"
      placeholder="Поиск..."
      value={searcQuery}
      onChange={handleChange}
      className="border rounded-lg"
    />
  );
}
