// Generated by Xata Codegen 0.29.4. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "User",
    columns: [
      { name: "walletAddress", type: "string", unique: true },
      { name: "email", type: "email", unique: true },
      {
        name: "isEnergyProducer",
        type: "bool",
        notNull: true,
        defaultValue: "false",
      },
      {
        name: "producerGridCapacity",
        type: "float",
        notNull: true,
        defaultValue: "0",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type User = InferredTypes["User"];
export type UserRecord = User & XataRecord;

export type DatabaseSchema = {
  User: UserRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Avoaja-Joshua-Akachi-s-workspace-go6354.eu-central-1.xata.sh/db/watt-trader",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
