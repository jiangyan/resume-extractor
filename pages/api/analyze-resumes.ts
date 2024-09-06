import { analyzeResumes } from '../../utils/analyzeResumes';
   
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { fileContents, model } = req.body;
    try {
      const results = await analyzeResumes(fileContents, model);
      res.status(200).json(results);
    } catch (error) {
      console.error('Error analyzing resumes:', error);
      res.status(500).json({ error: 'Error analyzing resumes' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}