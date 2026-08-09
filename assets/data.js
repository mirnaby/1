// بيانات ميرنا بيوتي - فئات ومنتجات (نسخة ثابتة بدون قاعدة بيانات)

const CATEGORIES = [
  { slug: "skincare", name: "العناية بالبشرة", emoji: "🧴", description: "منتجات مغذية لبشرة نضرة ومتوهجة" },
  { slug: "makeup", name: "المكياج", emoji: "💄", description: "مكياج فاخر بألوان وتغطية مثالية" },
  { slug: "haircare", name: "العناية بالشعر", emoji: "🌿", description: "عناية متكاملة لشعر صحي ولامع" },
  { slug: "perfumes", name: "العطور", emoji: "🌸", description: "عطور فاخرة تدوم طويلاً" },
  { slug: "bodycare", name: "العناية بالجسم", emoji: "🛁", description: "دلال بشرتك بمنتجات جسم فاخرة" },
];

const PRODUCTS = [
  { id: "p1", slug: "سيروم-فيتامين-سي-المضيء", name: "سيروم فيتامين سي المضيء", price: 149, compareAtPrice: 189, emoji: "✨", gradientFrom: "#fde68a", gradientTo: "#fb923c", stock: 42, rating: 4.8, reviewsCount: 214, featured: true, categorySlug: "skincare", description: "سيروم مركّز بفيتامين سي النقي لتوحيد لون البشرة ومنحها إشراقة طبيعية." },
  { id: "p2", slug: "كريم-مرطب-بحمض-الهيالورونيك", name: "كريم مرطب بحمض الهيالورونيك", price: 129, emoji: "💧", gradientFrom: "#bae6fd", gradientTo: "#60a5fa", stock: 35, rating: 4.7, reviewsCount: 176, featured: true, categorySlug: "skincare", description: "ترطيب عميق يدوم 24 ساعة مع حمض الهيالورونيك متعدد الوزن الجزيئي." },
  { id: "p3", slug: "غسول-الوجه-بخلاصة-الشاي-الأخضر", name: "غسول الوجه بخلاصة الشاي الأخضر", price: 69, emoji: "🍃", gradientFrom: "#bbf7d0", gradientTo: "#4ade80", stock: 60, rating: 4.5, reviewsCount: 98, categorySlug: "skincare", description: "ينظف البشرة بعمق دون تجريدها من رطوبتها الطبيعية." },
  { id: "p4", slug: "ماسك-الطين-المغربي-المنقي", name: "ماسك الطين المغربي المنقي", price: 89, emoji: "🪨", gradientFrom: "#e7e5e4", gradientTo: "#a8a29e", stock: 24, rating: 4.6, reviewsCount: 63, categorySlug: "skincare", description: "يمتص الزيوت الزائدة ويشد المسام لبشرة نقية وصافية." },
  { id: "p5", slug: "كريم-العين-المضاد-لعلامات-التعب", name: "كريم العين المضاد لعلامات التعب", price: 99, emoji: "👁️", gradientFrom: "#ddd6fe", gradientTo: "#a78bfa", stock: 18, rating: 4.4, reviewsCount: 51, categorySlug: "skincare", description: "يقلل الانتفاخ والهالات الداكنة حول العين بتركيبة لطيفة." },
  { id: "p6", slug: "واقي-الشمس-SPF-50-خفيف", name: "واقي الشمس SPF 50 خفيف", price: 79, emoji: "☀️", gradientFrom: "#fef08a", gradientTo: "#fbbf24", stock: 55, rating: 4.9, reviewsCount: 302, featured: true, categorySlug: "skincare", description: "حماية عالية من الأشعة فوق البنفسجية بملمس خفيف غير دهني." },

  { id: "p7", slug: "كريم-أساس-طويل-الثبات", name: "كريم أساس طويل الثبات", price: 139, emoji: "🎨", gradientFrom: "#fbcfe8", gradientTo: "#f472b6", stock: 30, rating: 4.6, reviewsCount: 187, featured: true, categorySlug: "makeup", description: "تغطية متوسطة إلى كاملة بثبات يدوم حتى 16 ساعة." },
  { id: "p8", slug: "أحمر-شفاه-مطفي-فاخر", name: "أحمر شفاه مطفي فاخر", price: 79, emoji: "💋", gradientFrom: "#fecaca", gradientTo: "#ef4444", stock: 48, rating: 4.7, reviewsCount: 245, featured: true, categorySlug: "makeup", description: "قوام كريمي ناعم بتغطية لونية غنية وثبات طويل." },
  { id: "p9", slug: "باليت-ظلال-العيون-الذهبية", name: "باليت ظلال العيون الذهبية", price: 159, compareAtPrice: 199, emoji: "🌟", gradientFrom: "#fde68a", gradientTo: "#d97706", stock: 20, rating: 4.8, reviewsCount: 134, categorySlug: "makeup", description: "12 لون فاخر بين المطفي واللامع لإطلالة ساحرة." },
  { id: "p10", slug: "ماسكارا-تكثيف-وتطويل", name: "ماسكارا تكثيف وتطويل", price: 65, emoji: "🖤", gradientFrom: "#e2e8f0", gradientTo: "#475569", stock: 70, rating: 4.5, reviewsCount: 289, categorySlug: "makeup", description: "تمنح رموشك كثافة وطولاً ملحوظين دون تكتل." },
  { id: "p11", slug: "بلاشر-كريمي-وردي-طبيعي", name: "بلاشر كريمي وردي طبيعي", price: 69, emoji: "🌷", gradientFrom: "#fecdd3", gradientTo: "#fb7185", stock: 33, rating: 4.4, reviewsCount: 77, categorySlug: "makeup", description: "يمنح الخدود إشراقة صحية وطبيعية بمزج سهل." },
  { id: "p12", slug: "برايمر-مثالي-لنعومة-البشرة", name: "برايمر مثالي لنعومة البشرة", price: 89, emoji: "🪞", gradientFrom: "#e9d5ff", gradientTo: "#c084fc", stock: 26, rating: 4.3, reviewsCount: 58, categorySlug: "makeup", description: "ينعّم المسام ويهيئ البشرة لثبات مكياج مثالي." },

  { id: "p13", slug: "زيت-الأرغان-المغذي-للشعر", name: "زيت الأرغان المغذي للشعر", price: 95, emoji: "🌰", gradientFrom: "#fde68a", gradientTo: "#b45309", stock: 40, rating: 4.7, reviewsCount: 156, featured: true, categorySlug: "haircare", description: "يغذي الشعر الجاف والتالف ويمنحه لمعاناً حريرياً." },
  { id: "p14", slug: "شامبو-خالٍ-من-الكبريتات", name: "شامبو خالٍ من الكبريتات", price: 59, emoji: "🧴", gradientFrom: "#bfdbfe", gradientTo: "#3b82f6", stock: 65, rating: 4.5, reviewsCount: 201, categorySlug: "haircare", description: "تنظيف لطيف يحافظ على لون الشعر المصبوغ." },
  { id: "p15", slug: "بلسم-إصلاح-الأطراف-المتقصفة", name: "بلسم إصلاح الأطراف المتقصفة", price: 55, emoji: "💆‍♀️", gradientFrom: "#fbcfe8", gradientTo: "#db2777", stock: 38, rating: 4.4, reviewsCount: 88, categorySlug: "haircare", description: "يعالج الأطراف المتقصفة ويمنع تكسر الشعر." },
  { id: "p16", slug: "ماسك-بروتين-لتقوية-الشعر", name: "ماسك بروتين لتقوية الشعر", price: 119, emoji: "🥚", gradientFrom: "#fef3c7", gradientTo: "#f59e0b", stock: 22, rating: 4.6, reviewsCount: 64, categorySlug: "haircare", description: "يقوي بصيلات الشعر ويقلل التساقط مع الاستخدام المنتظم." },
  { id: "p17", slug: "سيروم-لامع-مضاد-للتجعد", name: "سيروم لامع مضاد للتجعد", price: 75, emoji: "✨", gradientFrom: "#e0e7ff", gradientTo: "#6366f1", stock: 29, rating: 4.5, reviewsCount: 47, categorySlug: "haircare", description: "يروض التجعد ويمنح الشعر لمعاناً استثنائياً فور الاستخدام." },

  { id: "p18", slug: "عطر-ورد-دمشقي-فاخر", name: "عطر ورد دمشقي فاخر", price: 249, compareAtPrice: 299, emoji: "🌹", gradientFrom: "#fecdd3", gradientTo: "#e11d48", stock: 15, rating: 4.9, reviewsCount: 178, featured: true, categorySlug: "perfumes", description: "مزيج فاخر من الورد الدمشقي والمسك يدوم طوال اليوم." },
  { id: "p19", slug: "عطر-الياسمين-الأبيض", name: "عطر الياسمين الأبيض", price: 219, emoji: "🤍", gradientFrom: "#f5f5f4", gradientTo: "#d6d3d1", stock: 19, rating: 4.6, reviewsCount: 92, categorySlug: "perfumes", description: "رائحة نقية ومنعشة من زهر الياسمين الأبيض." },
  { id: "p20", slug: "عطر-العود-الملكي", name: "عطر العود الملكي", price: 349, emoji: "👑", gradientFrom: "#d6d3d1", gradientTo: "#57534e", stock: 12, rating: 4.8, reviewsCount: 143, featured: true, categorySlug: "perfumes", description: "عبق العود الفاخر ممزوج بلمسات شرقية دافئة." },
  { id: "p21", slug: "عطر-الفانيليا-والمسك", name: "عطر الفانيليا والمسك", price: 189, emoji: "🍦", gradientFrom: "#fef3c7", gradientTo: "#f59e0b", stock: 26, rating: 4.5, reviewsCount: 71, categorySlug: "perfumes", description: "رائحة دافئة وحلوة تدوم لساعات طويلة." },

  { id: "p22", slug: "لوشن-الجسم-بزبدة-الشيا", name: "لوشن الجسم بزبدة الشيا", price: 79, emoji: "🧈", gradientFrom: "#fef9c3", gradientTo: "#eab308", stock: 44, rating: 4.6, reviewsCount: 132, categorySlug: "bodycare", description: "ترطيب فائق للبشرة الجافة بزبدة الشيا الطبيعية." },
  { id: "p23", slug: "سكراب-السكر-والعسل", name: "سكراب السكر والعسل", price: 69, emoji: "🍯", gradientFrom: "#fde68a", gradientTo: "#d97706", stock: 31, rating: 4.7, reviewsCount: 84, featured: true, categorySlug: "bodycare", description: "يقشر البشرة بلطف ويتركها ناعمة كالحرير." },
  { id: "p24", slug: "زيت-الاستحمام-الفاخر", name: "زيت الاستحمام الفاخر", price: 99, emoji: "🛀", gradientFrom: "#bae6fd", gradientTo: "#0ea5e9", stock: 27, rating: 4.5, reviewsCount: 59, categorySlug: "bodycare", description: "يحول الاستحمام اليومي إلى تجربة سبا فاخرة." },
  { id: "p25", slug: "كريم-اليدين-المغذي", name: "كريم اليدين المغذي", price: 39, emoji: "🤲", gradientFrom: "#fbcfe8", gradientTo: "#ec4899", stock: 58, rating: 4.4, reviewsCount: 121, categorySlug: "bodycare", description: "يرطب اليدين الجافتين بامتصاص سريع دون دهنية." },
];

function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

function categoryProductCount(slug) {
  return PRODUCTS.filter((p) => p.categorySlug === slug).length;
}

function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

function getRelatedProducts(product, take) {
  return PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, take || 4);
}
