import React, { FormEvent, ReactNode, useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

type Option = {
  value: number;
  label: string;
};

type SearchInputProps = {
  searchTerm: string;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  changeSearchType: (newSearchType: number) => void;
  children: ReactNode;
};


function CompactSelect({
  value,
  onChange,
  options,
}: {
  value: number | null;
  onChange: (val: number) => void;
  options: Option[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="
        h-9 w-[90px] sm:w-[120px]
        px-2 rounded-md
        border border-gray-400
        bg-transparent text-xs sm:text-sm
        flex-shrink-0
      "
    >

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}


export default function SearchInput({
  searchTerm,
  handleSearch,
  changeSearchType,
  children,
}: SearchInputProps) {
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const options: Option[] = React.Children.toArray(children).map(
    (child: any) => ({
      value: Number(child.props.value),
      label: child.props.children,
    })
  );

  // Inicializar con la primera opción disponible (solo una vez)
  useEffect(() => {
    if (options.length > 0 && selectedType === null) {
      const firstOption = options[0].value;
      setSelectedType(firstOption);
      changeSearchType(firstOption);
    }
  }, []); // Solo ejecutar al montar

  const handleSelectChange = (val: number) => {
    setSelectedType(val);
    changeSearchType(val);
  };

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSearch}
        className="
          flex items-center gap-2
          w-full max-w-[520px]
          px-3 py-2 rounded-full
          bg-black text-white
          transition-none  
        "
      >

        <input
          className="
            flex-1 min-w-0
            px-3 py-1.5
            bg-transparent
            text-sm sm:text-base
            focus:outline-none
            placeholder:text-gray-400
          "
          type="text"
          id="searchTerm"
          name="searchTerm"
          placeholder="Buscar por..."
          defaultValue={searchTerm}
        />

        <CompactSelect
          value={selectedType}
          onChange={handleSelectChange}
          options={options}
        />
        <button
          type="submit"
          className="
            h-9 w-9
            flex items-center justify-center
            rounded-full
            hover:bg-gray-700
            transition-colors
            flex-shrink-0
          "
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
}