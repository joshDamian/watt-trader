import Meter from "~/components/Dashboard/Meter";
import Overview from "~/components/Dashboard/Overview";
import {
  getEnergyBalance,
  test_reportEnergyConsumption,
  getEnergyOverview,
  test_registerEnergyProductionUnit,
  test_mintEnergyTokens,
} from "~/data/adapters/browser/platform/energy";
import { useLocalStorage } from "usehooks-ts";
import ProductionUnit from "~/components/Dashboard/ProductionUnit";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCurrentAuthUser } from "~/data/adapters/server/platform/session";
import { userRepository } from "~/data/adapters/server/xata/repositories";
import RegisterProductionUnit from "~/components/Dashboard/RegisterProductionUnit";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";

type DashboardPageProps = Readonly<
  InferGetServerSidePropsType<typeof getServerSideProps>
>;

export default function DashboardPage({ user }: DashboardPageProps) {
  const [lastRecordedBalance, setLastRecordedBalance] = useLocalStorage<number>(
    "test_lastRecordedBalance",
    0,
  );
  const [productionUnitStatus, setProductionUnitStatus] = useLocalStorage<
    "active" | "inactive"
  >("test_productionUnitStatus", "inactive");
  const [currMeterBalance, setCurrMeterBalance] = useLocalStorage<number>(
    "currentMeterBalance",
    0,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLastEnergyReportTime] = useLocalStorage<number>(
    "lastEnergyReport",
    0,
  );

  useEffect(() => {
    if (currMeterBalance > lastRecordedBalance) {
      setLastRecordedBalance(currMeterBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currMeterBalance]);

  const router = useRouter();

  const meterStatus: "active" | "inactive" =
    currMeterBalance === 0 || productionUnitStatus === "active"
      ? "inactive"
      : "active";

  return (
    <section className="flex flex-col gap-20 p-12">
      <Overview
        getEnergyOverview={getEnergyOverview}
        userWallet={user.walletAddress}
      />

      <Link
        href="/dashboard/marketplace"
        className="w-fit rounded-md border border-blue-500 px-6 py-3 text-blue-500"
      >
        P2P Energy Marketplace {">"}
      </Link>

      <div className="grid grid-cols-2 gap-10">
        <Meter
          getCurrentMeterBalance={getEnergyBalance}
          status={meterStatus}
          meterId={user.walletAddress}
          lastRecordedBalance={lastRecordedBalance ?? 0}
          test_reportConsumption={test_reportEnergyConsumption}
          syncMeterBalance={setCurrMeterBalance}
        />

        {user.isEnergyProducer ? (
          <ProductionUnit
            mintEnergyTokens={async (amount) => {
              await test_mintEnergyTokens(amount);

              setLastRecordedBalance(currMeterBalance + amount);

              router.reload();
            }}
            currentCapacity={user.gridCapacity}
            connectionStatus={productionUnitStatus}
            setConnectionStatus={(newStatus) => {
              if (newStatus === "active") {
                setLastEnergyReportTime(0);
              }

              setProductionUnitStatus(newStatus);
            }}
          />
        ) : (
          <RegisterProductionUnit
            registerProductionUnit={async (gridSize) => {
              await test_registerEnergyProductionUnit(gridSize);

              router.reload();
            }}
          />
        )}
      </div>
    </section>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getCurrentAuthUser(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
    };
  }

  const userId = session.user.id;

  const user = await userRepository().readOrThrow(userId);

  return {
    props: {
      user: {
        walletAddress: session.user.walletAddress,
        isEnergyProducer: user.isEnergyProducer,
        gridCapacity: user.producerGridCapacity,
      },
    },
  };
}
