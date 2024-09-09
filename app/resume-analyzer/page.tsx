'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"; // 确保你已经安装了 lucide-react
import * as XLSX from 'xlsx'; // Changed this line

interface CandidateInfo {
  name: string;
  selfAssessment: string;
  companies: { name: string; duration: string; }[];
  graduateSchools: { name: string; duration: string; }[];
}

export default function ResumeAnalyzer() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/')
    }
  }, [status, router])

  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<CandidateInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>("openai:gpt-4o-mini-2024-07-18")
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files))
    }
  }

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(results.map((result, index) => ({
      '序号': index + 1,
      '姓名': result.name,
      '自我评价': result.selfAssessment,
      '公司经历': result.companies.map(exp => `${exp.name} (${exp.duration})`).join('; '),
      '毕业学校': result.graduateSchools.map(school => `${school.name} (${school.duration})`).join('; ')
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "简历关键数据"); // 更改sheet名称

    // 使用原生 JavaScript 生成时间戳
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');
  
    const fileName = `简历关键信息-${timestamp}.xlsx`;

    // 导出 Excel 文件
    XLSX.writeFile(wb, fileName);
  };

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
    setIsLoading(true);
    setResults([]);
    setCurrentFileIndex(0);
    try {
      for (let i = 0; i < files.length; i++) {
        setCurrentFile(files[i].name);
        setCurrentFileIndex(i + 1);
        const fileContent = await readFileAsText(files[i]);
        
        const response = await fetch('/api/analyze-resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileContents: [fileContent], model: selectedModel }),
        });
        const candidates = await response.json();
        
        if (candidates) {
          setResults(prev => [...prev, ...candidates]);
        }
      }
    } catch (error) {
      console.error("Error analyzing resumes:", error);
    } finally {
      setIsLoading(false);
      setCurrentFile(null);
      setCurrentFileIndex(0);
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null // This will prevent any flash of content before redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">简历关键信息自动提取</h2>
          
          <Select onValueChange={handleModelChange} defaultValue={selectedModel}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai:gpt-4o-mini-2024-07-18">OpenAI: gpt-4o-mini-2024-07-18</SelectItem>
              <SelectItem value="openai:gpt-4o-2024-08-06">OpenAI: gpt-4o-2024-08-06</SelectItem>
              <SelectItem value="google:gemini-1.5-flash-exp-0827">Google: gemini-1.5-flash-exp-0827</SelectItem>
              <SelectItem value="google:gemini-1.5-pro-exp-0827">Google: gemini-1.5-pro-exp-0827</SelectItem>
              <SelectItem value="claude:claude-3-haiku-20240307">Claude: claude-3-haiku-20240307</SelectItem>
              <SelectItem value="claude:claude-3-5-sonnet-20240620">Claude: claude-3-5-sonnet-20240620</SelectItem>
              <SelectItem value="deepseek:deepseek-chat">DeepSeek: deepseek-chat</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input 
              type="file" 
              accept=".pdf,.txt" 
              multiple 
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 h-12 py-1.5" // 修改这里
            />
            <p className="text-sm text-gray-500 mt-2">{files.length} file(s) selected</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : '提取关键信息'}
            </Button>

            {results.length > 0 && (
              <Button 
                onClick={handleExport} 
                className="bg-[#0056b3] hover:bg-[#0069d9] text-white flex items-center transition-colors duration-200"
              >
                <Download className="mr-2" />
                导出
              </Button>
            )}

            {currentFile && (
              <p className="text-sm text-gray-600">
                第 {currentFileIndex} 份简历 (共 {files.length} 份简历)，{currentFile} 正在处理中...
              </p>
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
                      {result.companies.map((exp, i) => (
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
      </main>
    </div>
  )
}