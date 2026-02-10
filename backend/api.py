from fastapi import FastAPI, UploadFile
from pypdf import PdfReader
import requests
import base64
from typing import Optional

from rag import add_documents, ask, reset_index, summarize_document
from chunking import chunk_text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- PDF ----------------

@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile):
    reset_index()   # 🔥 ADD THIS

    reader = PdfReader(file.file)
    full_text = "".join([p.extract_text() or "" for p in reader.pages])

    summary = summarize_document(full_text)

    chunks = chunk_text(full_text)
    chunks.insert(0, summary)

    add_documents(chunks, "PDF")

    return {
        "status": "PDF indexed",
        "summary": summary
    }

# ---------------- GitHub ----------------

@app.post("/github")
def github(repo_url: str):
    reset_index()

    if not repo_url or "github.com" not in repo_url:
        return {"error": "Invalid GitHub URL"}

    parts = repo_url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]

    texts = []

    repo_api = f"https://api.github.com/repos/{owner}/{repo}"
    repo_res = requests.get(repo_api)
    if repo_res.status_code == 200:
        desc = repo_res.json().get("description", "")
        if desc:
            texts.append(desc)

    readme_api = f"https://api.github.com/repos/{owner}/{repo}/readme"
    readme_res = requests.get(readme_api)
    if readme_res.status_code == 200:
        readme = base64.b64decode(readme_res.json()["content"]).decode("utf-8")
        texts.append(readme)

    issues_api = f"https://api.github.com/repos/{owner}/{repo}/issues"
    issues_res = requests.get(issues_api)
    if issues_res.status_code == 200:
        for issue in issues_res.json():
            if "pull_request" not in issue:
                t = (issue.get("title") or "") + "\n" + (issue.get("body") or "")
                if t.strip():
                    texts.append(t)

    full_text = "\n\n".join(texts)

    # 🔥 SUMMARY FIRST
    summary = summarize_document(full_text)

    chunks = chunk_text(full_text)
    chunks.insert(0, summary)

    add_documents(chunks, "github")

    return {
        "status": "GitHub indexed",
        "summary": summary
    }


# ---------------- Ask ----------------

@app.post("/ask")
def query(question: str):
    return ask(question)


# ---------------- Debug ----------------

@app.get("/debug")
def debug():
    from rag import docs
    return {
        "total_docs": len(docs),
        "docs": [{"source": d["source"], "text_preview": d["text"][:200]} for d in docs]
    }
