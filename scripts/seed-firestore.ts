import { db, Timestamp } from "../src/lib/firebase";

const categories = [
  { name: "العناية بالبشرة", slug: "skincare", emoji: "🧴", description: "منتجات مغذية لبشرة نضرة ومتوهجة" },
  { name: "المكياج", slug: "makeup", emoji: "💄", description: "مكياج فاخر بألوان وتغطية مثالية" },
  { name: "العناية بالشعر", slug: "haircare", emoji: "🌿", description: "عناية متكاملة لشعر صحي ولامع" },
  { name: "العطور", slug: "perfumes", emoji: "🌸", description: "عطور فاخرة تدوم طويلاً" },
  { name: "العناية بالجسم", slug: "bodycare", emoji: "🛁", description: "دلال بشرتك بمنتجات جسم فاخرة" },
];

const productsByCategory: Record<
  string,
  {
    name: string;
    price: number;
    compareAtPrice?: number;
    emoji: string;
    gradientFrom: string;
    gradientTo: string;
    stock: number;
    rating: number;
    reviewsCount: number;
    featured?: boolean;
    description: string;
  }[]
> = {
  skincare: [
    { name: "سيروم فيتامين سي المضيء", price: 149, compareAtPrice: 189, emoji: "✨", gradientFrom: "#fde68a", gradientTo: "#fb923c", stock: 42, rating: 4.8, reviewsCount: 214, featured: true, description: "سيروم مركّز بفيتامين سي النقي لتوحيد لون البشرة ومنحها إشراقة طبيعية." },
    { name: "كريم مرطب بحمض الهيالورونيك", price: 129, emoji: "💧", gradientFrom: "#bae6fd", gradientTo: "#60a5fa", stock: 35, rating: 4.7, reviewsCount: 176, featured: true, description: "ترطيب عميق يدوم 24 ساعة مع حمض الهيالورونيك متعدد الوزن الجزيئي." },
    { name: "غسول الوجه بخلاصة الشاي الأخضر", price: 69, emoji: "🍃", gradientFrom: "#bbf7d0", gradientTo: "#4ade80", stock: 60, rating: 4.5, reviewsCount: 98, description: "ينظف البشرة بعمق دون تجريدها من رطوبتها الطبيعية." },
    { name: "ماسك الطين المغربي المنقي", price: 89, emoji: "🪨", gradientFrom: "#e7e5e4", gradientTo: "#a8a29e", stock: 24, rating: 4.6, reviewsCount: 63, description: "يمتص الزيوت الزائدة ويشد المسام لبشرة نقية وصافية." },
    { name: "كريم العين المضاد لعلامات التعب", price: 99, emoji: "👁️", gradientFrom: "#ddd6fe", gradientTo: "#a78bfa", stock: 18, rating: 4.4, reviewsCount: 51, description: "يقلل الانتفاخ والهالات الداكنة حول العين بتركيبة لطيفة." },
    { name: "واقي الشمس SPF 50 خفيف", price: 79, emoji: "☀️", gradientFrom: "#fef08a", gradientTo: "#fbbf24", stock: 55, rating: 4.9, reviewsCount: 302, featured: true, description: "حماية عالية من الأشعة فوق البنفسجية بملمس خفيف غير دهني." },
  ],
  makeup: [
    { name: "كريم أساس طويل الثبات", price: 139, emoji: "🎨", gradientFrom: "#fbcfe8", gradientTo: "#f472b6", stock: 30, rating: 4.6, reviewsCount: 187, featured: true, description: "تغطية متوسطة إلى كاملة بثبات يدوم حتى 16 ساعة." },
    { name: "أحمر شفاه مطفي فاخر", price: 79, emoji: "💋", gradientFrom: "#fecaca", gradientTo: "#ef4444", stock: 48, rating: 4.7, reviewsCount: 245, featured: true, description: "قوام كريمي ناعم بتغطية لونية غنية وثبات طويل." },
    { name: "باليت ظلال العيون الذهبية", price: 159, compareAtPrice: 199, emoji: "🌟", gradientFrom: "#fde68a", gradientTo: "#d97706", stock: 20, rating: 4.8, reviewsCount: 134, description: "12 لون فاخر بين المطفي واللامع لإطلالة ساحرة." },
    { name: "ماسكارا تكثيف وتطويل", price: 65, emoji: "🖤", gradientFrom: "#e2e8f0", gradientTo: "#475569", stock: 70, rating: 4.5, reviewsCount: 289, description: "تمنح رموشك كثافة وطولاً ملحوظين دون تكتل." },
    { name: "بلاشر كريمي وردي طبيعي", price: 69, emoji: "🌷", gradientFrom: "#fecdd3", gradientTo: "#fb7185", stock: 33, rating: 4.4, reviewsCount: 77, description: "يمنح الخدود إشراقة صحية وطبيعية بمزج سهل." },
    { name: "برايمر مثالي لنعومة البشرة", price: 89, emoji: "🪞", gradientFrom: "#e9d5ff", gradientTo: "#c084fc", stock: 26, rating: 4.3, reviewsCount: 58, description: "ينعّم المسام ويهيئ البشرة لثبات مكياج مثالي." },
  ],
  haircare: [
    { name: "زيت الأرغان المغذي للشعر", price: 95, emoji: "🌰", gradientFrom: "#fde68a", gradientTo: "#b45309", stock: 40, rating: 4.7, reviewsCount: 156, featured: true, description: "يغذي الشعر الجاف والتالف ويمنحه لمعاناً حريرياً." },
    { name: "شامبو خالٍ من الكبريتات", price: 59, emoji: "🧴", gradientFrom: "#bfdbfe", gradientTo: "#3b82f6", stock: 65, rating: 4.5, reviewsCount: 201, description: "تنظيف لطيف يحافظ على لون الشعر المصبوغ." },
    { name: "بلسم إصلاح الأطراف المتقصفة", price: 55, emoji: "💆‍♀️", gradientFrom: "#fbcfe8", gradientTo: "#db2777", stock: 38, rating: 4.4, reviewsCount: 88, description: "يعالج الأطراف المتقصفة ويمنع تكسر الشعر." },
    { name: "ماسك بروتين لتقوية الشعر", price: 119, emoji: "🥚", gradientFrom: "#fef3c7", gradientTo: "#f59e0b", stock: 22, rating: 4.6, reviewsCount: 64, description: "يقوي بصيلات الشعر ويقلل التساقط مع الاستخدام المنتظم." },
    { name: "سيروم لامع مضاد للتجعد", price: 75, emoji: "✨", gradientFrom: "#e0e7ff", gradientTo: "#6366f1", stock: 29, rating: 4.5, reviewsCount: 47, description: "يروض التجعد ويمنح الشعر لمعاناً استثنائياً فور الاستخدام." },
  ],
  perfumes: [
    { name: "عطر ورد دمشقي فاخر", price: 249, compareAtPrice: 299, emoji: "🌹", gradientFrom: "#fecdd3", gradientTo: "#e11d48", stock: 15, rating: 4.9, reviewsCount: 178, featured: true, description: "مزيج فاخر من الورد الدمشقي والمسك يدوم طوال اليوم." },
    { name: "عطر الياسمين الأبيض", price: 219, emoji: "🤍", gradientFrom: "#f5f5f4", gradientTo: "#d6d3d1", stock: 19, rating: 4.6, reviewsCount: 92, description: "رائحة نقية ومنعشة من زهر الياسمين الأبيض." },
    { name: "عطر العود الملكي", price: 349, emoji: "👑", gradientFrom: "#d6d3d1", gradientTo: "#57534e", stock: 12, rating: 4.8, reviewsCount: 143, featured: true, description: "عبق العود الفاخر ممزوج بلمسات شرقية دافئة." },
    { name: "عطر الفانيليا والمسك", price: 189, emoji: "🍦", gradientFrom: "#fef3c7", gradientTo: "#f59e0b", stock: 26, rating: 4.5, reviewsCount: 71, description: "رائحة دافئة وحلوة تدوم لساعات طويلة." },
  ],
  bodycare: [
    { name: "لوشن الجسم بزبدة الشيا", price: 79, emoji: "🧈", gradientFrom: "#fef9c3", gradientTo: "#eab308", stock: 44, rating: 4.6, reviewsCount: 132, description: "ترطيب فائق للبشرة الجافة بزبدة الشيا الطبيعية." },
    { name: "سكراب السكر والعسل", price: 69, emoji: "🍯", gradientFrom: "#fde68a", gradientTo: "#d97706", stock: 31, rating: 4.7, reviewsCount: 84, featured: true, description: "يقشر البشرة بلطف ويتركها ناعمة كالحرير." },
    { name: "زيت الاستحمام الفاخر", price: 99, emoji: "🛀", gradientFrom: "#bae6fd", gradientTo: "#0ea5e9", stock: 27, rating: 4.5, reviewsCount: 59, description: "يحول الاستحمام اليومي إلى تجربة سبا فاخرة." },
    { name: "كريم اليدين المغذي", price: 39, emoji: "🤲", gradientFrom: "#fbcfe8", gradientTo: "#ec4899", stock: 58, rating: 4.4, reviewsCount: 121, description: "يرطب اليدين الجافتين بامتصاص سريع دون دهنية." },
  ],
};

