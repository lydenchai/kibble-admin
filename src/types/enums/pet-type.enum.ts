export const PetType = {
  DOG: "dog",
  CAT: "cat",
  BIRD: "bird",
  SMALL_PET: "small-pet",
  FISH: "fish",
  REPTILE: "reptile",
  OTHER: "other",
} as const;

export type PetType = (typeof PetType)[keyof typeof PetType];
