import { useFormContext } from "react-hook-form";

export const StepHealthInfo = () => {
  const { register } = useFormContext();

  const items = [
    { name: "diabetes", label: "¿Tiene diabetes?" },
    { name: "hypertension", label: "¿Tiene hipertensión?" },
    { name: "muscleInjuries", label: "¿Tiene lesiones musculares?" },
    {
      name: "boneJointIssues",
      label: "¿Tiene problemas óseos o en articulaciones?",
    },
    { name: "balanceLoss", label: "¿Sufre de pérdida de equilibrio?" },
    {
      name: "cardiovascularDisease",
      label: "¿Tiene enfermedades cardiovasculares?",
    },
    {
      name: "breathingIssues",
      label: "¿Tiene problemas respiratorios?",
    },
  ];

  return (
    <div className="space-y-4 w-full px-1 sm:px-2">
      {items.map((item) => (
        <label
          key={item.name}
          className="
            flex items-center gap-3
            p-3 border border-gray-200 rounded-md
            cursor-pointer select-none
            hover:bg-gray-50 transition-colors
          "
        >
          <input
            type="checkbox"
            {...register(item.name)}
            className="
              w-5 h-5 accent-yellow
              cursor-pointer
            "
          />
          <span className="text-sm sm:text-base font-medium text-gray-700">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
};