import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import pdfParse from 'pdf-parse'

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

    const buffer = fs.readFileSync(file.filepath)
    const data = await pdfParse(buffer)
    res.status(200).json({ text: data.text })
  } catch (err) {
    return res.status(500).json({ error: 'Error parsing form data' })
  }
}