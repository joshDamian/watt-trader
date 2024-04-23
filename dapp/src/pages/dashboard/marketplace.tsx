import Link from "next/link";
import React, { useState } from "react";
import EnergyListings from "~/components/WattMarket/EnergyListings";
import ListEnergy from "~/components/WattMarket/ListEnergy";
import {
  getEnergyListings,
  purchaseEnergy,
  listEnergy,
  getEnergyBalance,
} from "~/data/adapters/browser/platform/energy";
import { getCurrentAuthUser } from "~/data/adapters/server/platform/session";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";

type EnergyMarketplacePageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function EnergyMarketplacePage({
  user,
}: EnergyMarketplacePageProps) {
  const router = useRouter();

  const [showListEnergy, setShowListEnergy] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLastRecordedBalance] = useLocalStorage<number>(
    "test_lastRecordedBalance",
    0,
  );

  const key = `${user.walletAddress}/energyBalance`;

  const { data: currentEnergyBalance } = useSWR(
    key,
    () => getEnergyBalance(user.walletAddress),
    {
      refreshInterval: 3000,
    },
  );

  return (
    <div className="flex flex-col gap-8 p-12">
      <div className="flex items-center gap-5">
        <Link href="/dashboard" className="hover:text-blue-500 hover:underline">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-blue-500">Energy Marketplace</span>
      </div>
      {currentEnergyBalance === undefined ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => setShowListEnergy(!showListEnergy)}
            className="w-fit rounded-md border border-blue-500 px-6 py-3 text-blue-500"
          >
            {showListEnergy ? "Hide" : "List energy units for sale"}
          </button>

          {showListEnergy && (
            <div className="max-w-[680px]">
              <ListEnergy
                currentEnergyBalance={currentEnergyBalance}
                listEnergy={async (params) => {
                  await listEnergy(params);

                  setLastRecordedBalance(currentEnergyBalance - params.amount);

                  router.reload();
                }}
              />
            </div>
          )}
        </div>
      )}
      {currentEnergyBalance === undefined ? (
        <div>Loading...</div>
      ) : (
        <EnergyListings
          getEnergyListings={getEnergyListings}
          purchaseEnergy={async (params) => {
            console.log("called function");
            await purchaseEnergy(params);

            setLastRecordedBalance(currentEnergyBalance + params.energyAmount);

            router.reload();
          }}
        />
      )}
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getCurrentAuthUser(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
    };
  }

  return {
    props: {
      user: {
        walletAddress: session.user.walletAddress,
      },
    },
  };
};
