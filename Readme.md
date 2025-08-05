# 📚 Study Buddy – Personalized AI Learning Mentor (No LangChain)

**Study Buddy** is a full-stack AI assistant designed for students to:
- Generate personalized study plans,
- Solve academic doubts,
- Create flashcards & quizzes,
- Ask questions from uploaded notes (PDF),
All using advanced AI capabilities **without LangChain**, directly powered by OpenAI APIs.

---

## 🚀 Features

- 🧠 **Ask Academic Doubts** – Physics, Chemistry, Biology, etc.
- 📅 **Generate Study Plans** – Based on subjects + number of days
- 🧾 **Upload Notes (PDF)** – Extract text and embed for Q&A
- 📚 **Flashcard Generator** – Convert topics into Q&A format
- ❓ **Quiz Generator** – MCQ-type questions from notes
- 🔍 **Ask from Uploaded Notes** – RAG using OpenAI Embeddings + FAISS
- 📊 **Structured Output** – Clean JSON responses for UI display
- 🔐 **JWT Authentication** – Secure login/register
- 🌐 **MongoDB Atlas** – Stores user data, history, vectors

---

## 🧠 Tech Stack

| Layer        | Tech |
|-------------|------|
| ⚙️ Backend  | Node.js + Express.js |
| 🤖 AI       | OpenAI API (GPT-4, Embeddings) |
| 🧾 PDF Parsing | pdf-parse |
| 🔍 Vector Search | FAISS (manual RAG) |
| 💾 Database | MongoDB Atlas |
| 🔐 Auth     | JWT (jsonwebtoken) |
| 💻 Frontend | React + Tailwind CSS (optional) |

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user |
| `/api/auth/login` | POST | User login |
| `/api/ai/ask-doubt` | POST | Ask any academic question |
| `/api/ai/flashcards` | POST | Generate Q&A flashcards |
| `/api/ai/create-quiz` | POST | Auto-generate MCQs |
| `/api/ai/study-plan` | POST | Generate N-day study plan |
| `/api/pdf/upload` | POST | Upload notes (PDF) |
| `/api/pdf/ask-from-notes` | POST | Ask questions from uploaded PDF |
| `/api/dev/embed-notes` | POST | Create vector embeddings for notes |
| `/api/user/history` | GET | Get previous queries (optional) |

---

## 🔐 .env Configuration

Create a `.env` file in the root:

```env
# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/studybuddy

# JWT Secret
JWT_SECRET=your_jwt_secret

# Optional FAISS vector storage path
VECTOR_STORE_PATH=./vectors
