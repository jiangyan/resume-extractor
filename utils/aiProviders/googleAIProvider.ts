import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from '@google/generative-ai';
import { CandidateInfoType } from "../analyzeResumes";

export async function analyzeResumesWithGemini(fileContents: string[], modelName: string): Promise<CandidateInfoType[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Google API key is not set");
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          selfAssessment: { type: SchemaType.STRING },
          companies: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                duration: { type: SchemaType.STRING }
              }
            }
          },
          graduateSchools: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                duration: { type: SchemaType.STRING }
              }
            }
          }
        }
      }
    }
  });

  const candidateDetails: CandidateInfoType[] = [];

  try {
    const systemPrompt = "You are an expert at structured data extraction. \
              Extract the following information from the given resume (in Chinese): \
              name, self-assessment, companies (excluding project details), and graduate schools.";

    for (const content of fileContents) {
      const prompt = `${systemPrompt}\n\nResume content:\n${content}`;
      const result = await model.generateContent(prompt);
      const candidateInfo = JSON.parse(result.response.text());
      candidateDetails.push(candidateInfo);
    }

    return candidateDetails;
  } catch (error) {
    console.error("Error in analyzeResumesWithGemini:", error);
    return [];
  }
}