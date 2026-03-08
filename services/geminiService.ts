
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export async function scanCMAForFraud(cmaName: string): Promise<ScanResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Conduct a Forensic OSINT Scan for CMA: ${cmaName}. 
  Timeframe: Past 90 days.
  Audit Requirements: 
  1. Working for Workers Act 2026 (Salary Transparency & AI Disclosure).
  2. NOC Wage Anomaly cross-referencing.
  3. Municipal Registry & Zoning consistency.
  4. ACCURATE NEW ENTITY ASSESSMENT: Use Google Search to cross-reference the business names with the Provincial Business Registries in Ontario (OBR), British Columbia (BC Registry), Alberta, and Quebec. 
  5. IDENTIFY REGISTRATION DATES: Specifically flag companies registered between 2024 and 2026 as 'isNewBusiness'. 
  6. METRICS: Estimate the total job postings in this CMA over the last 90 days (totalMarketVolume) and provide the count of postings reviewed in this audit (reviewedPostingsCount).
  
  Strictly adhere to Responsible Communication standards (Avoid accusatory terminology).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cmaName: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalMarketVolume: { type: Type.INTEGER },
            reviewedPostingsCount: { type: Type.INTEGER },
            flaggedPostings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  address: { type: Type.STRING },
                  salary: { type: Type.STRING },
                  postedDaysAgo: { type: Type.NUMBER },
                  isVerified: { type: Type.BOOLEAN },
                  isNewBusiness: { type: Type.BOOLEAN },
                  aiDisclosureStatus: { type: Type.STRING },
                  salaryTransparencyStatus: { type: Type.STRING },
                  riskScore: { type: Type.NUMBER },
                  riskLevel: { type: Type.STRING },
                  indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
                  physicalAuditInstructions: { type: Type.STRING },
                  cafcBlock: { type: Type.STRING },
                  forensicAnalysis: { type: Type.STRING }
                },
                required: ["title", "company", "address", "riskScore", "riskLevel", "indicators", "aiDisclosureStatus", "salaryTransparencyStatus", "isNewBusiness"]
              }
            }
          },
          required: ["cmaName", "summary", "totalMarketVolume", "reviewedPostingsCount", "flaggedPostings"]
        }
      }
    });

    const data = JSON.parse(response.text.trim()) as ScanResult;
    return {
      ...data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Forensic Scan failed:", error);
    throw error;
  }
}
