import { signIn, signOut } from "next-auth/react";
import { authenticateEmail } from "./magic/authenticateEmail";
import { getMagicClient } from "./magic/webClient";

const signInWithEmail = async (email: string) => {
    const didToken = await authenticateEmail(email);

    await signIn("credentials", { didToken });
};

const logOut = async () => {
    const client = getMagicClient();

    await client.user.logout();

    await signOut({ redirect: false, callbackUrl: "/" });
};

export { signInWithEmail, logOut };