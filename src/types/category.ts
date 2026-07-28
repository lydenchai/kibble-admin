import { MongoObjectId } from "./mongo-object-id";

export interface CategoryType extends MongoObjectId {
  name: string;
  slug: string;
  image?: string;
  parent?: string;
}
