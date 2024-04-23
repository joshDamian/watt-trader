import type { NextApiResponse, NextApiRequest } from "next";
import { validateAuthInApiHandler } from "~/data/adapters/server/platform/session";
import { registerProductionUnitFormInputs } from "~/data/schemas/productionUnit";
import { userRepository } from "~/data/adapters/server/xata/repositories";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await validateAuthInApiHandler(req, res);

        const body = registerProductionUnitFormInputs.parse(req.body);

        const user = await userRepository().readOrThrow(session.user.id);

        if (user.isEnergyProducer) {
            throw new Error('User is already energy producer');
        }

        // simulate approval
        await userRepository().update(session.user.id, { isEnergyProducer: true, producerGridCapacity: body.gridSize });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log('Error registering production unit', error);

        return res.status(500).json({ message: 'Error registering production unit' });
    }
}