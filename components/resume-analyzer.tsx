'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { analyzeResumes } from "@/utils/analyzeResumes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CandidateInfo {
  name: string;
  selfAssessment: string;
  companyExperiences: { name: string; duration: string; }[];
  graduateSchools: { name: string; duration: string; }[];
}

export function ResumeAnalyzer() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<CandidateInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>("openai:gpt-4o-mini-2024-07-18")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files))
    }
  }

  const readFileAsText = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Failed to parse PDF')
      }
      const data = await response.json()
      return data.text
    } else {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => resolve(event.target?.result as string)
        reader.onerror = (error) => reject(error)
        reader.readAsText(file)
      })
    }
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
  }

  const handleAnalyze = async () => {
    setIsLoading(true)
    setResults([]) // Clear existing results
    try {
      for (let i = 0; i < files.length; i++) {
        setCurrentFile(files[i].name)
        const fileContent = await readFileAsText(files[i])
        
        const candidates = await analyzeResumes([fileContent], selectedModel)
        if (candidates) {
          setResults(prev => [...prev, ...candidates])
        }
      }
    } catch (error) {
      console.error("Error analyzing resumes:", error)
    } finally {
      setIsLoading(false)
      setCurrentFile(null)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">简历关键信息自动提取</h1>
      
      <Select onValueChange={handleModelChange} defaultValue={selectedModel}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="选择模型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="openai:gpt-4o-mini-2024-07-18">OpenAI: gpt-4o-mini-2024-07-18</SelectItem>
          <SelectItem value="openai:gpt-4o-2024-08-06">OpenAI: gpt-4o-2024-08-06</SelectItem>
          <SelectItem value="google:gemini-1.5-flash-exp-0827">Google: gemini-1.5-flash-exp-0827</SelectItem>
          <SelectItem value="google:gemini-1.5-pro-exp-0827">Google: gemini-1.5-pro-exp-0827</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-2">
        <Input 
          type="file" 
          accept=".pdf,.txt" 
          multiple 
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <p className="text-sm text-gray-500">{files.length} file(s) selected</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          onClick={handleAnalyze} 
          disabled={files.length === 0 || isLoading}
        >
          {isLoading ? '处理中...' : '提取关键信息'}
        </Button>
        {currentFile && (
          <p className="text-sm text-gray-600">{currentFile} 正在处理中...</p>
        )}
      </div>
      
      {results.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">序号</TableHead>
              <TableHead className="w-[100px]">姓名</TableHead>
              <TableHead className="w-[400px]">自我评价</TableHead>
              <TableHead>公司经历</TableHead>
              <TableHead>毕业学校</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell className="w-[200px]">
                  <div className="whitespace-normal break-words">
                    {result.selfAssessment}
                  </div>
                </TableCell>
                <TableCell>
                  {result.companyExperiences.map((exp, i) => (
                    <div key={i}>{exp.name} ({exp.duration})</div>
                  ))}
                </TableCell>
                <TableCell>
                  {result.graduateSchools.map((school, i) => (
                    <div key={i}>{school.name} ({school.duration})</div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}