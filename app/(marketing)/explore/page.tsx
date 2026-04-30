import { createClient } from "@/lib/supabase/server";
import ExploreClient from "./ExploreClient";
import { notFound } from "next/navigation";

export default async function ExplorePage() {
  let bundlesWithCount;
  const supabase = await createClient();
  try {
    const { data: bundles, error: bundleError } = await supabase
      .from("bundles")
      .select(
        `id,name,description,price,is_free, bundle_questions ( exam_session_id )`,
      );
    if (bundleError) throw new Error("boundle fetch error");

    bundlesWithCount = bundles.map((bundle) => ({
      id: bundle.id,
      price: bundle.price,
      isFree: bundle.is_free,
      name: bundle.name,
      description: bundle.description,
      sessionCount: bundle.bundle_questions?.length || 0,
    }));

    console.log("bundles with count: ", bundlesWithCount);
  } catch (error) {
    notFound();
  }

  return <ExploreClient bundles={bundlesWithCount} />;
}
