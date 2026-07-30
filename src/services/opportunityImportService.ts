
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { slugify } from "@/utils/slug";
import { mapCategory } from "@/utils/categoryMapper";
import { parseInvestment } from "@/utils/investmentParser";

export async function importOpportunities(rows: any[]) {
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  const errors: string[] = [];

  for (const row of rows) {
    try {
      const title = String(
        row["Opportunity Headline"] || ""
      ).trim();

      if (!title) {
        failed++;
        continue;
      }

      const slug = slugify(title);

      // Duplicate Check

      const duplicateQuery = query(
        collection(db, "opportunities"),
        where("slug", "==", slug)
      );

      const duplicateSnap = await getDocs(duplicateQuery);

      if (!duplicateSnap.empty) {
        skipped++;
        continue;
      }

      const investment = parseInvestment(
        row["Value"] || ""
      );

      const category = mapCategory(
        row["Category / Industry"] || ""
      );

      const location =
        String(row["Location"] || "").trim();

      const city =
        location.split(",")[0]?.trim() || "";

      const state =
        location.split(",")[1]?.trim() || "";

      await addDoc(
        collection(db, "opportunities"),
        {
          title,

          slug,

          description:
            row["Opportunity Description"] || "",

          shortDescription:
            String(
              row["Opportunity Description"] || ""
            ).substring(0, 160),

          category: category.id,

          categoryId: category.id,

          industry: category.name,

          businessType:
            String(
              row["Opportunity Type"] || ""
            ).toLowerCase(),

          city,

          state,

          location,

          investmentMin:
            investment.min,

          investmentMax:
            investment.max,

          investmentRange:
            investment.range,

          contactEmail:
            row["Email ID"] || "",

          contactPhone:
            row["Contact Number"] || "",

          contactPreference: "phone",

          postedBy: "admin",

          postedByName:
            row["Presented By"] ||
            "Admin",

          postedByImage: "",

          bookmarkCount: 0,

          interestedCount: 0,

          viewCount: 0,

          status: "published",

          isUrgent: false,

          isFeatured:
            investment.max >=
            1000000000,

          requirements:
            row["Any Terms"] || "",

          remarks:
            row["Other Remark"] || "",

          documents: [],

          images: [],

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      imported++;
    } catch (err: any) {
      failed++;

      errors.push(err.message);
    }
  }

  return {
    imported,
    skipped,
    failed,
    errors,
  };
}