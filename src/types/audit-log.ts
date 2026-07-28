import { MongoObjectId } from "./mongo-object-id";

export interface AuditLogType extends MongoObjectId {
  action: string;
  resource: string;
  user?: { name?: string };
  createdAt: string;
  details: string;
}
