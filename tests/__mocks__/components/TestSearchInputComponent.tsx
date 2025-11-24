import { FormEvent, useState } from "react";
import SearchInput from "../../../src/shared/components/SearchInput";

function TestSearchInputComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<number | null>(null);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Buscando: ${searchTerm}, Tipo: ${searchType}`);
  };

  const handleTypeChange = (newType: number) => {
    setSearchType(newType);
  };

  return (
    <div>
      <p data-testid="search-term">{searchTerm}</p>
      <p data-testid="search-type">{searchType}</p>

      <SearchInput
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        changeSearchType={handleTypeChange}
      >
        <option value={1}>Nombre</option>
        <option value={2}>ID</option>
      </SearchInput>

      {/* input controlado para testing */}
      <input
        type="text"
        data-testid="search-input-control"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        hidden
      />
    </div>
  );
}

export default TestSearchInputComponent;
