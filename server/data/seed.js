const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Product = require('../models/Product');
const User = require('../models/User');

// ─── HELPER ───────────────────────────────────────────────────────────────────
function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const products = [

  // ═══════════════════════════ SKINCARE ═══════════════════════════════════════

  {
    name: 'Rhode Glazing Milk',
    slug: 'rhode-glazing-milk',
    description: 'A nutrient-rich, lightweight essence that boosts barrier function and provides immediate, luminous hydration. Provides all-day hydration, helps reduce redness over time. Hailey\'s essential prep step to calm skin and begin the rhode routine. Size: 124ml / 4.2 fl oz.',
    price: 5569, comparePrice: 6500,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/31var9m3p7L.jpg?v=1773322001',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51snT28BUZL.jpg?v=1773322000'],
    category: 'Skincare', brand: 'Rhode', stock: 25, lowStockThreshold: 6, isFeatured: true,
    tags: ['serum', 'essence', 'hydrating', 'rhode', 'barrier'],
  },
  {
    name: 'Rhode Glazing Mist Hydrating Face Spray 80ml',
    slug: 'rhode-glazing-mist-hydrating-face-spray-80ml',
    description: 'Rhode Glazing Mist delivers instant moisture and a luminous glow to refresh and revitalize your complexion. Lightweight, non-sticky spray absorbs quickly for a dewy finish. Multi-use: use before makeup, after makeup, or anytime for a quick hydration boost.',
    price: 7869, comparePrice: 9000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/31kq7zEVmaL.jpg?v=1775197178',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71_vAWmZmNL.jpg?v=1775197178'],
    category: 'Skincare', brand: 'Rhode', stock: 18, lowStockThreshold: 5, isFeatured: true,
    tags: ['face mist', 'hydrating', 'rhode', 'setting spray'],
  },
  {
    name: 'Anua Niacinamide 10 + TXA 4 Serum - Korean Skincare',
    slug: 'anua-niacinamide-10-txa-4-serum',
    description: 'Dark spot care serum with Hyaluronic Acid, Tranexamic Acid, Lightweight & Hydrating All-in-One Daily Facial Serum for Glass Skin. Korean skincare formula, 1.01 fl.oz.',
    price: 2130, comparePrice: 2500,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150'],
    category: 'Skincare', brand: 'Anua', stock: 40, lowStockThreshold: 10, isFeatured: true,
    tags: ['niacinamide', 'serum', 'dark spot', 'korean skincare', 'glass skin'],
  },
  {
    name: 'TATCHA The Dewy Skin Cream 50ml',
    slug: 'tatcha-the-dewy-skin-cream',
    description: 'Rich Face Cream to Hydrate, Plump and Protect Dry and Combo Skin. TATCHA\'s plumping rich cream delivers immediate and long-lasting hydration for dewy, healthy-looking skin. 50ml / 1.7 oz.',
    price: 5569, comparePrice: 6500,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61acpsB-xTL.jpg?v=1773322528'],
    category: 'Skincare', brand: 'TATCHA', stock: 15, lowStockThreshold: 4, isFeatured: true,
    tags: ['moisturizer', 'dewy', 'hydrating', 'tatcha', 'luxury skincare'],
  },
  {
    name: 'CeraVe 100% Mineral Sunscreen SPF 50 - 2.5 oz',
    slug: 'cerave-mineral-sunscreen-spf-50',
    description: 'Face sunscreen with Zinc Oxide & Titanium Dioxide, Hyaluronic Acid, Niacinamide & Ceramides. Oil Free, Travel Size 2.5 oz. Broad spectrum UVA/UVB protection. Developed with dermatologists. Non-comedogenic, fragrance-free, suitable for sensitive skin.',
    price: 1692, comparePrice: 2000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71QouitPbdL_916e1398-2554-4d5a-98d3-a5556f774ec4.jpg?v=1773357795',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/41uMs8lSJqL_7328bde0-c5d0-4150-8485-bd3597497482.jpg?v=1773357795'],
    category: 'Skincare', brand: 'CeraVe', stock: 55, lowStockThreshold: 15, isFeatured: true,
    tags: ['sunscreen', 'spf', 'mineral', 'cerave', 'sun protection'],
  },
  {
    name: 'La Roche-Posay Anthelios 50 Mineral Tinted Sunscreen 50ml',
    slug: 'la-roche-posay-anthelios-50-mineral-tinted',
    description: 'SPF 50 broad spectrum UVA and UVB protection with universal tint for instant healthy glow. Ultra light texture, fragrance free, paraben free and water resistant (40 minutes). Recommended for sensitive skin. Cell-Ox Shield Technology.',
    price: 3631, comparePrice: 4200,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71rhJ0EUn1L_4f6f8586-4bfc-459d-9adb-9dc39709e54e.jpg?v=1773352447',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/31BBXM-ASGL.jpg?v=1773352447'],
    category: 'Skincare', brand: 'La Roche-Posay', stock: 30, lowStockThreshold: 8, isFeatured: false,
    tags: ['sunscreen', 'tinted', 'spf50', 'mineral', 'la roche posay'],
  },
  {
    name: 'PanOxyl 10% Benzoyl Peroxide Acne Foaming Wash 5.5oz',
    slug: 'panoxyl-10-benzoyl-peroxide-acne-foaming-wash',
    description: 'Maximum Strength daily acne-fighting face and body cleanser. Kills 99% of acne-causing bacteria in 15 seconds. No.1 Best-Selling Acne Wash in the U.S. Non-comedogenic, unscented. Contains 10% Benzoyl Peroxide, the highest concentration OTC.',
    price: 1058, comparePrice: 1400,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/713tzBRSP_L.jpg?v=1773321093',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71op10Vy6iL.jpg?v=1773321093'],
    category: 'Skincare', brand: 'PanOxyl', stock: 60, lowStockThreshold: 15, isFeatured: false,
    tags: ['acne', 'cleanser', 'benzoyl peroxide', 'face wash', 'acne treatment'],
  },
  {
    name: 'Cetaphil Gentle Clear BPO Acne Cleanser 4.2oz',
    slug: 'cetaphil-gentle-clear-bpo-acne-cleanser',
    description: 'Complexion-Clearing BPO Acne Cleanser with 2.6% Benzoyl Peroxide. Creamy and Soothing for Sensitive Skin. Targets acne-causing bacteria while maintaining the skin barrier. Formulated with zinc and licorice root to reduce excess oil.',
    price: 1413, comparePrice: 1800,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71Rcrj1vSdL_3b05a029-6b6e-491f-bbbd-c895b9e0d8fe.jpg?v=1773337428',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/81i77ROQwAL_3bc511e9-d38a-4449-a993-9f7f45499f4b.jpg?v=1773337428'],
    category: 'Skincare', brand: 'Cetaphil', stock: 45, lowStockThreshold: 12, isFeatured: false,
    tags: ['acne', 'cleanser', 'benzoyl peroxide', 'sensitive skin', 'cetaphil'],
  },
  {
    name: 'Dermalogica Biolumin-C Vitamin C Serum 1 fl oz',
    slug: 'dermalogica-biolumin-c-serum',
    description: 'Vitamin C Dark Spot Serum for Face with Peptide and AHA. Exfoliates and Reduces Signs of Skin Aging. Formulated with Lactic Acid, Sophora Japonica Flower Extract, and Chia Seed Oil for radiant, firmer skin.',
    price: 11985, comparePrice: 14000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61acpsB-xTL.jpg?v=1773322528'],
    category: 'Skincare', brand: 'Dermalogica', stock: 12, lowStockThreshold: 3, isFeatured: true,
    tags: ['vitamin c', 'serum', 'dark spot', 'anti-aging', 'dermalogica'],
  },
  {
    name: 'Murad Retinal ReSculpt Eye Lift Treatment 0.5 fl oz',
    slug: 'murad-retinal-resculpt-eye-lift-treatment',
    description: 'Age-Defying Eye Cream with Encapsulated Retinal for 2.5x more efficacy. Tightens droopy lids & Under-Eye Bags. Enhanced with Gentian Root and Oat Sugar extracts for visible lifting and firming of the eye area.',
    price: 11259, comparePrice: 13000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61kaPRUyqCL.jpg?v=1773341907',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71bWPhHv3TL_3d17c6b4-d529-4df5-93c1-2a688b93d4f4.jpg?v=1773341907'],
    category: 'Skincare', brand: 'Murad', stock: 8, lowStockThreshold: 3, isFeatured: false,
    tags: ['eye cream', 'retinal', 'anti-aging', 'murad', 'eye lift'],
  },
  {
    name: 'Kate Somerville DeliKate Recovery Cream 1.7 fl oz',
    slug: 'kate-somerville-delikate-recovery-cream',
    description: 'Clinically Formulated Hydrating Treatment for Irritation and Redness Relief for Stressed or Sensitive Skin. After just 1 week, 96% reported instantly soothed dry, irritated skin. Contains Peptide Complex + Ceramides, Tasmannia Lanceolatea Fruit Extract and Ginger Root.',
    price: 10169, comparePrice: 12000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61VTvT9rR8L_a60d717e-b424-41bf-b436-6cbed554a320.jpg?v=1773336395',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/81wf9vjvA0L_b5d2da00-b326-420a-a5bd-4f89b611a176.jpg?v=1773336395'],
    category: 'Skincare', brand: 'Kate Somerville', stock: 10, lowStockThreshold: 3, isFeatured: false,
    tags: ['moisturizer', 'sensitive skin', 'recovery cream', 'redness relief'],
  },
  {
    name: 'CeraVe SA Lotion for Rough & Bumpy Skin 8 oz',
    slug: 'cerave-sa-lotion-rough-bumpy-skin',
    description: 'Body moisturizer with Salicylic Acid, Lactic Acid, Hyaluronic Acid & Niacinamide that gently exfoliates dry, rough and bumpy skin on legs and upper arms. Lightweight, non-greasy. 3 essential ceramides to restore and maintain the skin barrier.',
    price: 1815, comparePrice: 2200,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51aOMH61dyL_7986759b-253e-4ea2-b607-6cc4fa622c0f.jpg?v=1773357662',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51QSqXZB-RL_a0854b38-6975-4591-a8ab-8d88ee91ca7e.jpg?v=1773357662'],
    category: 'Skincare', brand: 'CeraVe', stock: 40, lowStockThreshold: 10, isFeatured: false,
    tags: ['body lotion', 'salicylic acid', 'exfoliating', 'cerave', 'rough skin'],
  },
  {
    name: 'Medicube Zero Pore Blackhead Mud Facial Mask 3.52oz',
    slug: 'medicube-zero-pore-blackhead-mud-facial-mask',
    description: '3-Minute Quick Dry Formula Korean Mud Mask with AHA, BHA, PHA and Pore-Purifying Clay. Skin Cooling & Pore Tightening. Combines AHA, BHA, and PHA with Bentonite, Canadian Colloidal Clay, and Kaolin for deep cleansing. Dermatologist-tested.',
    price: 2288, comparePrice: 2800,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71VqNYrx57L_e5da8c0e-2d4b-4f77-b515-35b12290f9ee.jpg?v=1773327150'],
    category: 'Skincare', brand: 'Medicube', stock: 35, lowStockThreshold: 8, isFeatured: false,
    tags: ['face mask', 'pore', 'blackhead', 'korean skincare', 'clay mask'],
  },
  {
    name: 'TOSOWOONG Arbutin 7% + Tranexamic Acid 4% Cream 50ml',
    slug: 'tosowoong-arbutin-txa-cream',
    description: 'High-concentration cream with 70,000ppm Arbutin, 40,000ppm TXA, Niacinamide, Glutathione for Dark Spots, Freckles, Blemishes and Pigmentation. Korean Skin Care formula. Mild, gentle for all skin types. Dermatologist-tested.',
    price: 3026, comparePrice: 3600,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/614yBRX5-cL_4dafed82-7cb6-4f98-829f-8a8c9130348f.jpg?v=1773392999',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71w9Tj4BjnL_df1d909e-9d62-4c4c-ab83-059fb1184697.jpg?v=1773392999'],
    category: 'Skincare', brand: 'TOSOWOONG', stock: 22, lowStockThreshold: 6, isFeatured: true,
    tags: ['arbutin', 'dark spot', 'brightening', 'korean skincare', 'pigmentation'],
  },
  {
    name: 'The INKEY List Exosome Hydro-Glow Complex Serum',
    slug: 'the-inkey-list-exosome-hydro-glow-complex',
    description: 'Clinically proven to visibly boost glow, smooth and renew skin in just 14 days. Packed with 3-million plant-derived Exosomes in every bottle. Reduces inflammation by 55% and improves skin repair by 63% in 8 hours. Suitable for all skin types.',
    price: 1864, comparePrice: 2300,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61XaE9bRkzL.jpg?v=1776071237',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/81QtDGqJ6BL.jpg?v=1776071236'],
    category: 'Skincare', brand: 'The INKEY List', stock: 28, lowStockThreshold: 7, isFeatured: false,
    tags: ['serum', 'exosome', 'glow', 'hydrating', 'anti-aging'],
  },
  {
    name: 'eos Shea Better Body Lotion Vanilla Cashmere 16oz',
    slug: 'eos-shea-better-body-lotion-vanilla-cashmere',
    description: 'Vanilla Cashmere 24-Hour Moisture Skin Care. Lightweight & Non-Greasy with Natural Shea. Vegan. 7 nourishing oils & butters including natural shea butter and shea oil. Paraben, phthalate, and gluten free. Dermatologist-recommended.',
    price: 2128, comparePrice: 2600,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51lP01--ejL_a8c7d1ba-d153-4e6f-8f82-18a5d2cf604b.jpg?v=1773387147',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/81GD7xWTptL_4351e269-82f4-4d8f-8b28-a1819ffbb677.jpg?v=1773387147'],
    category: 'Skincare', brand: 'eos', stock: 50, lowStockThreshold: 12, isFeatured: false,
    tags: ['body lotion', 'shea butter', 'vanilla', 'hydrating', 'vegan'],
  },
  {
    name: 'UKLASH Eyelash Growth Serum 3ml',
    slug: 'uklash-eyelash-growth-serum',
    description: 'Award-Winning serum trusted by 85,000+ for visibly longer, fuller, and healthier-looking eyelashes. Powered by Pea Peptides, Hexapeptide-8, and Copper Tripeptide-1. Cruelty-free, paraben-free, safe with lash extensions and contact lenses.',
    price: 5205, comparePrice: 6000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/614Rzo9l8VL.jpg?v=1776068855',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71NiS4HF2NL.jpg?v=1776068855'],
    category: 'Skincare', brand: 'UKLASH', stock: 20, lowStockThreshold: 5, isFeatured: true,
    tags: ['eyelash serum', 'lash growth', 'peptide', 'vegan', 'cruelty-free'],
  },
  {
    name: 'Numbuzin No.5 Vitamin Concentrated Serum',
    slug: 'numbuzin-no5-vitamin-concentrated-serum',
    description: 'Dark Spot Care with Glutathione & Vitamin Serum. Korean skincare formula with Tranexamic Acid 4%, Niacinamide 5% for a radiant-looking glow. Brightens and evens skin tone. 1.01 fl oz.',
    price: 2191, comparePrice: 2700,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61z3kMql-2L.jpg?v=1773352907'],
    category: 'Skincare', brand: 'Numbuzin', stock: 25, lowStockThreshold: 7, isFeatured: false,
    tags: ['vitamin c', 'serum', 'dark spot', 'glutathione', 'korean skincare', 'brightening'],
  },
  {
    name: 'Glow Recipe PHA + BHA Toner 150ml',
    slug: 'glow-recipe-pha-bha-toner',
    description: 'Korean Exfoliating Toner for Pores. Gentle Chemical Exfoliant Hydrating Toner with Watermelon, Cactus Water and Glycerin. PHA + BHA formula gently exfoliates while maintaining moisture balance.',
    price: 4352, comparePrice: 5200,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150'],
    category: 'Skincare', brand: 'Glow Recipe', stock: 18, lowStockThreshold: 5, isFeatured: false,
    tags: ['toner', 'exfoliating', 'pha', 'bha', 'pore care', 'korean skincare'],
  },
  {
    name: 'Fenty Skin Full-Size Start\'r Set',
    slug: 'fenty-skin-full-size-starter-set',
    description: 'Includes full-sized Total Cleansr, Fat Water Toner and Hydra Vizor moisturizer. Complete skincare routine from Fenty Beauty by Rihanna. Suitable for all skin types and tones.',
    price: 15738, comparePrice: 18000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61VTvT9rR8L_a60d717e-b424-41bf-b436-6cbed554a320.jpg?v=1773336395'],
    category: 'Skincare', brand: 'Fenty Skin', stock: 10, lowStockThreshold: 3, isFeatured: true,
    tags: ['skincare set', 'fenty', 'cleanser', 'toner', 'moisturizer', 'gift set'],
  },

  // ═══════════════════════════ HAIR CARE ══════════════════════════════════════

  {
    name: 'COLOR WOW Color Security Conditioner for Thick Hair',
    slug: 'color-wow-color-security-conditioner',
    description: 'Rich hydration for thick, coarse, curly hair. Detangles, nourishes + adds shine with Avocado Oil. Color safe and provides heat protection. Sulfate-free formula that maintains color vibrancy while deeply conditioning.',
    price: 2850, comparePrice: 3500,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61sgcHJZEbL_252d9d52-bab1-45c8-b400-5e761e740d68.jpg?v=1773386767'],
    category: 'Skincare', brand: 'COLOR WOW', stock: 30, lowStockThreshold: 8, isFeatured: true,
    tags: ['conditioner', 'hair care', 'color safe', 'avocado oil', 'thick hair'],
  },
  {
    name: 'SKALA Babosa Hair Treatment Cream 1kg (Aloe Vera & Shea Butter)',
    slug: 'skala-babosa-hair-treatment-cream-1kg',
    description: 'Formulated with Babosa (Aloe Vera) to deeply moisturize strands and restore hair\'s water balance. Shea Butter & D-Panthenol blend for softness, elasticity, and healthy shine. Versatile 2-in-1 formula — use as conditioner replacement or leave-in treatment.',
    price: 1297, comparePrice: 1600,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71sgcHJZEbL_252d9d52-bab1-45c8-b400-5e761e740d68.jpg?v=1773386767',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71KRtGKpj9L.jpg?v=1773386767'],
    category: 'Skincare', brand: 'SKALA', stock: 22, lowStockThreshold: 6, isFeatured: false,
    tags: ['hair mask', 'aloe vera', 'shea butter', 'curly hair', 'conditioner'],
  },
  {
    name: 'Sol de Janeiro Cheirosa 59 Hair & Body Fragrance Mist 90ml',
    slug: 'sol-de-janeiro-cheirosa-59-hair-body-mist',
    description: 'Cheirosa 59 Hair & Body Fragrance Mist Travel Size 90ml / 3.0 fl oz. Luxurious fragrance that can be worn on hair and body for a long-lasting, irresistible scent experience.',
    price: 3148, comparePrice: 3800,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61KlSccHHpL.jpg?v=1776405131',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61xsZuBVGwL.jpg?v=1776405131'],
    category: 'Skincare', brand: 'Sol de Janeiro', stock: 35, lowStockThreshold: 9, isFeatured: true,
    tags: ['hair mist', 'body mist', 'fragrance', 'sol de janeiro', 'travel size'],
  },
  {
    name: 'eos Cashmere Body Mist 6 fl oz - Moisturizing Hair & Body Spray',
    slug: 'eos-cashmere-body-mist',
    description: 'Fresh & Cozy Body Spray for Women, Hair Mist with Hyaluronic Acid, Glycerin. Vegan, Cruelty-free. Formulated with hyaluronic acid to lock in moisture, glycerin for smooth hydrated skin. Gentle formula without parabens, phthalates, or synthetic dyes.',
    price: 1571, comparePrice: 1900,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61KlSccHHpL.jpg?v=1776405131',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71lpnPv5B-L.jpg?v=1776405131'],
    category: 'Skincare', brand: 'eos', stock: 42, lowStockThreshold: 10, isFeatured: false,
    tags: ['body mist', 'hair mist', 'hyaluronic acid', 'vegan', 'moisturizing'],
  },
  {
    name: 'BY WISHTREND Vitamin A-mazing Bakuchiol Body Lotion 150g',
    slug: 'by-wishtrend-vitamin-a-mazing-bakuchiol-body-lotion',
    description: 'Korean Body Lotion for skin bumps, chicken skin, hyperpigmentation, dull skin, wrinkles and pore care. Suitable for all skin types. Vitamin A-mazing with Bakuchiol for gentle retinol-like effects.',
    price: 3766, comparePrice: 4500,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51aOMH61dyL_7986759b-253e-4ea2-b607-6cc4fa622c0f.jpg?v=1773357662'],
    category: 'Skincare', brand: 'BY WISHTREND', stock: 20, lowStockThreshold: 5, isFeatured: false,
    tags: ['body lotion', 'bakuchiol', 'vitamin a', 'korean skincare', 'anti-aging'],
  },

  // ═══════════════════════════ MAKEUP ═════════════════════════════════════════

  {
    name: 'Maybelline Lifter Gloss Hydrating Lip Gloss with Hyaluronic Acid',
    slug: 'maybelline-lifter-gloss-hydrating',
    description: 'Hydrating Lip Gloss with Hyaluronic Acid for plumper looking lips. High shine for a plumping effect. Shade: Rust, Warm Neutral. 0.18 Ounce.',
    price: 799, comparePrice: 999,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150'],
    category: 'Lips', brand: 'Maybelline', stock: 75, lowStockThreshold: 20, isFeatured: true,
    tags: ['lip gloss', 'hyaluronic acid', 'plumping', 'maybelline', 'shine'],
  },
  {
    name: 'Maybelline Super Stay Matte Ink Liquid Lipstick - Motivator Red',
    slug: 'maybelline-super-stay-matte-ink-motivator-red',
    description: 'Moodmakers Lipstick Collection. Long Lasting, Transfer Proof Lip Makeup. Shade: Motivator, Red. Up to 16 hours of color that stays put, smudge-proof and transfer-proof.',
    price: 899, comparePrice: 1199,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61VTvT9rR8L_a60d717e-b424-41bf-b436-6cbed554a320.jpg?v=1773336395'],
    category: 'Lips', brand: 'Maybelline', stock: 65, lowStockThreshold: 18, isFeatured: true,
    tags: ['lipstick', 'matte', 'transfer proof', 'long lasting', 'maybelline'],
  },
  {
    name: 'Rhode Peptide Lip Tint - Raspberry Jelly',
    slug: 'rhode-peptide-lip-tint-raspberry-jelly',
    description: 'Sheer Color and Hydrating Finish. 3 fl oz / 10ml. Rhode\'s iconic peptide-infused lip tint delivers sheer, buildable color while providing deep hydration. Shade: Raspberry Jelly.',
    price: 2500, comparePrice: 3000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51cemgw_fpL.jpg?v=1775819316'],
    category: 'Lips', brand: 'Rhode', stock: 40, lowStockThreshold: 10, isFeatured: true,
    tags: ['lip tint', 'peptide', 'hydrating', 'rhode', 'sheer'],
  },
  {
    name: 'Fenty Beauty Fenty Icon Velvet Liquid Lipstick - Fiyaproof',
    slug: 'fenty-beauty-fenty-icon-velvet-liquid-lipstick-fiyaproof',
    description: 'By Rihanna - Fenty Icon Velvet Liquid Lipstick in Fiyaproof. Long-lasting velvet matte formula that delivers bold, high-pigment color without drying out lips. Comfortable, lightweight feel all day.',
    price: 2800, comparePrice: 3400,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150'],
    category: 'Lips', brand: 'Fenty Beauty', stock: 28, lowStockThreshold: 7, isFeatured: true,
    tags: ['liquid lipstick', 'velvet', 'matte', 'fenty beauty', 'bold'],
  },
  {
    name: 'Kiko Milano 3D Hydra Lip Gloss - 21 Brun Rose 6.5ml',
    slug: 'kiko-milano-3d-hydra-lip-gloss',
    description: 'High Shine, Hydrating, Plumping, Non-Sticky, Moisturizing Lip Makeup. Shade 21 Brun Rose. 6.5ml. Advanced 3D formula creates a plumping, high-gloss effect while moisturizing and hydrating lips throughout the day.',
    price: 1500, comparePrice: 1900,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51cemgw_fpL.jpg?v=1775819316'],
    category: 'Lips', brand: 'Kiko Milano', stock: 35, lowStockThreshold: 9, isFeatured: false,
    tags: ['lip gloss', 'hydrating', 'plumping', 'kiko milano', 'shine'],
  },
  {
    name: 'SHEGLAM Lip Dazzler Glitter Kit Long-Lasting Glitter Lip Gloss',
    slug: 'sheglam-lip-dazzler-glitter-kit',
    description: 'Y2K-Debutante Long-Lasting Glitter Lip Gloss. Sexy Super Stay Non-Sticky Shiny Liquid Kit Lipstick. Delivers a sparkling, high-impact glitter effect that stays put all day without stickiness.',
    price: 1200, comparePrice: 1600,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51cemgw_fpL.jpg?v=1775819316'],
    category: 'Lips', brand: 'SHEGLAM', stock: 45, lowStockThreshold: 12, isFeatured: false,
    tags: ['lip gloss', 'glitter', 'sheglam', 'y2k', 'shiny'],
  },
  {
    name: 'Wonderskin Wonder Blading All Day Lip Stain Peel Off Masque',
    slug: 'wonderskin-wonder-blading-lip-stain-peel-off',
    description: 'Long Lasting, Waterproof and Transfer Proof Nude Lip Tint. Matte Finish Peel Off Lip Stain in Whimsical Masque. Innovative peel-off technology delivers a long-lasting, transfer-proof lip stain that lasts all day.',
    price: 1899, comparePrice: 2300,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150'],
    category: 'Lips', brand: 'Wonderskin', stock: 30, lowStockThreshold: 8, isFeatured: false,
    tags: ['lip stain', 'peel off', 'waterproof', 'matte', 'long lasting'],
  },
  {
    name: 'Laura Geller Delectables Earthy Essentials Baked Eyeshadow Palette',
    slug: 'laura-geller-delectables-earthy-essentials-palette',
    description: '14 Pigmented Eyeshadows with Blendable Natural Look. Baked eyeshadow formula delivers intense pigment with a silky, velvety texture for effortless blending. Earthy tones perfect for everyday and evening looks.',
    price: 3200, comparePrice: 4000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61z3kMql-2L.jpg?v=1773352907'],
    category: 'Eyes', brand: 'Laura Geller', stock: 20, lowStockThreshold: 5, isFeatured: true,
    tags: ['eyeshadow palette', 'baked', 'earthy', 'laura geller', 'neutral'],
  },
  {
    name: 'Anastasia Beverly Hills Dewy Set Setting Spray 3.4 oz',
    slug: 'anastasia-beverly-hills-dewy-set-setting-spray',
    description: 'Anastasia Beverly Hills Dewy Set Setting Spray. Locks in makeup while delivering a hydrating, dewy finish. Helps extend the wear of your makeup and keeps skin looking fresh and luminous all day.',
    price: 2200, comparePrice: 2800,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51cemgw_fpL.jpg?v=1775819316'],
    category: 'Face', brand: 'Anastasia Beverly Hills', stock: 25, lowStockThreshold: 7, isFeatured: false,
    tags: ['setting spray', 'dewy', 'anastasia beverly hills', 'makeup setting', 'hydrating'],
  },
  {
    name: 'Charlotte Tilbury Beautiful Skin Foundation - 11 Neutral',
    slug: 'charlotte-tilbury-beautiful-skin-foundation-11-neutral',
    description: 'Medium Coverage Hydrating Foundation. Buildable Liquid Makeup for Instant Glow, Plumping Hydration & Lasting Skincare Benefits. Shade: 11 Neutral. Skincare-infused formula for a healthy-looking, natural finish.',
    price: 4800, comparePrice: 5800,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61acpsB-xTL.jpg?v=1773322528'],
    category: 'Face', brand: 'Charlotte Tilbury', stock: 18, lowStockThreshold: 5, isFeatured: true,
    tags: ['foundation', 'hydrating', 'charlotte tilbury', 'glow', 'medium coverage'],
  },
  {
    name: 'Flower Knows Strawberry Rococo Embossed Blush - G02 Little Cranberry',
    slug: 'flower-knows-strawberry-rococo-blush-little-cranberry',
    description: 'Mauve Berry Rose Matte Powder Blush for Cheeks. Buildable & Blendable Face Makeup. Long-Lasting Cute Make Up for Women & Girls. 0.16 Oz. G02 Little Cranberry shade. Embossed design for flawless, even application.',
    price: 1599, comparePrice: 2000,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71MV5_RNA_L_06de561a-e857-4289-a70c-f2870fee4947.jpg?v=1773327150'],
    category: 'Face', brand: 'Flower Knows', stock: 38, lowStockThreshold: 10, isFeatured: true,
    tags: ['blush', 'powder', 'matte', 'flower knows', 'buildable'],
  },
  {
    name: 'SHEGLAM Lock\'d In Setting Spray - Purple Mattifying',
    slug: 'sheglam-lockd-in-setting-spray-purple',
    description: 'Mattifying Effect Quick-Drying Long Lasting Makeup Locking Spray. Oil-Control Non-Greasy. Sets makeup for over 16 hours. Dries in 15s. Wide angle design for full face coverage. Silky finish, great for oily/combination skin. Leaping Bunny Approved.',
    price: 955, comparePrice: 1300,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/51cemgw_fpL.jpg?v=1775819316',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71QR5ABzKKL.jpg?v=1775819316'],
    category: 'Face', brand: 'SHEGLAM', stock: 55, lowStockThreshold: 14, isFeatured: false,
    tags: ['setting spray', 'matte', 'oil control', 'sheglam', 'long lasting'],
  },
  {
    name: 'Neutrogena Make-Up Remover Cleansing Towelettes 7 Count',
    slug: 'neutrogena-makeup-remover-cleansing-towelettes',
    description: 'Ultra soft cloths gently dissolve all traces of makeup even waterproof mascara. 7 pre-moistened towelettes. 7.4" x 7.2". Gentle, effective makeup removal that won\'t irritate skin.',
    price: 240, comparePrice: 350,
    images: ['https://cdn.shopify.com/s/files/1/0972/2816/1387/files/71uHTI04dKL_665a8b6d-8be1-4fe3-9bb0-0b9cfa011a1b.jpg?v=1773384104',
             'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/61V_9QIbFML_27830a28-c71e-4ab4-9cbd-45c913cdef51.jpg?v=1773384104'],
    category: 'Face', brand: 'Neutrogena', stock: 100, lowStockThreshold: 25, isFeatured: false,
    tags: ['makeup remover', 'cleansing wipes', 'neutrogena', 'waterproof mascara'],
  },
];

// ─── SEED ─────────────────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing products
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing products`);

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products from DistaUSA`);

    // Upsert admin user
    const adminEmail = 'admin@kivara.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin@1234',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@kivara.com / Admin@1234');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Seed complete! Products breakdown:');
    console.log('   📦 Skincare products: 20');
    console.log('   💄 Makeup products: 13');
    console.log('\n🛍️  Brands included: Rhode, CeraVe, La Roche-Posay, TATCHA, Dermalogica, Murad, Medicube, Anua, Maybelline, Fenty Beauty, Charlotte Tilbury, Anastasia Beverly Hills, SHEGLAM, and more!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedDB();
