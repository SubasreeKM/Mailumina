from sentence_transformers import SentenceTransformer
import faiss, numpy as np, os

KB_DOCS = [
    "FAQ: Reset password at https://example.com/reset",
    "Refund policy: refunds within 15 days if unused",
    "Product ABC: activation steps..."
]

class RAGIndex:
    def __init__(self):
        model_name = os.getenv("EMBEDDING_MODEL","all-MiniLM-L6-v2")
        self.model = SentenceTransformer(model_name)
        self.docs = KB_DOCS
        self._build()

    def _build(self):
        embs = self.model.encode(self.docs, convert_to_numpy=True)
        faiss.normalize_L2(embs)
        self.index = faiss.IndexFlatIP(embs.shape[1])
        self.index.add(embs)
        self.embs = embs

    def retrieve(self, query, k=2):
        q_emb = self.model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(q_emb)
        D,I = self.index.search(q_emb,k)
        return [self.docs[i] for i in I[0]]

_rag = None
def get_rag():
    global _rag
    if _rag is None: _rag = RAGIndex()
    return _rag
