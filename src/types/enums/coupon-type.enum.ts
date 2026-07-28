export const CouponType = {
  PERCENTAGE: "percentage",
  FIXED_AMOUNT: "fixed_amount",
} as const;

export type CouponType = (typeof CouponType)[keyof typeof CouponType];
