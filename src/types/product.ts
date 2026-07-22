import { MongoObjectId } from "./mongoObjectID";

export interface ProductType extends MongoObjectId {
  name: string;
  brand: string;
  petType: string;
  isActive: boolean;
  category: { name: string } | null;
  variants: Record<string, unknown>[];
}