const customersData = [
  { name: "زهراء الكناني", phone: "7701234567", city: "بغداد", lat: 33.3152, lng: 44.3661 },
  { name: "نور الطائي", phone: "7709876543", city: "البصرة", lat: 30.5085, lng: 47.7835 },
  { name: "ريم العبيدي", phone: "7711122334", city: "أربيل", lat: 36.1911, lng: 44.0092 },
  { name: "مها الجبوري", phone: "7813344556", city: "النجف", lat: 32.0286, lng: 44.3436 },
  { name: "لمى الحسيني", phone: "7714455667", city: "كربلاء", lat: 32.6160, lng: 44.0249 },
  { name: "هند السعدي", phone: "7517788990", city: "الموصل", lat: 36.3489, lng: 43.1189 },
  { name: "دانة المالكي", phone: "7712233445", city: "بغداد", lat: 33.3406, lng: 44.4009 },
  { name: "غلا الربيعي", phone: "7898877665", city: "السليمانية", lat: 35.5647, lng: 45.4164 },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPastDate(daysBack: number) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysBack));
  d.setHours(randomInt(8, 22), randomInt(0, 59));
  return d;
}

async function deleteCollection(name: string) {
  const snap = await db.collection(name).get();
  const batchSize = 400;
  for (let i = 0; i < snap.docs.length; i += batchSize) {
    const batch = db.batch();
    snap.docs.slice(i, i + batchSize).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

async function main() {
  console.log("🌱 بدء زراعة البيانات في Firestore...");

  console.log("حذف البيانات القديمة (إن وجدت)...");
  await deleteCollection("orders");
  await deleteCollection("customers");
  await deleteCollection("products");
  await deleteCollection("categories");

  const categoryIds: Record<string, string> = {};
  for (const cat of categories) {
    const ref = await db.collection("categories").add({
      ...cat,
      createdAt: Timestamp.now(),
    });
    categoryIds[cat.slug] = ref.id;
  }
  console.log(`✅ ${categories.length} فئات`);

  const createdProducts: { id: string; name: string; price: number; emoji: string; gradientFrom: string; gradientTo: string }[] = [];
  for (const [slug, products] of Object.entries(productsByCategory)) {
    for (const p of products) {
      const baseSlug = p.name
        .replace(/[^؀-ۿa-zA-Z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      const now = Timestamp.now();
      const ref = await db.collection("products").add({
        ...p,
        slug: `${baseSlug}-${randomInt(1000, 9999)}`,
        categoryId: categoryIds[slug],
        createdAt: now,
        updatedAt: now,
      });
      createdProducts.push({
        id: ref.id,
        name: p.name,
        price: p.price,
        emoji: p.emoji,
        gradientFrom: p.gradientFrom,
        gradientTo: p.gradientTo,
      });
    }
  }
  console.log(`✅ ${createdProducts.length} منتج`);

  const customerIds: string[] = [];
  for (const { name, phone, city, lat, lng } of customersData) {
    await db
      .collection("customers")
      .doc(phone)
      .set({
        name,
        phone,
        address: `${city} - حي النموذجي - شارع ${randomInt(1, 40)} - بناية ${randomInt(1, 20)}`,
        lat,
        lng,
        createdAt: Timestamp.now(),
      });
    customerIds.push(phone);
  }
  console.log(`✅ ${customerIds.length} عميلة`);

  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "DELIVERED", "DELIVERED", "CANCELLED"];
  let orderCounter = 1001;

  for (let i = 0; i < 60; i++) {
    const customerId = customerIds[randomInt(0, customerIds.length - 1)];
    const itemsCount = randomInt(1, 4);
    const chosenIdx = new Set<number>();
    while (chosenIdx.size < itemsCount) {
      chosenIdx.add(randomInt(0, createdProducts.length - 1));
    }

    let total = 0;
    const items = [...chosenIdx].map((idx) => {
      const product = createdProducts[idx];
      const quantity = randomInt(1, 3);
      total += product.price * quantity;
      return {
        productId: product.id,
        name: product.name,
        emoji: product.emoji,
        gradientFrom: product.gradientFrom,
        gradientTo: product.gradientTo,
        price: product.price,
        quantity,
      };
    });

    const createdAt = randomPastDate(90);
    await db.collection("orders").add({
      orderNumber: `ORD-${orderCounter++}`,
      customerId,
      status: statuses[randomInt(0, statuses.length - 1)],
      total: Math.round(total * 100) / 100,
      items,
      createdAt: Timestamp.fromDate(createdAt),
      updatedAt: Timestamp.fromDate(createdAt),
    });
  }
  console.log("✅ 60 طلب");

  console.log("🎉 تمت زراعة البيانات بنجاح في Firestore");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
