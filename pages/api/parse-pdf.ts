import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import { PDFExtract, PDFExtractOptions } from 'pdf.js-extract'

export const config = {
  api: {
    bodyParser: false,
  },
}

// In-memory worker setup
const workerScript = `
  self.onmessage = function (event) {
    const { action, data } = event.data;
    if (action === 'getDocument') {
      postMessage({ action: 'workerLoaded' });
    }
  };
`;

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

    // Set up in-memory worker
    if (typeof window === 'undefined' && !global.pdfjsWorker) {
      const { Worker } = require('worker_threads');
      const worker = new Worker(
        `
        const { parentPort } = require('worker_threads');
        ${workerScript}
        `,
        { eval: true }
      );
      global.pdfjsWorker = { worker };
    }

    const pdfExtract = new PDFExtract()
    const options: PDFExtractOptions = {}

    const data = await pdfExtract.extract(file.filepath, options)
    
    // Extract text from all pages
    const text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n')

    res.status(200).json({ text })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error processing PDF', details: err instanceof Error ? err.message : String(err) })
  }
}