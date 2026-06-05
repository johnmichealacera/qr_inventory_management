import { getCategories } from "@/server/categories";
import { auth } from "@/lib/auth";
import { canManageInventory } from "@/lib/roles";
import { PageHeader } from "@/components/layout/page-header";
import { CategoriesClient } from "@/components/inventory/categories-client";

export default async function CategoriesPage() {
  const session = await auth();
  const canManage = canManageInventory(session?.user?.role);
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description={
          canManage
            ? "Manage inventory categories"
            : "View inventory categories (read-only)"
        }
      />
      <CategoriesClient
        initialCategories={categories}
        canManage={canManage}
        isAdmin={session?.user?.role === "Admin"}
      />
    </div>
  );
}
