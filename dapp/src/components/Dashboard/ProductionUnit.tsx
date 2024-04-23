import { useState } from "react";

interface ProductionUnitProps {
  currentCapacity: number;
  mintEnergyTokens: (increment: number) => Promise<void>;
  setConnectionStatus: (status: "active" | "inactive") => void;
  connectionStatus: "active" | "inactive";
}

const ProductionUnit: React.FC<ProductionUnitProps> = ({
  currentCapacity,
  mintEnergyTokens,
  setConnectionStatus,
  connectionStatus,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-medium text-gray-700">Production Unit</h1>
      <section className="flex flex-col gap-8 rounded-xl border border-gray-200 p-16">
        <div className="flex justify-center">
          <div className="flex h-[272px] w-[272px] items-center justify-center rounded-full border border-gray-700">
            <span className="text-4xl font-medium">{currentCapacity} kVA</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="flex flex-col gap-4">
            <span>Current Capacity: {currentCapacity} kVA</span>
            <button
              type="button"
              className="w-fit rounded-md bg-blue-500 px-4 py-2 text-white"
              onClick={async () => {
                try {
                  setLoading(true);

                  // simulate energy production
                  await mintEnergyTokens(1000);
                } catch (error) {
                  console.error(error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Loading..." : "Mint 1000kWh energy tokens"}
            </button>
          </p>
          <p className="flex items-center">
            Status:{" "}
            {connectionStatus === "active" ? (
              <span className="mx-2 h-4 w-4 rounded-full bg-green-500"></span>
            ) : (
              <span className="mx-2 h-4 w-4 rounded-full bg-red-500"></span>
            )}{" "}
            <span>{connectionStatus}</span>
          </p>
          <button
            type="button"
            className="w-fit rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={() => {
              if (connectionStatus === "active") {
                setConnectionStatus("inactive");
              } else {
                setConnectionStatus("active");
              }
            }}
          >
            {connectionStatus === "active" ? "Disconnect" : "Connect"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductionUnit;
