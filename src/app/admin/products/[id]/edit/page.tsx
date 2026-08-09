import { notFound } from "next/navigation";
import { getCategories, getProductById } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink-900">
          تعديل المنتج
        </h1>
        <p className="mt-1 text-sm text-ink-500">{product.name}</p>
      </div>

      <ProductForm
        action={boundUpdate}
        categories={categories}
        defaults={product}
        submitLabel="حفظ التعديلات"
      />
    </div>
  );
}
