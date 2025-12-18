import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // ✅ supports bold, lists, tables

const Main = () => {
  const { onSent, recentPrompt, showResults, loading, resultData, setInput, input } =
    useContext(Context);

  const [language, setLanguage] = useState("en"); // Default English
  const navigate = useNavigate();

  const businessTopics = [
    "Summarize this Topic",
    "Take Quiz",
    "Generate Flashcards",
    "Create Mind Maps",
    "PYQS(IMP Prediction)",
    "Create a Study plan",
    "Audio Summary",
    "User Progress",
  ];

  const handleCardClick = (topic) => {
    if (topic === "Take Quiz") {
      navigate("/quiz");
    } else if (topic === "Summarize this Topic") {
      navigate("/summary");
    } else if (topic === "PYQS(IMP Prediction)") {
      navigate("/pyqs");
    } else if (topic === "Generate Flashcards") {
      navigate("/flashcards");
    } else if (topic === "Create Mind Maps") {
      navigate("/mindmap");
    } else if (topic === "Audio Summary") {
      navigate("/audio-summary");
    } else if (topic === "User Progress") {
      navigate("/progress-report");
    } else {
      setInput(topic);
      onSent(language); // 🔥 Pass selected language
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p></p>
        
      </div>

      <div className="main-container">
        {/* Language Selector */}
        <div className="language-select">
          <label htmlFor="language">Select Language: </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Marathi</option>
          </select>
        </div>

        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Hey, Learner</span>
              </p>
              <p>Let's Improve Your Score</p>
            </div>
            <div className="cards">
              {businessTopics.map((topic, index) => (
                <div
                  key={index}
                  className="card"
                  onClick={() => handleCardClick(topic)}
                >
                  <p>{topic}</p>
                  {topic === "Create Mind Maps" && (
                    <span className="card-icon"></span>
                  )}
                  {topic === "Take Quiz" && (
                    <span className="card-icon"></span>
                  )}
                  {topic === "Generate Flashcards" && (
                    <span className="card-icon"></span>
                  )}
                  {topic === "Audio Summary" && (
                    <span className="card-icon"></span>
                  )}
                  {topic === "User Progress" && (
                    <span className="card-icon"></span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                // ✅ Markdown renderer with Tailwind + remark-gfm
                <div className="prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {resultData}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter the Prompt Here"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSent(language);
                }
              }}
            />
            <div>
              <img
                src={assets.send_icon}
                alt=""
                onClick={() => onSent(language)} // 🔥 language passed
              />
            </div>
          </div>
          <div className="bottom-info">
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;