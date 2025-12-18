# Rexy.ai - Your Personalized AI Study Assistant

Rexy.ai is an advanced, AI-powered study companion designed to transform how you learn. By leveraging Retrieval-Augmented Generation (RAG) and state-of-the-art LLMs, Rexy.ai processes your study materials (PDFs, Documents, Images) to provide a personalized, interactive, and multimodal learning experience.

Whether you need to cram for an exam, visualize complex topics, or listen to your notes on the go, Rexy.ai has you covered.

![Dashboard Overview](images/Screenshot%202025-12-19%20025405.png)

## 🚀 Key Features

*   **📚 Document Intelligence:** Upload PDFs, Word documents, or images. Rexy.ai extracts and understands the content to power all its features.
*   **🤖 AI Tutor Chat:** Chat with your documents! Ask questions and get instant answers based *only* on your uploaded materials, ensuring accuracy and relevance.
*   **📝 Smart Quizzes:** Automatically generate quizzes from your study material to test your knowledge. Track your performance and identify weak areas.
*   **📇 Flashcards & Spaced Repetition:** Convert your notes into flashcards instantly. Use the built-in spaced repetition system to maximize retention.
*   **🎧 Audio Podcasts:** Turn your boring documents into engaging audio podcasts. Listen to summaries and deep dives while you commute or relax.
*   **🧠 Mind Maps:** Visualize connections between concepts with automatically generated mind maps. Perfect for understanding complex subjects.
*   **📅 Personalized Timetables:** Get a custom study schedule tailored to your goals and available time.
*   **📊 Progress Tracking:** Visualize your learning journey with streaks, heatmaps, and detailed progress reports.
*   **🔍 PYQ Analysis:** Upload Previous Year Questions (PYQs) to identify important topics and generate targeted practice questions.

## 📸 Screenshots

| Feature | Preview |
| :--- | :--- |
| **Interactive Chat & Learning** | ![Chat Interface](images/Screenshot%202025-12-19%20025424.png) |
| **Quiz & Assessment** | ![Quiz Interface](images/Screenshot%202025-12-19%20025446.png) |
| **Study Tools** | ![Tools Interface](images/Screenshot%202025-12-19%20025513.png) |

## 🛠️ Tech Stack

### Backend
*   **Framework:** FastAPI (Python)
*   **Database:** SQLAlchemy (SQL), ChromaDB (Vector Database for RAG)
*   **AI/ML:** LangChain, OpenAI / Groq LLMs, Sentence Transformers
*   **Audio:** gTTS (Google Text-to-Speech)
*   **Processing:** PyMuPDF (Fitz), Python-docx, Pillow (Images)

### Frontend
*   **Framework:** React.js (Vite)
*   **Routing:** React Router DOM
*   **Styling:** CSS3, Lucide React Icons
*   **Visualization:** Recharts (Data visualization), React Markdown

## ⚙️ Installation & Setup

### Prerequisites
*   Python 3.9+
*   Node.js & npm
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Rexy.ai.git
cd Rexy.ai
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd Backend

# Create a virtual environment (optional but recommended)
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `Backend` directory and add your API keys:
```env
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_api_key
# Add other necessary database or configuration keys
```

**Run the Backend Server:**
```bash
python main.py
# The API will run at http://localhost:8000
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory (`buscul`).

```bash
cd buscul

# Install dependencies
npm install

# Run the development server
npm run dev
```
The application will typically be available at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature additions or bug fixes.

## 📄 License

This project is licensed under the MIT License.
