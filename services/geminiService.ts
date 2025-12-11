import { GoogleGenAI, GenerativeModel } from "@google/genai";
import { Driver } from "../types";

// Initialize the API client
// Note: In a real production app, ensure the API Key is proxy-ed or handled securely.
const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToAssistant = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are the AI Logistics Assistant for Twin Reid Logistics. 
      Your tone is professional, urban, and high-end. 
      You assist with fleet management, load calculations, accountability checks, and driver support.
      Always emphasize efficiency, safety, and profitability.
      Twin Reid branding colors are Deep Red and Black.
      
      Key Responsibilities:
      - Calculating Cost Per Mile (CPM).
      - Reminding drivers about scale tickets and BOLs.
      - Offering route suggestions.
      - Motivational accountability for drivers.
      `,
    }) as GenerativeModel;

    // Correctly format history for the chat session
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the Twin Reid command center. Please try again.";
  }
};

export const generateCoachingPlan = async (driver: Driver): Promise<string> => {
  if (!ai) {
    return "AI service unavailable. Please check API key configuration.";
  }

  try {
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an expert Trucking Performance Coach for Twin Reid Logistics.
      Your goal is to analyze driver statistics and provide a short, punchy, high-impact coaching plan.
      Focus on specific improvements for MPG, Safety, and On-Time performance.
      Tone: Direct, encouraging, professional, and "urban luxury" style.
      Output format: 
      1. Strength
      2. Weakness
      3. Action Plan (Bullet points)
      `,
    }) as GenerativeModel;

    const prompt = `Analyze this driver:
    Name: ${driver.name}
    Truck: ${driver.truckType}
    MPG: ${driver.performance.averageMpg}
    Safety Violations: ${driver.performance.safetyViolations}
    On-Time Rate: ${driver.performance.onTimeDeliveryRate}%
    Schedule Adherence: ${driver.performance.scheduleAdherence}%
    
    Provide a specific coaching plan.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Coaching Error:", error);
    return "Unable to generate coaching plan at this time.";
  }
};
