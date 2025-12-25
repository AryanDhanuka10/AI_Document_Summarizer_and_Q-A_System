# API Contract Quick Reference

## Backend Endpoints (FastAPI)

### 1. Upload
```
POST /upload?session_id=<uuid>
Content-Type: multipart/form-data

FormData:
  files: PDF[]  (multiple files under 'files' field)
```

**Response:**
```json
[
  {
    "filename": "document.pdf",
    "session_id": "uuid-here",
    "page_count": 10
  }
]
```

---

### 2. Summarization
```
POST /summarize/upload?session_id=<uuid>
Content-Type: application/json

Body: {}  (empty JSON object)
```

**Response:**
```json
{
  "summary": "Document summary text...",
  "citations": [
    {
      "source_file": "document.pdf",
      "page_number": 3,
      "text": "excerpt..."
    }
  ],
  "document_count": 2
}
```

---

### 3. Chat
```
POST /chat
Content-Type: application/json

Body:
{
  "session_id": "uuid-here",
  "question": "What is this about?"
}
```

**Response:**
```json
{
  "answer": "Based on the documents...",
  "citations": [
    {
      "source_file": "document.pdf",
      "page_number": 5,
      "text": "relevant excerpt..."
    }
  ],
  "chunk_count": 3
}
```

---

## Frontend Implementation

### Session Management
```typescript
// lib/utils.ts
export function getSessionId(): string {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}
```

### Upload Call
```typescript
// lib/api.ts
const sessionId = getSessionId();
const formData = new FormData();
files.forEach(file => formData.append('files', file));

await fetch(`${API_BASE_URL}/upload?session_id=${sessionId}`, {
  method: 'POST',
  body: formData,
});
```

### Summarize Call
```typescript
const sessionId = getSessionId();
await fetch(`${API_BASE_URL}/summarize/upload?session_id=${sessionId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({}),
});
```

### Chat Call
```typescript
const sessionId = getSessionId();
await fetch(`${API_BASE_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    session_id: sessionId,
    question: question,
  }),
});
```

---

## Key Points

✅ **Session ID**: Generated once, persisted in localStorage, reused across all requests
✅ **Upload**: session_id as QUERY parameter, files in FormData
✅ **Summarize**: session_id as QUERY parameter, empty body
✅ **Chat**: session_id in JSON body
✅ **Citations**: Use `source_file` and `page_number` fields
