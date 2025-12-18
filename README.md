# Rexy.ai - Your Personal AI Study Assistant

![RAG-Model Algorithm.jpg](RAG-Model%20Algorithm.jpg)

Rexy.ai is a comprehensive, AI-powered study platform designed to revolutionize the way students learn and interact with their educational materials. By leveraging the power of Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG), Rexy.ai transforms passive study materials into an interactive and dynamic learning experience.

## ✨ Features

Rexy.ai offers a suite of powerful tools to cater to diverse learning needs:

- **📄 Document Interaction**: Upload your PDF documents and ask questions directly about the content. The AI-powered backend finds the most relevant information to answer your queries.
- **🧠 Quiz Generation**: Automatically create quizzes from your study materials to test your knowledge and reinforce key concepts.
- **🃏 Flashcard Creator**: Generate flashcards from your notes or documents for quick review and memorization sessions.
- **🗺️ Mind Map Generation**: Visualize complex topics and their connections with automatically generated mind maps.
- **🎧 Audio Summaries & Podcasts**: Convert text content into audio summaries or full-length podcasts, perfect for learning on the go.
- **📊 Progress Tracking**: Monitor your learning journey with detailed progress reports and analytics.
- **📅 Timetable Scheduling**: Let the AI help you organize your study sessions with a smart timetable generator.
- **🌐 Translation Services**: Break language barriers by translating your study materials into different languages.
- **🤖 AI Chat**: A general-purpose chat interface to assist with a wide range of questions and tasks.

## 🚀 Tech Stack

The project is a full-stack application built with modern technologies:

**Frontend (./buscul)**
- **Framework**: React.js with Vite
- **Routing**: React Router
- **Styling**: CSS
- **API Communication**: Axios
- **AI**: Google Generative AI (`@google/generative-ai`)

**Backend (./Backend)**
- **Framework**: FastAPI
- **Database ORM**: SQLAlchemy
- **Vector Database**: ChromaDB (for RAG)
- **Document Processing**: PyMuPDF (`fitz`), `python-docx`
- **AI/ML**: LangChain, Sentence-Transformers
- **Audio**: gTTS, pyttsx3, pydub
- **Server**: Uvicorn

## ⚙️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Python](https://www.python.org/) (v3.9 or newer)
- An API key for Google Gemini or another compatible LLM.

### 1. Backend Setup

First, navigate to the backend directory and set up a virtual environment.

```bash
cd Backend
python -m venv venv
```

**Activate the environment:**
- On Windows: `.\venv\Scripts\activate`
- On macOS/Linux: `source venv/bin/activate`

**Install the required Python packages:**
```bash
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a `.env` file in the `Backend` directory and add your LLM API key.

```env
# .env
API_KEY="YOUR_GEMINI_API_KEY"
```

**Run the backend server:**
```bash
uvicorn main:app --reload
```
The backend API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install the necessary npm packages.

```bash
cd buscul
npm install
```

**Run the frontend development server:**
```bash
npm run dev
```
The application will be accessible in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## 📁 Project Structure

The repository is organized into two main parts:

- **/Backend**: The Python FastAPI server that handles all business logic, AI processing, and database interactions.
- **/buscul**: The React.js frontend application that provides the user interface.
- **ML Model.ipynb**: A Jupyter notebook for experimenting with machine learning models.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Happy Studying with Rexy.ai!
