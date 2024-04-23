import { getXataClient } from ".";

export const userRepository = () => getXataClient().db.User;