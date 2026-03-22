import { getCategories } from "@/server/categories";
import { PageHeader } from "@/components/layout/page-header";
import { CategoriesClient } from "@/components/inventory/categories-client";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage inventory categories"
      />
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
