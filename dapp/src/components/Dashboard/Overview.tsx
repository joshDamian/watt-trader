import { type FC } from "react";
import useSWR from "swr";
import type { Address } from "viem";

interface OverviewProps {
  userWallet: Address;
  getEnergyOverview: (userWallet: Address) => Promise<
    Readonly<{
      energyBalance: string;
      energyProduced: string;
      energyConsumed: string;
      energyPurchased: string;
    }>
  >;
}

const Overview: FC<OverviewProps> = ({ userWallet, getEnergyOverview }) => {
  const key = `energyOverview/${userWallet}`;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data, error } = useSWR(key, () => getEnergyOverview(userWallet), {
    refreshInterval: 2500,
  });

  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>Loading...</div>;

  const { energyBalance, energyConsumed, energyProduced, energyPurchased } =
    data;

  return (
    <section className="flex gap-12">
      <section className="flex divide-x rounded-xl border border-gray-200 py-5">
        <div className="flex flex-col gap-3 px-7 py-10">
          <h2 className="text-4xl font-medium">
            {Number(energyBalance).toFixed(2)}
            <span className="text-2xl font-normal">kWh</span>
          </h2>
          <p className="text-sm">Energy Balance</p>
        </div>
        <div className="flex flex-col gap-3 px-7 py-10">
          <h2 className="text-4xl font-medium">
            {Number(energyConsumed).toFixed(2)}
            <span className="text-2xl font-normal">kWh</span>
          </h2>
          <p className="text-sm">Total Energy Consumed</p>
        </div>
      </section>

      <section className="flex divide-x rounded-xl border border-gray-200 py-5">
        <div className="flex flex-col gap-3 px-7 py-10">
          <h2 className="text-4xl font-medium">
            {Number(energyProduced).toFixed(2)}
            <span className="text-2xl font-normal">kWh</span>
          </h2>
          <p className="text-sm">Total Energy Produced</p>
        </div>
        <div className="flex flex-col gap-3 px-7 py-10">
          <h2 className="text-4xl font-medium">
            {Number(energyPurchased).toFixed(2)}
            <span className="text-2xl font-normal">kWh</span>
          </h2>
          <p className="text-sm">Total Energy Purchased</p>
        </div>
      </section>
    </section>
  );
};

export default Overview;
