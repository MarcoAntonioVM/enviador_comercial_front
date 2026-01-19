import type { UseFormReturn } from "react-hook-form";
import type { FieldConfig } from "./types";
import { CheckCircle, XCircle } from "lucide-react";

type Props<TForm extends Record<string, any>> = {
  field: FieldConfig<TForm>;
  form: UseFormReturn<TForm>;
  isEdit: boolean;
};

export function FieldRenderer<TForm extends Record<string, any>>({
  field,
  form,
  isEdit,
}: Props<TForm>) {
  const { register, watch, setValue, formState: { errors } } = form;

  if (isEdit && field.hiddenWhenEdit) return null;
  if (!isEdit && field.hiddenWhenCreate) return null;

  const name = String(field.name);
  const errorMsg = (errors as any)?.[name]?.message as string | undefined;
  
  // Mapa de clases para asegurar que Tailwind las detecte en build time
  const colSpanClasses: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };
  
  const colSpan = field.colSpan ?? 12;
  const colClass = colSpanClasses[colSpan] || "col-span-12";

  // Mapeo de iconos según el tipo de campo
  const getFieldIcon = () => {
    switch (field.type) {
      case "email": return "pi-envelope";
      case "password": return "pi-lock";
      case "text": 
        if (name.toLowerCase().includes("name") || name.toLowerCase().includes("nombre")) return "pi-user";
        return "pi-pencil";
      case "select": return "pi-tag";
      case "textarea": return "pi-file-edit";
      case "number": return "pi-hashtag";
      default: return "pi-pencil";
    }
  };

  // Renderizado para status-toggle (Activo/Inactivo)
  if (field.type === "status-toggle") {
    const currentValue = watch(field.name as any) || "active";
    
    return (
      <div className={colClass}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500">
            {field.label}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue(field.name as any, "active" as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl border font-medium transition-all ${
                currentValue === "active"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                  : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Activo</span>
            </button>
            <button
              type="button"
              onClick={() => setValue(field.name as any, "inactive" as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl border font-medium transition-all ${
                currentValue === "inactive"
                  ? "border-slate-300 bg-white text-slate-600"
                  : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Inactivo</span>
            </button>
          </div>
          {/* Hidden input para react-hook-form */}
          <input type="hidden" {...register(field.name as any)} />
          {errorMsg && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <i className="pi pi-exclamation-triangle text-xs"></i>
              <span>{errorMsg}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={colClass}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600" htmlFor={name}>
          {field.label}
        </label>
        
        {field.type === "select" ? (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i className={`pi ${getFieldIcon()} text-sm`}></i>
            </span>
            <select
              id={name}
              className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 appearance-none transition-all outline-none cursor-pointer"
              {...register(field.name as any)}
            >
              {field.options?.map((opt) => (
                <option key={String(opt.value)} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <i className="pi pi-chevron-down text-sm"></i>
            </span>
          </div>
        ) : field.type === "textarea" ? (
          <div className="relative">
            <span className="absolute top-3 left-0 pl-3.5 flex items-center text-slate-400">
              <i className={`pi ${getFieldIcon()} text-sm`}></i>
            </span>
            <textarea
              id={name}
              rows={4}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder:text-slate-400 transition-all outline-none resize-none"
              placeholder={field.placeholder}
              {...register(field.name as any)}
            />
          </div>
        ) : (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i className={`pi ${getFieldIcon()} text-sm`}></i>
            </span>
            <input
              id={name}
              type={field.type}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 placeholder:text-slate-400 transition-all outline-none"
              placeholder={field.placeholder}
              {...register(field.name as any)}
            />
          </div>
        )}
        
        {errorMsg && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <i className="pi pi-exclamation-triangle text-xs"></i>
            <span>{errorMsg}</span>
          </p>
        )}
      </div>
    </div>
  );
}