import { useState, type FC } from "react";
import useSWR from "swr";
import type { Address } from "viem";
import { truncateAddress } from "~/resources/utils/formatters";
import { twMerge } from "tailwind-merge";

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
  }) => Promise<void>;
}

const EnergyListings: FC<EnergyListingsProps> = ({
  getEnergyListings,
  purchaseEnergy,
}) => {
  const key = "energyListings";

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: energyListings, error } = useSWR(key, () =>
    getEnergyListings(),
  );

  const [listingIdInPurchase, setListingIdInPurchase] = useState<number>();

  if (error) return <div>Error loading data</div>;

  if (!energyListings) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-5">
      {energyListings.map((listing) => (
        <div key={listing.listingId} className="flex flex-col gap-5 border p-5">
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

                await purchaseEnergy({
                  listingId: listing.listingId,
                  price: listing.price,
                  energyAmount: listing.amount,
                });
              } catch (error) {
                console.error(error);
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
  );
};

export default EnergyListings;
