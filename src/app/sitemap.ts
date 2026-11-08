import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllProducts, getDepartments } from "@/lib/catalog";
import { departmentPath, productPath } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.priceCutoff.iso);
  const url = (path: string) => `${site.url}${path}`;
  return [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: url("/productos"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...getDepartments().map((d) => ({
      url: url(departmentPath(d.slug)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Solo productos con precio publicado (los demás van con noindex)
    ...getAllProducts()
      .filter((p) => p.price !== null)
      .map((p) => ({
        url: url(productPath(p)),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
