import { z } from "zod";
export const AMENITIES = [
  "wifi",
  "kitchen",
  "washer",
  "workspace",
  "balcony",
  "heating",
  "elevator",
] as const;
export const availabilitySchema = z.object({
  availableFrom: z
    .string()
    .refine(
      (s) =>
        s === "" ||
        (/^\d{4}-\d{2}-\d{2}$/.test(s) &&
          !Number.isNaN(Date.parse(s)) &&
          new Date(s).toISOString().slice(0, 10) === s),
      "Choose a valid date",
    )
    .optional(),
  minStayMonths: z.number().int().min(1).max(36).optional(),
  furnished: z.boolean().optional(),
  amenities: z.array(z.enum(AMENITIES)).max(7).optional(),
});
export const listingEditSchema = z.object({
  titleEn: z.string().trim().min(5).max(120),
  titleTr: z.string().trim().min(5).max(120),
  descriptionEn: z.string().trim().min(20).max(4000),
  descriptionTr: z.string().trim().min(20).max(4000),
  rentKurus: z.number().int().positive().max(100000000000),
  depositKurus: z.number().int().min(0).max(100000000000),
  billsStatus: z.enum(["INCLUDED", "EXCLUDED", "PARTIAL"]),
  contractAvailable: z.boolean(),
  depositReturnPolicy: z.string().trim().min(10).max(1000),
  ...availabilitySchema.shape,
});
export type ListingEditValues = z.infer<typeof listingEditSchema>;
