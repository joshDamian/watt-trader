import { handleAuthRequest } from "~/data/adapters/server/magic/handleAuthRequest";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Address } from "viem";

export const authOptions: AuthOptions = {
    providers: [
        // Credentials with Magic auth
        CredentialsProvider({
            credentials: {
                didToken: {},
            },
            async authorize(credentials, _) {
                if (!credentials) throw new Error("missing credentials");

                const user = await handleAuthRequest(credentials.didToken);

                if (user) {
                    return user;
                }
                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 60 * 60, // 7 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            // Persist the user id to the token right after sign in

            if (user) {
                token.id = user.id;
                token.walletAddress = user.walletAddress as Address;
            }

            return token
        },
        async session({ session, token }) {
            session.user.id = token.id;

            session.user.walletAddress = token.walletAddress;

            return session
        }
    }
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export default handler;