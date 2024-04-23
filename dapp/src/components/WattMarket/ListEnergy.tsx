import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  listEnergyInputs,
  type ListEnergyInputs,
} from "~/data/schemas/energyMarket";
import toast, { CheckmarkIcon } from "react-hot-toast";

interface ListEnergyProps {
  currentEnergyBalance: number;
  listEnergy: (params: { amount: number; price: number }) => Promise<string>;
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
      const exploreTxUrl = await listEnergy(data);

      toast(() => (
        <span className="flex flex-col items-center gap-5 py-2 font-sans">
          <span className="flex items-center gap-3">
            <CheckmarkIcon />
            <span>Energy listing completed!</span>
          </span>
          <a
            href={exploreTxUrl}
            target="_blank"
            className="w-full rounded-md border border-blue-500 px-4 py-2 text-center text-blue-500"
            rel="noopener noreferrer"
          >
            View tx on explorer
          </a>
        </span>
      ));
    } catch (error) {
      console.log(error);

      toast.error("Energy listing failed");
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
