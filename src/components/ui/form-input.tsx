import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  span?: string;
  register?: UseFormRegisterReturn;
  label?: string;
  children?: React.ReactNode;
  error?: string; // <-- Agregado para mostrar errores
}

export const FormInput: React.FC<FormInputProps> = ({
  span,
  register,
  label,
  className = "",
  children,
  error,
  ...props
}) => {
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      {children ? (
        children
      ) : span ? (
        <div className="flex items-center w-full">
          <span className="text-muted-foreground bg-gray-100 border border-r-0 rounded-l px-2 py-1 select-none text-smd">
            {span}
          </span>
          <input
            className={`border rounded-r text-md px-2 py-1 w-full border-l-0 focus:outline-none focus:ring-0 focus:ring-ring ${className}`}
            {...register}
            {...props}
          />
        </div>
      ) : (
        <input
          className={`w-full border rounded text-md px-2 py-1 ${className}`}
          {...register}
          {...props}
        />
      )}
      {error && (
        <span className="text-xs text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  );
};
