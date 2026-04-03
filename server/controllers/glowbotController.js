const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.consult = async (req, res) => {
  try {
    const { imageBase64, mimeType, skinType, concerns, allergies, goals } = req.body;

    // Fetch live product inventory
    const products = await Product.find({ stock: { $gt: 0 } })
      .select('name category description brand price')
      .lean();

    const inventoryJson = JSON.stringify(
      products.map(p => ({
        id: p._id,
        name: p.name,
        brand: p.brand || 'Lumière',
        category: p.category,
        description: (p.description || '').slice(0, 120),
        price: p.price,
      }))
    );

    const systemPrompt = `You are "Krystal", an expert, empathetic Virtual Beauty & Skincare Consultant for Kivara Beauty.

You will receive: a photo of the user's face, their skin details, and our in-stock product inventory.

STRICT RULES:
- INVENTORY ONLY: Recommend ONLY products from the provided inventory list. Never invent products.
- NO MEDICAL ADVICE: You are a cosmetic consultant, not a dermatologist. For serious skin conditions suggest a dermatologist.
- EXPLAIN WHY: Briefly explain why each product suits their skin.
- MAKEUP MATCHING: Use the photo to suggest the right shade for foundation/concealer/lip color from catalog.

FORMAT:
You MUST respond with a valid JSON object EXCLUSIVELY. Do not return markdown outside of the JSON. Do not return code blocks like "\`\`\`json". Just the raw JSON string matching this exact schema:
{
  "markdownAnalysis": "Start with a warm 2-sentence intro... Then use ## ✨ Your Personalized Skincare Routine and ## 💄 Makeup Suggestions. Use bullet points: - **Product Name** — reason why. End with a short encouraging closing.",
  "recommendedProductIds": ["id1", "id2"] // Array of exact 'id' strings from the inventory list for every product you recommended.
}

KIVARA BEAUTY IN-STOCK INVENTORY:
${inventoryJson}`;

    const userContext = `Skin Type: ${skinType || 'Not specified'}
Concerns: ${concerns || 'Not specified'}
Allergies/Avoid: ${allergies || 'None'}
Goals: ${goals || 'Not specified'}

Please analyze my photo and recommend a personalized routine using only your inventory. Return ONLY the requested JSON format.`;

    const model = genAI.getGenerativeModel(
      { model: 'gemini-2.5-flash', generationConfig: { responseMimeType: 'application/json' } },
      { apiVersion: 'v1beta' }
    );

    const parts = [{ text: systemPrompt }, { text: userContext }];

    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: { mimeType, data: imageBase64 },
      });
    }

    const result = await model.generateContent(parts);
    let text = result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error('JSON Parse Error:', text);
      throw new Error('GlowBot returned invalid format.');
    }

    // Fetch the full product objects for the recommended IDs
    const recommendedProducts = await Product.find({
      _id: { $in: parsed.recommendedProductIds || [] }
    }).lean();

    res.json({ 
      success: true, 
      recommendation: parsed.markdownAnalysis,
      recommendedProducts 
    });
  } catch (err) {
    console.error('GlowBot error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: err?.message || 'GlowBot consultation failed.',
    });
  }
};
