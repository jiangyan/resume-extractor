# Resume Extractor

Resume Extractor is an AI-powered tool that helps users extract key information from resume PDFs. It leverages multiple AI models, including OpenAI's GPT and Google's Gemini, to automatically identify and extract essential details with high accuracy.

## Features

- AI-powered extraction of key information from resume PDFs
- Support for multiple AI models:
  - OpenAI: gpt-4o-mini-2024-07-18
  - OpenAI: gpt-4o-2024-08-06
  - Google: gemini-1.5-flash
  - Google: gemini-1.5-pro
- Identifies and extracts:
  - Name
  - Self-assessment
  - Company experience
  - Educational background
- Converts unstructured resume data into structured, easily analyzable format
- Modern, responsive UI designed with v0.dev

## Key Technology

- **Multi-Model AI-Driven Extraction**: Employs advanced AI models from OpenAI and Google to understand and parse complex resume formats
- **OpenAI GPT Models**: Utilizes the latest GPT models for precise information extraction
- **Google Gemini Models**: Leverages Gemini's capabilities for structured output and efficient processing
- **PDF Processing**: Handles various PDF formats and layouts
- **v0.dev**: Used for designing the entire UI, generating shadcn-compatible components
- **shadcn UI**: Utilized for rapid development of a sleek, modern interface
- **Cursor AI**: Employed to complete additional features and enhance functionality

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prerequisites

- Node.js
- Next.js
- OpenAI API access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/jiangyan/resume-extractor.git
   ```
2. Navigate to the project directory:
   ```
   cd resume-extractor
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up your OpenAI API credentials (add instructions on how to do this securely)

## Usage

It's pretty straight forward, UI is in Chinese though

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

It's 99% AI generated codes, I only input English, then tab, tab, tab, ta-da, use whatever you want

## Acknowledgments

- OpenAI for providing the AI models and Structured Output capabilities
- [v0.dev](https://v0.dev/) for UI design and component generation
- [shadcn UI](https://ui.shadcn.com/) for the component library
- Cursor AI for assisting with feature completion
