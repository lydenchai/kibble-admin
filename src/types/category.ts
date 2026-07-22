import { MongoObjectId } from "./mongoObjectID";

export interface CategoryType extends MongoObjectId {
  name: string;
  slug: string;
  image?: string;
  parent?: string;
}
