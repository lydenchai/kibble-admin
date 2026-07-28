import { MongoObjectId } from "./mongo-object-id";
import { PetType } from "./enums/pet-type.enum";

export interface ProductType extends MongoObjectId {
  name: string;
  brand: string;
  petType: PetType;
  isActive: boolean;
  category: { name: string } | null;
  variants: Record<string, unknown>[];
}
