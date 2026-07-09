import { MongoObjectId } from "./mongoObjectID";

export interface AuditLogType extends MongoObjectId {
  action: string;
  resource: string;
  user?: { name?: string };
  createdAt: string;
  details: string;
}