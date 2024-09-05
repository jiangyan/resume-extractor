import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


const CandidateInfo = z.object({
  name: z.string(),
  selfAssessment: z.string(),
  companyExperiences: z.array(z.object({
    name: z.string(),
    duration: z.string()
  })),
  graduateSchools: z.array(z.object({
    name: z.string(),
    duration: z.string()
  })),
});

export async function analyzeResumes(fileContents: string[]): Promise<z.infer<typeof CandidateInfo>[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key is not set");
    return [];
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const candidateDetails: z.infer<typeof CandidateInfo>[] = [];

  try {
    const systemPrompt = "You are an expert at structured data extraction. \
              You will be given unstructured text from a candidate resume (in Chinese) and should convert them into the given structure, \
              and you only extract the company info, please do not extract the project experience info.";
    
    for (const content of fileContents) {
      console.log("content length", content.length);
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
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
    console.error("Error in analyzeResumes:", error);
    return [];
  }
}