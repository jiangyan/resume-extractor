import { z } from "zod";
import { analyzeResumesWithOpenAI } from "./aiProviders/openAIProvider";
import { analyzeResumesWithGemini } from "./aiProviders/googleAIProvider";
import { analyzeResumesWithClaude } from "./aiProviders/anthropicProvider";
import { analyzeResumesWithDeepSeek } from "./aiProviders/deepseekProvider";

export const CandidateInfo = z.object({
  name: z.string(),
  selfAssessment: z.string(),
  companies: z.array(z.object({
    name: z.string(),
    duration: z.string()
  })),
  graduateSchools: z.array(z.object({
    name: z.string(),
    duration: z.string()
  })),
});

export type CandidateInfoType = z.infer<typeof CandidateInfo>;

export async function analyzeResumes(fileContents: string[], model: string): Promise<CandidateInfoType[]> {
  const [provider, modelName] = model.split(':');

  switch (provider) {
    case 'openai':
      return analyzeResumesWithOpenAI(fileContents, modelName);
    case 'google':
      return analyzeResumesWithGemini(fileContents, modelName);
    case 'claude':
      return analyzeResumesWithClaude(fileContents, modelName);
    case 'deepseek':
      return analyzeResumesWithDeepSeek(fileContents, modelName);
    default:
      console.error("Unsupported model provider");
      return [];
  }
}