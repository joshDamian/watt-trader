import { authOptions } from "~/pages/api/auth/[...nextauth]";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { HttpError } from "~/resources/errors/http";
import { UNAUTHORIZED } from "~/resources/constants";

export const getCurrentAuthUser = (...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse]) => getServerSession(...args, authOptions);

export const validateAuthInApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const currentUser = await getCurrentAuthUser(req, res);

    if (!currentUser) throw new HttpError(UNAUTHORIZED, "Unauthorized");

    return currentUser;
};
