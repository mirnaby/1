import Link from "next/link";
import { getStoreSettings } from "@/lib/data";

export async function Footer() {
  const settings = await getStoreSettings();
  const whatsappDigits = settings.whatsappNumber.replace(/\D/g, "");
  const whatsappLink = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null;

  return (
    <footer className="mt-24 border-t border-brand-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-lg text-white">
              ✿
            </span>
            <span className="font-heading text-xl font-bold text-brand-800">
              لمسة
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-500">
            متجرك الفاخر لمستحضرات التجميل والعناية بالبشرة والعطور. جمال طبيعي
            يبدأ بلمسة واحدة.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold text-ink-900">تسوقي</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link className="hover:text-brand-600" href="/products?category=skincare">العناية بالبشرة</Link></li>
            <li><Link className="hover:text-brand-600" href="/products?category=makeup">المكياج</Link></li>
            <li><Link className="hover:text-brand-600" href="/products?category=haircare">العناية بالشعر</Link></li>
            <li><Link className="hover:text-brand-600" href="/products?category=perfumes">العطور</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold text-ink-900">خدمة العملاء</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>سياسة الاستبدال والاسترجاع</li>
            <li>الشحن والتوصيل</li>
            <li>تواصلي معنا</li>
            <li>الأسئلة الشائعة</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-bold text-ink-900">تواصلي معنا</h4>
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              💬 تواصلي عبر واتساب
            </a>
          ) : (
            <p className="mt-3 text-xs text-ink-400">
              لم يتم إضافة رقم واتساب بعد
            </p>
          )}
          {settings.phoneNumber && (
            <p className="mt-2 text-sm text-ink-500" dir="ltr">
              {settings.phoneNumber}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-brand-100 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} لمسة. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
