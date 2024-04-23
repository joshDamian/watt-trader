import Link from "next/link";
import { useEffect, type FC } from "react";
import useSWR from "swr";
import type { Address } from "viem";

interface MeterProps {
  getCurrentMeterBalance: (meterId: Address) => Promise<number>;
  lastRecordedBalance: number;
  meterId: Address;
  status: "active" | "inactive";
  test_reportConsumption: (meterBalance: number) => Promise<void>;
  syncMeterBalance: (balance: number) => void;
}

const Meter: FC<MeterProps> = ({
  getCurrentMeterBalance,
  lastRecordedBalance,
  meterId,
  status,
  test_reportConsumption,
  syncMeterBalance,
}) => {
  const key = `${meterId}/energyBalance`;
  const { data: currentMeterBalance } = useSWR(
    key,
    () => getCurrentMeterBalance(meterId),
    {
      refreshInterval: status === "active" ? 2500 : 0,
      onSuccess: (balance) => {
        syncMeterBalance(balance);
      },
    },
  );

  useEffect(() => {
    if (currentMeterBalance && currentMeterBalance > 0 && status === "active") {
      setTimeout(() => {
        test_reportConsumption(currentMeterBalance)
          .then(() => console.log("reported consumption"))
          .catch((error) => console.error(error));
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMeterBalance, status]);

  if (currentMeterBalance === undefined) return <div>Loading Meter</div>;

  const circumference = ((2 * 22) / 7) * 120;

  const energyUsagePercent =
    (currentMeterBalance === 0 || lastRecordedBalance === 0)
      ? 0
      : (currentMeterBalance / lastRecordedBalance) * 100;

  const strokeDashoffset =
    energyUsagePercent > 0
      ? circumference -
        (currentMeterBalance / lastRecordedBalance) * circumference
      : circumference;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-medium text-gray-700">Metre Unit</h1>
      <section className="flex flex-col gap-8 rounded-xl border border-gray-200 p-16">
        <div className="flex items-center justify-center">
          <svg className="h-72 w-72 -rotate-90 transform">
            <circle
              cx="145"
              cy="145"
              r="120"
              stroke="currentColor"
              strokeWidth="30"
              fill="transparent"
              className="text-gray-700"
            />

            <circle
              cx="145"
              cy="145"
              r="120"
              stroke="currentColor"
              strokeWidth="30"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-green-500"
            />
          </svg>
          <span className="absolute text-5xl">
            {Math.trunc(energyUsagePercent)}%
          </span>
        </div>

        {currentMeterBalance === 0 && (
          <p>
            <Link
              href="/dashboard/marketplace"
              className="rounded-md bg-green-500 px-6 py-3 font-medium text-white"
            >
              Buy Power
            </Link>
          </p>
        )}

        <div className="flex flex-col gap-4">
          <p>Meter ID: {meterId}</p>
          <p>
            Last recorded energy units balance: {lastRecordedBalance.toFixed(2)}{" "}
            kWh
          </p>
          <p>Current Energy Units: {currentMeterBalance.toFixed(2)} kWh</p>
          <p>
            Units used since last recorded balance:{" "}
            {(lastRecordedBalance - currentMeterBalance).toFixed(2)} kWh
          </p>
          <p className="flex items-center">
            Status:{" "}
            {status === "active" ? (
              <span className="mx-2 h-4 w-4 rounded-full bg-green-500"></span>
            ) : (
              <span className="mx-2 h-4 w-4 rounded-full bg-red-500"></span>
            )}{" "}
            <span>{status}</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Meter;
