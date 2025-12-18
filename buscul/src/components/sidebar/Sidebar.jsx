import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState, useRef, useEffect } from "react";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const { onSent, prevPrompts = [], setRecentPrompt } = useContext(Context);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    if (user && user.id) {
      try {
        const API_BASE_URL = "http://localhost:8000";
        const response = await fetch(`${API_BASE_URL}/documents/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        } else {
          console.error("Failed to fetch documents");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      if (files.length > 5) {
        setUploadError("You can upload a maximum of 5 files at once.");
        return;
      }
      setSelectedFiles(files);
      setUploadError(null);
      setUploadSuccess(false);

      await uploadDocuments(files);
    }
  };

  const uploadDocuments = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      if (!user) {
        setUploadError("You must be logged in to upload documents.");
        return;
      }
      formData.append("user_id", user.id);

      const API_BASE_URL = "http://localhost:8000"; // change if deployed
      console.log(`Uploading ${files.length} file(s)`);

      const response = await fetch(`${API_BASE_URL}/upload-document`, {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseBody);

      if (!response.ok) {
        throw new Error(
          `Upload failed (${response.status}): ${responseBody || "Unknown error"}`
        );
      }

      let result;
      try {
        result = JSON.parse(responseBody);
      } catch {
        result = responseBody;
      }

      console.log("Upload successful:", result);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      fetchDocuments(); // Call fetchDocuments after successful upload
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message);
      setSelectedFiles([]);
    } finally {
      setUploading(false);
    }
  };

  const loadPreviousPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className="sidebar">
      <div className="top">
        {/* ✅ Clicking brand goes to "/" */}
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src={assets.logo} alt="logo" className="logo" />
          {extended && <h2>Rexy.AI</h2>}
        </div>

        <div className="recent-entry">
          <img src={assets.search_icon} alt="search" />
          {extended && <p>Search chat</p>}
        </div>

        {/* File picker */}
        <div
          className="recent-entry"
          onClick={handleDivClick}
          style={{
            cursor: "pointer",
            opacity: uploading ? 0.6 : 1,
            pointerEvents: uploading ? "none" : "auto",
          }}
        >
          <img src={assets.vendor} alt="vendors" />
          {extended && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <p>Upload Source Material</p>
              {uploading && (
                <p style={{ fontSize: "10px", color: "#007bff" }}>Uploading...</p>
              )}
              {uploadSuccess && (
                <p style={{ fontSize: "10px", color: "#28a745" }}>
                  ✓ Uploaded successfully!
                </p>
              )}
              {uploadError && (
                <p style={{ fontSize: "10px", color: "#dc3545" }}>
                  Error: {uploadError}
                </p>
              )}
              {selectedFiles.length > 0 && !uploading && !uploadError && (
                <div style={{ fontSize: "10px", color: "#6c757d" }}>
                  {selectedFiles.map((file) => (
                    <p key={file.name}>{file.name}</p>
                  ))}
                </div>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
            disabled={uploading}
            multiple
          />
        </div>

        {extended && <p className="recent-title">Chats</p>}
        {extended &&
          prevPrompts.map((item, index) => (
            <div
              key={index}
              onClick={() => loadPreviousPrompt(item)}
              className="recent-entry"
            >
              <img src={assets.message_icon} alt="chat" />
              <p>{item.slice(0, 18)}...</p>
            </div>
          ))}

        {extended && <p className="recent-title">Documents</p>}
        {extended &&
          documents.map((doc) => (
            <div
              key={doc.id}
              className="recent-entry"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              <img src={assets.gallery_icon} alt="document" />
              <p>{doc.filename}</p>
            </div>
          ))}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry" style={{ cursor: "pointer" }}>
          <img src={assets.question_icon} alt="help" />
          {extended && <p>Help desk</p>}
        </div>

        {user ? (
          <div
            className="bottom-item recent-entry"
            onClick={logout}
            style={{ cursor: "pointer" }}
          >
            <img src={assets.user_icon} alt="user" />
            {extended && <p>Logout</p>}
          </div>
        ) : (
          <div
            className="bottom-item recent-entry"
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer" }}
          >
            <img src={assets.user_icon} alt="user" />
            {extended && <p>Sign Up</p>}
          </div>
        )}

        <div className="bottom-item recent-entry" style={{ cursor: "pointer" }}>
          <img src={assets.setting_icon} alt="settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;