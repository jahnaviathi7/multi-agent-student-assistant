import hashlib
import re
import numpy as np


# Lightweight, CPU-only deterministic embeddings.
# This avoids PyTorch, CUDA, NVIDIA and sentence-transformers.
EMBEDDING_DIMENSION = 512


def _tokenize(text: str):
    """
    Convert text into simple normalized tokens.
    """
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def _hash_token(token: str):
    """
    Convert a token into a deterministic vector index.
    """
    digest = hashlib.md5(
        token.encode("utf-8")
    ).hexdigest()

    return int(digest, 16) % EMBEDDING_DIMENSION


def _create_embedding(text: str):
    """
    Create a lightweight deterministic embedding.
    """

    vector = np.zeros(
        EMBEDDING_DIMENSION,
        dtype=np.float32
    )

    tokens = _tokenize(text)

    if not tokens:
        return vector

    for token in tokens:

        index = _hash_token(token)

        vector[index] += 1.0

    # Normalize vector
    norm = np.linalg.norm(vector)

    if norm > 0:
        vector = vector / norm

    return vector


def create_embeddings(texts: list):
    """
    Create embeddings for multiple documents.
    """

    if not texts:
        return []

    embeddings = []

    for text in texts:

        embedding = _create_embedding(
            str(text)
        )

        embeddings.append(
            embedding
        )

    return np.array(
        embeddings,
        dtype=np.float32
    )


def create_query_embedding(query: str):
    """
    Create an embedding for a search query.
    """

    return _create_embedding(
        str(query)
    )