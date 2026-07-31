import { MongoObjectId } from "./mongo-object-id";
import { PetType } from "./enums/pet-type.enum";

export interface ProductType extends MongoObjectId {
  name: string;
  slug: string;
  brand?: string;
  pet_type?: PetType;
  is_active?: boolean;
  category: { name: string } | null;
  variants: Record<string, unknown>[];
  images: string[];
}
