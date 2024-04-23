import { userRepository } from "../xata/repositories";

type CreateUserPayload = {
    walletAddress: string;
    email: string;
};

const createUser = async (payload: CreateUserPayload) => {
    return await userRepository().create({
        email: payload.email,
        walletAddress: payload.walletAddress,
    });
};

export { createUser }