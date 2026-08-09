import { getCategories } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          إضافة منتج جديد
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          املئي بيانات المنتج ليظهر في المتجر فوراً
        </p>
      </div>

      <ProductForm
        action={createProduct}
        categories={categories}
        submitLabel="إضافة المنتج"
      />
    </div>
  );
}
