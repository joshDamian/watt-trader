import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  listEnergyInputs,
  type ListEnergyInputs,
} from "~/data/schemas/energyMarket";

interface ListEnergyProps {
  currentEnergyBalance: number;
  listEnergy: (params: { amount: number; price: number }) => Promise<void>;
}

const ListEnergy: FC<ListEnergyProps> = ({
  listEnergy,
  currentEnergyBalance,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ListEnergyInputs>({
    resolver: zodResolver(listEnergyInputs(currentEnergyBalance)),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ListEnergyInputs) => {
    try {
      await listEnergy(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex w-full flex-1 flex-col gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-2.5">
        <label htmlFor="amount">Energy Amount (kWh)</label>
        <input
          id="amount"
          className="w-full rounded-md border border-gray-200 p-5"
          {...register("amount")}
          placeholder="10 kWh"
          type="number"
          step="0.01"
        />

        {errors.amount ? (
          <p className="text-red-500">{errors.amount.message}</p>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <label htmlFor="amount">Price (XTZ)</label>
        <input
          id="price"
          className="w-full rounded-md border border-gray-200 p-5"
          {...register("price")}
          placeholder="0.01 XTZ"
          step="0.001"
          type="number"
        />

        {errors.price ? (
          <p className="text-red-500">{errors.price.message}</p>
        ) : null}
      </div>

      <button
        className="rounded-md bg-green-500 px-7 py-2.5 text-center text-white"
        type="submit"
      >
        {isSubmitting ? "Submitting..." : "List Energy"}
      </button>
    </form>
  );
};

export default ListEnergy;
