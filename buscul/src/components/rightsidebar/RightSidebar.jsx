import React, { useState, useEffect } from 'react';
import './rightsidebar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { usePodcasts } from '../../context/PodcastContext';
import { useAuth } from '../../context/AuthContext';

const RightSidebar = () => {
  const { savedPodcasts } = usePodcasts();
  const { user } = useAuth();
  const [savedFlashcards, setSavedFlashcards] = useState([]);
  const [savedMindMaps, setSavedMindMaps] = useState([]);

  useEffect(() => {
    const storedFlashcards = JSON.parse(localStorage.getItem('savedFlashcards')) || [];
    setSavedFlashcards(storedFlashcards);

    // Fetch user's mind maps
    if (user?.id) {
      fetchUserMindMaps();
    }

    const handleStorageChange = (e) => {
      if (e.key === 'savedFlashcards') {
        const updatedFlashcards = JSON.parse(localStorage.getItem('savedFlashcards')) || [];
        setSavedFlashcards(updatedFlashcards);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const fetchUserMindMaps = async () => {
    try {
      const response = await fetch(`http://localhost:8000/mindmaps/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Keep only the most recent 5 mind maps
        setSavedMindMaps(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching mind maps:', error);
    }
  };

  return (
    <div className="right-sidebar">
      <div className="right-sidebar-header">
        <p className="right-sidebar-title">Tools</p>
      </div>

      {/* Mind Maps */}
      <Link to="/mindmap" style={{ textDecoration: 'none' }}>
        <div className="right-sidebar-entry">
          <img src={assets.compass_icon} alt="" />
          <p>Mind Maps</p>
        </div>
      </Link>

      {/* Flashcards */}
      <Link to="/flashcards" style={{ textDecoration: 'none' }}>
        <div className="right-sidebar-entry">
          <img src={assets.bulb_icon} alt="" />
          <p>Flash Cards</p>
        </div>
      </Link>

      {/* Progress Report */}
      <Link to="/progress-report" style={{ textDecoration: 'none' }}>
        <div className="right-sidebar-entry">
          <img src={assets.gallery_icon} alt="" />
          <p>Progress Report</p>
        </div>
      </Link>

      {/* Audio Summary */}
      <Link to="/audio-summary" style={{ textDecoration: 'none' }}>
        <div className="right-sidebar-entry">
          <img src={assets.youtube_icon} alt="" />
          <p>Audio Summary</p>
        </div>
      </Link>

      {/* Saved Mind Maps */}
      {savedMindMaps.length > 0 && (
        <div className="saved-mindmaps-section">
          <div className="right-sidebar-header">
            <p className="right-sidebar-title">Recent Mind Maps</p>
          </div>
          {savedMindMaps.map((mindmap) => (
            <Link 
              key={mindmap.mindmap_id} 
              to="/mindmap" 
              style={{ textDecoration: 'none' }}
            >
              <div className="right-sidebar-entry saved-mindmap-item">
                <img src={assets.compass_icon} alt="" />
                <div className="mindmap-info">
                  <p className="mindmap-topic">{mindmap.topic}</p>
                  <span className="mindmap-nodes">{mindmap.node_count} nodes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Saved Podcasts */}
      {savedPodcasts.length > 0 && (
        <div className="saved-podcasts-section">
          <div className="right-sidebar-header">
            <p className="right-sidebar-title">Saved Podcasts</p>
          </div>
          {savedPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="right-sidebar-entry saved-podcast-item"
            >
              <img src={assets.youtube_icon} alt="" />
              <p>{podcast.name || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Saved Flashcards */}
      {savedFlashcards.length > 0 && (
        <div className="saved-flashcards-section">
          <div className="right-sidebar-header">
            <p className="right-sidebar-title">Saved Flashcards</p>
          </div>
          {savedFlashcards.slice(0, 3).map((flashcard) => (
            <Link 
              key={flashcard.id} 
              to="/flashcards" 
              style={{ textDecoration: 'none' }}
            >
              <div className="right-sidebar-entry saved-flashcard-item">
                <img src={assets.bulb_icon} alt="" />
                <p>{flashcard.question.substring(0, 30)}...</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;