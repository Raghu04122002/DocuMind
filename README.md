# DocuMind 🧠

**Chat With Your Documents** - An AI-powered document chat application with a premium, modern UI.

![DocuMind UI](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)

## ✨ Features

- 📄 **PDF Upload & Indexing** - Upload and index PDF documents for AI-powered Q&A
- 🐙 **GitHub Repository Integration** - Index entire GitHub repositories
- 🤖 **AI-Powered Q&A** - Ask questions and get accurate answers from your documents
- 🎨 **Premium UI** - Modern, glassmorphism design inspired by Linear, Vercel, and Notion
- ⚡ **Fast Vector Search** - FAISS-powered semantic search
- 🔄 **Real-time Updates** - Live status updates and toast notifications

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **RAG System**: Retrieval-Augmented Generation using OpenAI GPT-3.5
- **Vector Database**: FAISS for efficient similarity search
- **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2)
- **Document Processing**: PyPDF for PDF parsing, GitHub API integration

### Frontend (Next.js + React)
- **Framework**: Next.js 16 with App Router
- **Styling**: Custom CSS with glassmorphism effects + Tailwind CSS
- **UI Components**: Premium dark theme with purple accents
- **Animations**: Smooth transitions, fade-ins, and microinteractions

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API Key

### Clone the Repo
```bash
git clone "repo url"
```
### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Run the server
uvicorn api:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the dev server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📖 Usage

1. **Upload a PDF**
   - Drag & drop or browse for a PDF file
   - Click "Index PDF" to process the document

2. **Index a GitHub Repository**
   - Enter a GitHub repository URL
   - Click "Index Repository" to fetch and process the code

3. **Ask Questions**
   - Type your question in the text area
   - Click "Ask AI" to get an answer
   - View sources with confidence scores

## 🎨 Design System

- **Colors**: Dark theme with purple accents (#8b5cf6)
- **Typography**: Inter font family
- **Effects**: Glassmorphism, backdrop blur, smooth shadows
- **Animations**: 250ms cubic-bezier transitions
- **Components**: Glass cards, gradient buttons, glowing inputs

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- OpenAI GPT-3.5
- FAISS
- Sentence Transformers
- PyPDF
- Python-dotenv

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Custom CSS animations

## 📝 API Endpoints

- `POST /upload_pdf` - Upload and index a PDF file
- `POST /github?repo_url=<url>` - Index a GitHub repository
- `POST /ask?question=<query>` - Ask a question
- `GET /debug` - View indexed documents (debug)

## 🔒 Environment Variables

**Backend (.env):**
```
OPENAI_API_KEY=your_openai_api_key

HF_HOME=/tmp/hf (**only for free tier deployment because it make sures that your image size doesn't exceed the limit)
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📦 Project Structure

```
DocuMind/
├── backend/
│   ├── api.py          # FastAPI routes
│   ├── rag.py          # RAG system & vector search
│   ├── chunking.py     # Text chunking utilities
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx    # Main UI component
│   │   ├── layout.tsx  # Root layout
│   │   └── globals.css # Design system
│   ├── public/
│   └── package.json
└── .gitignore
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Design inspired by Linear, Vercel, Notion, and OpenAI Playground
- Built with modern web technologies and AI

---

**Made by Raghu**
