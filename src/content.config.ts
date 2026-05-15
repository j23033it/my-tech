import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    categorySlug: z.string(),
    tags: z.array(z.string()),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    updated: z.string(),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  articles
};
