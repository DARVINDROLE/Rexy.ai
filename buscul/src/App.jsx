import { Routes, Route } from "react-router-dom";
import Main from "./components/main/Main";
import QuizPage from "./components/pages/QuizPage";
import AudioSummaryPage from "./components/pages/AudioSummaryPage";
import FlashcardApp from "./components/pages/FlashcardApp";
import MindMapPage from "./components/pages/MindMapPage";
import Sidebar from "./components/sidebar/Sidebar";
import RightSidebar from "./components/rightsidebar/RightSidebar";
import SummaryFetcher from "./components/pages/SummaryFetcher";
import PyqsPage from "./components/pages/PyqsPage";
import ProgressReport from "./components/pages/ProgressReport";
import AuthPage from "./components/pages/AuthPage";
import DocumentDetailsPage from "./components/pages/DocumentDetailsPage";
import { useAuth } from "./context/AuthContext";
import { PodcastProvider } from "./context/PodcastContext";
import './App.css';

function App() {
  const { user, login } = useAuth();

  if (!user) {
    return <AuthPage onLogin={login} />;
  }

  return (
    <PodcastProvider>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/progress-report" element={<ProgressReport />} />
            <Route path="/audio-summary" element={<AudioSummaryPage />} />
            <Route path="/flashcards" element={<FlashcardApp />} />
            <Route path="/mindmap" element={<MindMapPage />} />
            <Route path="/summary" element={<SummaryFetcher />} />
            <Route path="/pyqs" element={<PyqsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailsPage />} />
          </Routes>
        </div>
        <RightSidebar />
      </div>
    </PodcastProvider>
  );
}

export default App;