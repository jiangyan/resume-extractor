import { Anthropic } from '@anthropic-ai/sdk';
import { CandidateInfoType } from "../analyzeResumes";

export async function analyzeResumesWithClaude(fileContents: string[], model: string): Promise<CandidateInfoType[]> {
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
        model: model,
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