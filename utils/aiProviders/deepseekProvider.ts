import OpenAI from "openai";
import { CandidateInfoType } from "../analyzeResumes";

export async function analyzeResumesWithDeepSeek(fileContents: string[], model: string): Promise<CandidateInfoType[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("DeepSeek API key is not set");
    return [];
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });

  const candidateDetails: CandidateInfoType[] = [];

  const systemPrompt = `
      The user has provided a resume in Chinese. Extract the following information from the resume:
      EXAMPLE INPUT: \`sample resume\`
      EXAMPLE JSON OUTPUT:
      {
          "name": "John Doe",
          "selfAssessment": "Highly motivated software engineer with 5 years of experience in full-stack development.",
          "companies": [
              {
                  "name": "TechCorp",
                  "duration": "2018-2021"
              },
              {
                  "name": "Innovate Solutions",
                  "duration": "2021-Present"
              }
          ],
          "graduateSchools": [
              {
                  "name": "MIT",
                  "duration": "2014-2018"
              },
              {
                  "name": "Stanford University",
                  "duration": "2018-2020"
              }
          ]
      }
        `;

  try {
    for (const content of fileContents) {
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `You are an expert at structured data extraction, 
            extract information from the following unstructured resume text in Chinese: ${content}` }
        ],
        response_format: { type: "json_object" },
      });

      const candidateInfo = JSON.parse(response.choices[0].message.content || "{}");
      candidateDetails.push(candidateInfo);
    }

    return candidateDetails;
  } catch (error) {
    console.error("Error in analyzeResumesWithDeepSeek:", error);
    return [];
  }
}