'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as XLSX from 'xlsx'
import { aiModels } from '@/utils/aiProviders/models'
import { LoadingTextAnimationComponent } from "@/components/loading-text-animation"

const translations = {
  en: {
    title: "Resume Key Information Auto-Extraction",
    selectModel: "Select Model",
    filesSelected: "file(s) selected",
    extractKeyInfo: "Extract Key Information",
    processing: "Processing...",
    export: "Export",
    processingFile: "Processing file",
    of: "of",
    index: "Index",
    name: "Name",
    selfAssessment: "Self Assessment",
    companies: "Companies",
    graduateSchools: "Graduate Schools",
    loading: "Loading...",
  },
  zh: {
    title: "简历关键信息自动提取",
    selectModel: "选择模型",
    filesSelected: "个文件已选择",
    extractKeyInfo: "提取关键信息",
    processing: "处理中...",
    export: "导出",
    processingFile: "正在处理第",
    of: "份简历 (共",
    index: "序号",
    name: "姓名",
    selfAssessment: "自我评价",
    companies: "公司经历",
    graduateSchools: "毕业学校",
    loading: "加载中...",
  }
}

interface CandidateInfo {
  name: string;
  selfAssessment: string;
  companies: { name: string; duration: string; }[];
  graduateSchools: { name: string; duration: string; }[];
}

export default function ResumeAnalyzer({ params: { lang } }: { params: { lang: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = translations[lang as keyof typeof translations]

  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<CandidateInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>(aiModels[0].value)
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0)
  const [totalFiles, setTotalFiles] = useState<number>(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${lang}`)
    }
  }, [status, router, lang])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files)
      setFiles(fileArray)
      setTotalFiles(fileArray.length)
    }
  }

  const handleExport = () => {
    const exportData = results.map((result, index) => ({
      [t.index]: index + 1,
      [t.name]: result.name,
      [t.selfAssessment]: result.selfAssessment,
      [t.companies]: result.companies.map(exp => `${exp.name} (${exp.duration})`).join('; '),
      [t.graduateSchools]: result.graduateSchools.map(school => `${school.name} (${school.duration})`).join('; ')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');
  
    const fileName = `${lang === 'en' ? 'Resume_Key_Info' : '简历关键信息'}-${timestamp}.xlsx`;

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
    return <div>{t.loading}</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t.title}</h2>
          
          <Select onValueChange={handleModelChange} defaultValue={selectedModel}>
            <SelectTrigger className="w-[250px] dark:bg-gray-700 dark:text-gray-200">
              <SelectValue placeholder={t.selectModel} />
            </SelectTrigger>
            <SelectContent>
              {aiModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <Input 
              type="file" 
              accept=".pdf,.txt" 
              multiple 
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 h-12 py-1.5 dark:bg-gray-700 dark:text-gray-200"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{files.length} {t.filesSelected}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.processing}
                </>
              ) : t.extractKeyInfo}
            </Button>

            {results.length > 0 && results.length === totalFiles && (
              <Button 
                onClick={handleExport} 
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="mr-2 h-4 w-4" />
                {t.export}
              </Button>
            )}

            {isLoading && (
              <div className="flex-1 h-6 overflow-hidden text-sm">
                <LoadingTextAnimationComponent 
                  text={`${t.processingFile} ${currentFileIndex} ${t.of} ${files.length}, ${currentFile || ''}`} 
                />
              </div>
            )}
            
          </div>
          
          {results.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] dark:text-gray-200">{t.index}</TableHead>
                  <TableHead className="w-[100px] dark:text-gray-200">{t.name}</TableHead>
                  <TableHead className="w-[400px] dark:text-gray-200">{t.selfAssessment}</TableHead>
                  <TableHead className="dark:text-gray-200">{t.companies}</TableHead>
                  <TableHead className="dark:text-gray-200">{t.graduateSchools}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="dark:text-gray-300">{index + 1}</TableCell>
                    <TableCell className="dark:text-gray-300">{result.name}</TableCell>
                    <TableCell className="w-[200px] dark:text-gray-300">
                      <div className="whitespace-normal break-words">
                        {result.selfAssessment}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {result.companies.map((exp, i) => (
                        <div key={i}>{exp.name} ({exp.duration})</div>
                      ))}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
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