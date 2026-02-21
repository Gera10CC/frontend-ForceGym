import Select from "react-select";

type Option = {
  value: number | string;
  label: string;
  [key: string]: any; // permite datos extra como id, cédula, etc.
};

type Props = {
  id?: string;
  label?: string;

  options: Option[];
  value: Option | Option[] | null;
  onChange: (value: any) => void;
  isMulti?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
};

export default function SearchSelect({
  id,
  label,
  options,
  value,
  onChange,
  isMulti = false,
  placeholder = "Buscar...",
  isDisabled = false,
  isClearable = false,
  menuPlacement = "bottom",
}: Props) {
  return (
    <div>
      {label && <label className="text-sm font-bold">{label}</label>}

      <Select
        inputId={id}
        className="mt-1"
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isSearchable={true}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={isClearable}
        menuPlacement={menuPlacement}
        noOptionsMessage={() => "No hay resultados"}
        filterOption={(option, input) => {
          const text = input.toLowerCase();

          if (option.label.toLowerCase().includes(text)) return true;
          if (option.data?.identificationNumber?.toLowerCase().includes(text))
            return true;
          return false;
        }}
      />
    </div>
  );
}

