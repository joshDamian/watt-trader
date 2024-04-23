import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegisterProductionUnitFormInputs,
  registerProductionUnitFormInputs,
} from "~/data/schemas/productionUnit";

interface RegisterProductionUnitProps {
  registerProductionUnit: (gridSize: number) => Promise<void>;
}

const RegisterProductionUnit: FC<RegisterProductionUnitProps> = ({
  registerProductionUnit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterProductionUnitFormInputs>({
    resolver: zodResolver(registerProductionUnitFormInputs),
  });

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-medium text-gray-700">Production Unit</h1>

      <form
        className="flex flex-col gap-8 rounded-xl border border-gray-200 p-16"
        onSubmit={handleSubmit((data) => registerProductionUnit(data.gridSize))}
      >
        <h2 className="text-center text-xl font-medium text-gray-700">
          Register Energy Production Unit
        </h2>
        <div className="flex w-full flex-col gap-2.5">
          <label htmlFor="gridSize">Grid Size (kVA)</label>
          <input
            {...register("gridSize")}
            type="number"
            id="gridSize"
            className="w-full rounded-md border border-gray-200 p-5"
            placeholder="Grid Size"
          />
          {errors.gridSize ? (
            <p className="text-red-500">{errors.gridSize.message}</p>
          ) : null}
        </div>

        <button
          className="rounded-md bg-green-500 px-7 py-2.5 text-center text-white"
          type="submit"
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterProductionUnit;
