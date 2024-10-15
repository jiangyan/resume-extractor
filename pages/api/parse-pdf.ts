import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import PDFParser from 'pdf2json'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = formidable()
  
  try {
    const [fields, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const pdfParser = new PDFParser(null, true);

    pdfParser.loadPDF(file.filepath);

    const text = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      });

      pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
        reject(errData.parserError);
      });
    });

    res.status(200).json({ text })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error processing PDF', details: err instanceof Error ? err.message : String(err) })
  }
}