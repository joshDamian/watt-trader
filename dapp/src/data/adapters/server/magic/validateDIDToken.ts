import { getMagicAdmin } from "./adminSdk";

/**
 * @description
 * The function will return an object if the specified DID token is authentic and not expired.
 * If the token is forged or otherwise invalid, the function will throw a descriptive error.
 */
export const validateDIDToken = async (didToken: string) => {
    const magic = getMagicAdmin();

    magic.token.validate(didToken); // throws an error if the token is forged or otherwise invalid

    const magicUser = await magic.users.getMetadataByToken(didToken);
    const { issuer, publicAddress, email } = magicUser;

    if (!publicAddress || !issuer || !email)
        throw new Error("Couldn't fetch required data"); // ensure required data is present

    return {
        issuer,
        publicAddress,
        email,
    };
};