import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from '@google/generative-ai';
import { Anthropic } from '@anthropic-ai/sdk';

const CandidateInfo = z.object({
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
    default:
      console.error("Unsupported model provider");
      return [];
  }
}

async function analyzeResumesWithOpenAI(fileContents: string[], model: string): Promise<CandidateInfoType[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key is not set");
    return [];
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const candidateDetails: CandidateInfoType[] = [];

  try {
    const systemPrompt = "You are an expert at structured data extraction. \
              You will be given unstructured text from a candidate resume (in Chinese) and should convert them into the given structure, \
              and you only extract the company info, please do not extract the project experience info.";
    
    for (const content of fileContents) {
      console.log("content length", content.length);
      const completion = await openai.beta.chat.completions.parse({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: content },
        ],
        response_format: zodResponseFormat(CandidateInfo, "candidate"),
      });
      
      const candidate = completion.choices[0].message.parsed;
      if (candidate) {
        candidateDetails.push(candidate);
      }
    }

    return candidateDetails;

  } catch (error) {
    console.error("Error in analyzeResumesWithOpenAI:", error);
    return [];
  }
}

async function analyzeResumesWithGemini(fileContents: string[], modelName: string): Promise<CandidateInfoType[]> {
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

async function analyzeResumesWithClaude(fileContents: string[], model: string): Promise<CandidateInfoType[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Anthropic API key is not set");
    return [];
  }

  const client = new Anthropic({
    apiKey: apiKey,
  });

  const candidateDetails: CandidateInfoType[] = [];

  const tools = [
    {
      name: "extract_candidate_resume_info",
      description: "Extract resume information about a candidate.",
      input_schema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of the candidate" },
          selfAssessment: { type: "string", description: "Self-assessment of the candidate" },
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name of the company" },
                duration: { type: "string", description: "Duration of the company" }
              },
              required: ["name", "duration"]
            },
            description: "Array of companies of the candidate"
          },
          graduateSchools: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name of the graduate school" },
                duration: { type: "string", description: "Duration of the study" }
              },
              required: ["name", "duration"]
            },
            description: "Array of graduate schools"
          }
        },
        required: ["name", "selfAssessment", "companies", "graduateSchools"]
      }
    }
  ];

  try {
    for (const content of fileContents) {
      const query = `
        <resume>
        ${content}
        </resume>

        Use the \`extract_candidate_resume_info\` tool to extract the candidate's resume information in Chinese.
      `;

      const response = await client.messages.create({
        model: model, // This now uses the specific Claude model passed as an argument
        max_tokens: 4096,
        tools: tools as any,
        messages: [{ role: "user", content: query }]
      });

      let jsonSummary = null;
      for (const item of response.content) {
        if (item.type === "tool_use" && item.name === "extract_candidate_resume_info") {
          jsonSummary = item.input;
          break;
        }
      }

      if (jsonSummary) {
        candidateDetails.push(jsonSummary as CandidateInfoType);
      } else {
        console.warn("No candidate summary found in the response.");
      }
    }

    return candidateDetails;
  } catch (error) {
    console.error("Error in analyzeResumesWithClaude:", error);
    return [];
  }
}