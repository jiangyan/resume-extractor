import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { PDFExtract } from 'pdf.js-extract'

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

    const pdfExtract = new PDFExtract()
    const options = {} // You can add options here if needed

    const data = await pdfExtract.extract(file.filepath, options)
    
    // Extract text from all pages
    const text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n')

    res.status(200).json({ text })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error processing PDF' })
  }
}