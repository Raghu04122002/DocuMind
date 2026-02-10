from dotenv import load_dotenv
import os
import openai
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

model = SentenceTransformer("all-MiniLM-L6-v2")
DIM = 384

INDEX_PATH = "index.faiss"
META_PATH = "metadata.pkl"

if os.path.exists(INDEX_PATH) and os.path.exists(META_PATH):
    index = faiss.read_index(INDEX_PATH)
    docs = pickle.load(open(META_PATH, "rb"))
else:
    index = faiss.IndexFlatL2(DIM)
    docs = []


def reset_index():
    global index, docs
    index = faiss.IndexFlatL2(DIM)
    docs = []

    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)

    if os.path.exists(META_PATH):
        os.remove(META_PATH)



def add_documents(texts, source):
    global docs, index

    if not texts:
        return False

    embeds = model.encode(texts)
    embeds = np.array(embeds).astype("float32")

    if embeds.ndim == 1:
        embeds = embeds.reshape(1, -1)

    index.add(embeds)

    for t in texts:
        docs.append({"text": t, "source": source})

    faiss.write_index(index, INDEX_PATH)
    pickle.dump(docs, open(META_PATH, "wb"))

    return True


def ask(question, source=None, top_k=5):
    if not docs:
        return {"answer": "No documents indexed yet.", "sources": []}

    q = model.encode([question]).astype("float32")
    D, I = index.search(q, min(top_k * 2, len(docs)))

    blocks = []
    source_scores = {}

    for score, idx in zip(D[0], I[0]):
        d = docs[idx]

        if source and d["source"] != source:
            continue  # 🔥 FILTER HERE

        blocks.append(d["text"])

        source_scores[d["source"]] = min(
            source_scores.get(d["source"], float("inf")),
            float(score)
        )

        if len(blocks) >= top_k:
            break

    if not blocks:
        return {"answer": "I don't know.", "sources": []}

    context = "\n\n".join(blocks)

    prompt = f"""
You are a helpful assistant answering questions about documents.
Use the context below to answer the question.
If the context contains relevant information, provide a clear and helpful answer.
Only say "I don't know" if the context is completely unrelated to the question.

Context:
{context}

Question:
{question}

Answer:
"""

    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return {
        "answer": res.choices[0].message.content,
        "sources": [
            {"source": k, "score": round(1 / (1 + v), 4)}

            for k, v in source_scores.items()
        ]
    }


def summarize_document(text, max_chars=3000):
    """
    Generate a high-level summary of the document.
    Uses only the first part of the document for speed & cost.
    """
    snippet = text[:max_chars]

    prompt = f"""
Summarize what this document is about in 2–3 sentences.
Do NOT add assumptions.

Document:
{snippet}
"""

    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return res.choices[0].message.content.strip()
