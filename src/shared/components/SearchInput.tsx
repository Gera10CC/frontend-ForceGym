import React, { FormEvent, ReactNode, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

type Option = {
  value: number;
  label: string;
};

function ModernSelect({
  value,
  onChange,
  options,
}: {
  value: number | null;
  onChange: (val: number) => void;
  options: Option[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-[90px] sm:w-[130px] z-10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full px-3 py-2 
          rounded-md flex justify-between items-center
          text-sm

        "
      >
        {options.find((o) => o.value === value)?.label || "Tipo"}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className="
            absolute z-20 mt-2 w-full 
            bg-white border border-slate-300 
            rounded-md shadow-lg text-black
            max-h-48 overflow-auto
          "
        >
          {options.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item.value);  
                setOpen(false);
              }}
              className="
                px-3 py-2 text-sm cursor-pointer
                hover:bg-slate-100
              "
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type SearchInputProps = {
  searchTerm: string;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  changeSearchType: (newSearchType: number) => void;
  children: ReactNode;
};

export default function SearchInput({
  searchTerm,
  handleSearch,
  changeSearchType,
  children,
}: SearchInputProps) {
  
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const activeStyles =
    searchTerm !== "" ? "bg-white text-black" : "bg-black text-white";

  const options: Option[] = React.Children.toArray(children).map(
    (child: any) => ({
      value: Number(child.props.value),
      label: child.props.children,
    })
  );

  const handleSelectChange = (val: number) => {
    setSelectedType(val);
    changeSearchType(val); 
  };

  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <form
        onSubmit={handleSearch}
        className={`
          relative flex items-center 
          w-full max-w-[520px] 
          px-4 py-2 rounded-full text-lg 
          transition-colors duration-200 
          ${activeStyles}
        `}
      >
        {/* Input */}
        <input
          className="
            flex-1 min-w-0 
            pl-4 pr-12 
            bg-transparent 
            focus:outline-none
            placeholder:text-slate-400
          "
          type="text"
          id="searchTerm"
          name="searchTerm"
          placeholder="Buscar por"
          defaultValue={searchTerm}
        />

        <div className="mr-3">
          <ModernSelect
            value={selectedType}
            onChange={handleSelectChange}
            options={options}
          />
        </div>

        {/* Botón buscar */}
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2 
            p-2 rounded-full 
            hover:bg-slate-300 hover:text-black 
            transition cursor-pointer
            z-30
          "
        >
          <Search size={20} strokeWidth={2.2} />
        </button>
      </form>
    </div>
  );
}