import asyncHandler from "express-async-handler";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are "ServiceAI", a friendly and helpful customer support assistant for "Local Service Hub" — a platform that connects users with trusted local service professionals like plumbers, electricians, cleaners, painters, and more.

Key platform features you should know about:
- Users can browse services, book appointments, and pay online (Razorpay) or cash
- Providers register, list services, and manage bookings from their dashboard
- Admins approve providers and manage the platform
- Users can cancel bookings, leave reviews, and track service status

Keep your answers short (2-3 sentences), friendly, and directly helpful. Use simple language.`;

/**
 * Models to try in order — each has different quota limits.
 * If one model is rate-limited, the next one is attempted.
 */
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash", 
  "gemini-1.5-flash",
];

/**
 * Local fallback responses — used ONLY when ALL API models fail.
 */
const LOCAL_RESPONSES = {
  booking: "To book a service, go to the Services page, pick what you need, choose a date & time, and hit confirm. Your provider gets notified instantly!",
  cancel: "You can cancel any pending or confirmed booking from your Dashboard — just click 'Terminate Session' on the booking card.",
  payment: "We support both Cash and Online (Razorpay) payments. Once your service is done, pick your preferred method from the booking card.",
  provider: "Want to join as a provider? Register with the 'Provider' role. After admin approval, you can start listing your services.",
  refund: "Online payment refunds take 5-7 business days. For cash payment issues, reach out through this chat or our support email.",
  contact: "You can reach us right here in this chat, or email support@localservicehub.com. We typically respond within a few hours!",
  password: "To reset your password, click 'Forgot Password' on the login page. We'll send a reset link to your registered email.",
  review: "After your service is completed and paid, visit the service details page and click 'Feedback Loop' to leave a review.",
  default: "I'm here to help with bookings, payments, provider info, and account questions. What would you like to know?"
};

const getLocalResponse = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes("book") || lower.includes("schedule") || lower.includes("appointment")) return LOCAL_RESPONSES.booking;
  if (lower.includes("cancel")) return LOCAL_RESPONSES.cancel;
  if (lower.includes("pay") || lower.includes("price") || lower.includes("cost") || lower.includes("razorpay")) return LOCAL_RESPONSES.payment;
  if (lower.includes("provider") || lower.includes("expert") || lower.includes("join") || lower.includes("register as")) return LOCAL_RESPONSES.provider;
  if (lower.includes("refund") || lower.includes("money back")) return LOCAL_RESPONSES.refund;
  if (lower.includes("contact") || lower.includes("support") || lower.includes("email")) return LOCAL_RESPONSES.contact;
  if (lower.includes("password") || lower.includes("forgot") || lower.includes("reset")) return LOCAL_RESPONSES.password;
  if (lower.includes("review") || lower.includes("feedback") || lower.includes("rating")) return LOCAL_RESPONSES.review;
  return LOCAL_RESPONSES.default;
};

/**
 * Try generating content with a specific model.
 * Returns the text or throws on failure.
 */
const tryModel = async (ai, modelName, userMessage) => {
  console.log(`[AI Node] Attempting model: ${modelName}`);
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}`,
  });

  const text = response.text;
  if (!text || text.trim().length === 0) {
    throw new Error(`Empty response from ${modelName}`);
  }

  console.log(`[AI Node] ✅ Success with ${modelName}`);
  return { text, model: modelName };
};

/**
 * @desc    Get AI Chat completion — cascades through available models
 * @route   POST /api/ai/chat
 * @access  Public
 */
const getAIChatResponse = asyncHandler(async (req, res) => {
  const userMessage = req.body.text || req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (apiKey) {
    const ai = new GoogleGenAI({ apiKey });

    // Try each model in sequence until one works
    for (const modelName of MODELS) {
      try {
        const { text, model } = await tryModel(ai, modelName, userMessage);
        return res.json({
          response: text,
          generatedText: text,
          source: model,
        });
      } catch (err) {
        console.warn(`[AI Node] ❌ ${modelName} failed: ${err.message}`);
        // Continue to next model
      }
    }
  }

  // All models failed — serve local fallback
  console.log("[AI Node] All API models exhausted. Serving local fallback.");
  const fallbackText = getLocalResponse(userMessage);

  return res.json({
    response: fallbackText,
    generatedText: fallbackText,
    source: "local-fallback",
  });
});

export { getAIChatResponse };