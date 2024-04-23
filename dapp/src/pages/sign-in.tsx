import SignIn from "~/components/SignIn";
import { signInWithEmail } from "~/data/adapters/browser/auth";
import { useRouter } from "next/router";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="grid min-h-screen grid-cols-2">
      <section className="flex h-full items-center bg-white px-28">
        <div className="flex w-full flex-col gap-10">
          <h3 className="text-3xl font-medium">Sign In to WattTrader</h3>
          <SignIn
            signIn={async (email) => {
              await signInWithEmail(email);

              router.reload();
            }}
          />
        </div>
      </section>
      <div className="relative">
        <Image
          alt="Electricity illustration"
          src="/electricity_illustration.jpg"
          fill
        />
      </div>
    </div>
  );
}
