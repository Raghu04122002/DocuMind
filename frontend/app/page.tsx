"use client"

import { useState } from "react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type Source = {
  source: string
  score: number
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [repo, setRepo] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("Ready")
  const [toast, setToast] = useState("")

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(""), 3000)
  }

  async function uploadPDF() {
    if (!file) return

    setLoading(true)
    setStatus("Indexing")

    const fd = new FormData()
    fd.append("file", file)

    await fetch(`${API}/upload_pdf`, { method: "POST", body: fd })

    setStatus("Indexed")
    setLoading(false)
    showToast("PDF indexed successfully")
  }

  async function indexGithub() {
    if (!repo) return

    setLoading(true)
    setStatus("Indexing")

    await fetch(`${API}/github?repo_url=${encodeURIComponent(repo)}`, {
      method: "POST",
    })

    setStatus("Indexed")
    setLoading(false)
    showToast("Repository indexed successfully")
  }

  async function ask() {
    if (!question) return

    setLoading(true)
    setAnswer("")
    setSources([])

    const res = await fetch(`${API}/ask?question=${encodeURIComponent(question)}`, {
      method: "POST",
    })

    const data = await res.json()

    setAnswer(data.answer)
    setSources(data.sources || [])
    setLoading(false)
    showToast("Answer generated")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(10,10,15,0.8)] border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2V8H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              DocuMind
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="text-zinc-400">{status}</span>
            </div>
            <a href="https://github.com" target="_blank" className="w-10 h-10 flex items-center justify-center glass-card hover:scale-105">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[900px] mx-auto px-8 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
            Chat With Your Documents
          </h1>
          <p className="text-lg text-zinc-400">
            Upload PDFs or GitHub repositories and ask questions using AI.
          </p>
        </section>

        {/* Upload Section */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          {/* PDF Upload Card */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" strokeWidth="2" />
              </svg>
              <h2 className="text-xl font-semibold">Upload PDF</h2>
            </div>

            <div className="dropzone mb-6">
              <svg className="dropzone-icon mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" strokeWidth="2" />
                <path d="M17 8L12 3L7 8" strokeWidth="2" />
                <path d="M12 3V15" strokeWidth="2" />
              </svg>
              <p className="text-zinc-300 mb-1">Drag & drop your PDF here</p>
              <p className="text-sm text-zinc-500 mb-3">or</p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="pdf-input"
              />
              <label htmlFor="pdf-input" className="inline-block px-6 py-2 bg-[#1f1f28] border border-[rgba(255,255,255,0.08)] rounded-xl cursor-pointer hover:bg-[#2a2a32] transition-colors">
                Browse Files
              </label>
              {file && (
                <p className="mt-3 text-sm text-purple-400">
                  ✓ {file.name}
                </p>
              )}
            </div>

            <button
              onClick={uploadPDF}
              disabled={loading || !file}
              className="btn-primary w-full"
            >
              {loading && status === "Indexing" ? "Indexing..." : "Index PDF"}
            </button>
          </div>

          {/* GitHub Repository Card */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <h2 className="text-xl font-semibold">GitHub Repository</h2>
            </div>

            <div className="mb-6">
              <input
                className="input-field"
                placeholder="https://github.com/username/repository"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
              />
            </div>

            <button
              onClick={indexGithub}
              disabled={loading || !repo}
              className="btn-primary w-full"
            >
              {loading && status === "Indexing" ? "Indexing..." : "Index Repository"}
            </button>
          </div>
        </section>

        {/* Ask Section */}
        <section className="glass-card p-8 mb-16">
          <div className="mb-6">
            <textarea
              className="ask-input"
              placeholder="What would you like to ask?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
          </div>

          <button
            onClick={ask}
            disabled={loading || !question}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          >
            {loading && !answer ? (
              <>
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>Ask AI</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </section>

        {/* Answer Section */}
        {answer && (
          <section className="fade-in mb-16">
            <div className="glass-card p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" strokeWidth="2" />
                </svg>
                <h2 className="text-xl font-semibold">Answer</h2>
              </div>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>

            {/* Sources Panel */}
            {sources.length > 0 && (
              <div className="glass-card p-8 border-purple-500/20">
                <h3 className="text-lg font-semibold mb-4">Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {sources.map((s, i) => (
                    <div key={i} className="source-pill">
                      <span className="text-zinc-300">{s.source}</span>
                      <span className="pill-score">{s.score.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!answer && (
          <div className="text-center py-16 fade-in">
            <h3 className="text-2xl font-semibold mb-3">Ready to get started?</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              Upload a PDF or index a GitHub repository to begin asking questions.
            </p>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6L9 17L4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white">{toast}</span>
        </div>
      )}
    </div>
  )
}
