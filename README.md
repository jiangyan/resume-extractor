# Resume Extractor

An AI-powered resume analysis tool that extracts and structures key information from PDF resumes. Built with Next.js and powered by multiple AI models including OpenAI GPT, Google Gemini, Anthropic Claude, and DeepSeek.

## 🌟 Features

- **Multi-Provider AI Analysis**: Choose from multiple AI models for resume extraction
  - OpenAI: gpt-4o-mini-2024-07-18, gpt-4o-2024-08-06
  - Google: gemini-1.5-flash-exp-0827, gemini-1.5-pro-exp-0827
  - Anthropic Claude: claude-3-haiku-20240307, claude-3-5-sonnet-20240620
  - DeepSeek: deepseek-chat

- **Smart Information Extraction**: Automatically identifies and extracts:
  - Personal information (Name, contact details)
  - Professional self-assessment
  - Work experience and company history
  - Educational background
  - Skills and certifications

- **PDF Processing**: Robust PDF parsing using pdf2json to handle various resume formats

- **Internationalization**: Built-in support for multiple languages (English and Chinese)

- **Modern UI**: Responsive interface built with:
  - shadcn/ui components
  - Tailwind CSS
  - Dark mode support
  - Framer Motion animations

- **Batch Processing**: Upload and analyze multiple resumes simultaneously

- **Export Capability**: Export analysis results to structured formats (XLSX support)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Pages Router hybrid)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui, Radix UI
- **Authentication**: NextAuth.js with Google OAuth
- **AI SDKs**:
  - OpenAI SDK
  - Google Generative AI SDK
  - Anthropic SDK
  - Axios (for DeepSeek API)
- **PDF Processing**: pdf2json
- **Analytics**: Vercel Analytics
- **Data Export**: xlsx
- **Form Handling**: Formidable
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ or later
- npm, yarn, pnpm, or bun package manager
- API keys for at least one AI provider:
  - OpenAI API key (from [OpenAI Platform](https://platform.openai.com))
  - Google AI API key (from [Google AI Studio](https://makersuite.google.com/app/apikey))
  - Anthropic API key (from [Anthropic Console](https://console.anthropic.com))
  - DeepSeek API key (from [DeepSeek Platform](https://platform.deepseek.com))
- Google OAuth credentials (for authentication)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jiangyan/resume-extractor.git
   cd resume-extractor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # AI Provider API Keys (add at least one)
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here

   # Google OAuth (for authentication)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

   **To generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

1. **Upload Resumes**: Drag and drop or select PDF resume files
2. **Select AI Model**: Choose your preferred AI model from the dropdown
3. **Analyze**: Click the analyze button to extract information
4. **Review Results**: View structured data extracted from each resume
5. **Export**: Download results in XLSX format for further processing

Note: The UI is primarily in Chinese, but supports internationalization for English as well.

## 🏗️ Project Structure

```
resume-extractor/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Internationalized routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── resume-analyzer/
│   ├── providers.tsx
│   └── client-providers.tsx
├── pages/                        # Next.js Pages Router
│   ├── api/
│   │   ├── analyze-resumes.ts    # Resume analysis endpoint
│   │   ├── parse-pdf.ts          # PDF parsing endpoint
│   │   └── auth/
│   └── _app.js
├── components/                   # React components
│   ├── landing-page.tsx
│   ├── loading-text-animation.tsx
│   └── ui/                       # shadcn/ui components
├── utils/                        # Utility functions
│   ├── analyzeResumes.ts         # Main analysis logic
│   └── aiProviders/              # AI provider integrations
│       ├── openAIProvider.ts
│       ├── googleAIProvider.ts
│       ├── anthropicProvider.ts
│       ├── deepseekProvider.ts
│       └── models.ts
├── lib/                          # Library code
├── i18n-config.ts                # i18n configuration
├── middleware.ts                 # Next.js middleware
└── public/                       # Static assets
```

## 🌐 API Endpoints

### POST `/api/parse-pdf`
Parses PDF files and extracts text content.

**Request**: Multipart form data with PDF file
**Response**: `{ text: string }`

### POST `/api/analyze-resumes`
Analyzes resume text using selected AI model.

**Request**:
```json
{
  "fileContents": ["resume text 1", "resume text 2"],
  "model": "openai:gpt-4o-mini-2024-07-18"
}
```

**Response**: Array of structured resume data

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy this Next.js application is using the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy!

For more details, check the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

### Environment Variables for Production

Make sure to add all required environment variables in your Vercel project settings:
- AI provider API keys
- Google OAuth credentials
- NextAuth configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is 99% AI-generated code. Feel free to use it however you want!

## 🙏 Acknowledgments

- **AI Providers**:
  - [OpenAI](https://openai.com) for GPT models and Structured Output capabilities
  - [Google](https://ai.google.dev) for Gemini AI models
  - [Anthropic](https://anthropic.com) for Claude AI models
  - [DeepSeek](https://deepseek.com) for their AI capabilities

- **Tools & Frameworks**:
  - [Next.js](https://nextjs.org) for the React framework
  - [Vercel](https://vercel.com) for hosting and analytics
  - [v0.dev](https://v0.dev/) for UI design and component generation
  - [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
  - [Cursor AI](https://cursor.sh/) for AI-assisted development

- **Libraries**:
  - [pdf2json](https://github.com/modesty/pdf2json) for PDF parsing
  - [NextAuth.js](https://next-auth.js.org/) for authentication
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

For questions or issues, please open an issue on the [GitHub repository](https://github.com/jiangyan/resume-extractor/issues).

---

Built with ❤️ using AI-powered development tools
