import { useState, type FC } from "react";
import useSWR from "swr";
import type { Address } from "viem";
import { truncateAddress } from "~/resources/utils/formatters";
import { twMerge } from "tailwind-merge";
import toast, { CheckmarkIcon } from "react-hot-toast";

interface EnergyListingsProps {
  getEnergyListings: () => Promise<
    Array<{
      producer: Address;
      amount: number;
      price: number;
      isActive: boolean;
      listingId: number;
    }>
  >;
  purchaseEnergy: (params: {
    listingId: number;
    price: number;
    energyAmount: number;
  }) => Promise<string>;
}

const EnergyListings: FC<EnergyListingsProps> = ({
  getEnergyListings,
  purchaseEnergy,
}) => {
  const key = "energyListings";

  const {
    data: energyListings,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    error,
    isValidating,
  } = useSWR(key, () => getEnergyListings(), {
    refreshInterval: 5000,
  });

  const [listingIdInPurchase, setListingIdInPurchase] = useState<number>();

  if (error) return <div>Error loading data</div>;

  if (!energyListings) return <div>Loading...</div>;

  return (
    <div className="relative">
      {isValidating && (
        <div className="absolute inset-x-0 mx-auto w-fit text-center">
          Syncing...
        </div>
      )}
      <div className="mt-8 grid grid-cols-4 gap-5">
        {energyListings.map((listing) => (
          <div
            key={listing.listingId}
            className="flex flex-col gap-5 border p-5"
          >
            <div className="truncate">
              Producer: {truncateAddress(listing.producer)}
            </div>
            <div>Amount: {listing.amount} kWh</div>
            <div>Price: {listing.price} XTZ</div>
            <div>Active: {listing.isActive ? "Yes" : "No"}</div>
            <button
              type="button"
              disabled={listingIdInPurchase !== undefined}
              className={twMerge(
                "border border-blue-500 px-2 py-1.5 text-blue-500",
                !listing.isActive && "border-gray-200 text-gray-200",
              )}
              onClick={async () => {
                try {
                  setListingIdInPurchase(listing.listingId);

                  const exploreTxUrl = await purchaseEnergy({
                    listingId: listing.listingId,
                    price: listing.price,
                    energyAmount: listing.amount,
                  });

                  toast(() => (
                    <span className="flex flex-col items-center gap-5 py-2 font-sans">
                      <span className="flex items-center gap-3">
                        <CheckmarkIcon />
                        <span>Energy purchased successfully!</span>
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
                  console.error(error);

                  toast.error("Energy purchase failed");
                } finally {
                  setListingIdInPurchase(undefined);
                }
              }}
            >
              {listing.isActive && (
                <>
                  {listingIdInPurchase === listing.listingId
                    ? "Purchasing..."
                    : "Purchase"}
                </>
              )}

              {!listing.isActive && "Purchased"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyListings;
