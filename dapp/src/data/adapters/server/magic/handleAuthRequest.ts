import { userRepository } from "../xata/repositories";
import { validateDIDToken } from "./validateDIDToken";
import { createUser } from "~/data/adapters/server/platform/user";

interface AuthenticatedUser {
    id: string;
    email: string;
    walletAddress: string;
}

const handleAuthRequest = async (
    DIDToken: string
): Promise<AuthenticatedUser> => {
    const magicUser = await validateDIDToken(DIDToken);
    let dbUser = await userRepository().filter("email", magicUser.email).getFirst();

    if (!dbUser) {
        dbUser = await createUser({
            email: magicUser.email.toLowerCase(),
            walletAddress: magicUser.publicAddress,
        });
    }

    if (!dbUser.walletAddress) {
        dbUser = await dbUser.update({
            walletAddress: magicUser.publicAddress,
        });
    }

    if (!dbUser) throw new Error('User not retrieved');

    return {
        id: dbUser.id,
        email: dbUser.email!,
        walletAddress: dbUser.walletAddress!,
    };
};

export { handleAuthRequest };