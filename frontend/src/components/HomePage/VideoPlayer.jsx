import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { useGlobalTheme } from "./GlobalThemeContext";

const VideoPlayer = ({ isOpen, onClose, videoUrl }) => {
  const { isDark } = useGlobalTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const googleDriveVideoUrl = "https://drive.google.com/file/d/1tClOEBRZEKRP5FPTrPa8ozu2gjxx9fJz/preview";

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();  
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
      }
    };
    
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
        document.removeEventListener('keydown', handleKeyPress);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isOpen, isPlaying, isMuted, isFullscreen]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current && duration > 0) {
      const seekbar = e.currentTarget;
      const rect = seekbar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
    const time = Math.floor(timeInSeconds);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  if (!isOpen) return null;

  const themeClasses = {
    overlay: isDark ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/80 backdrop-blur-sm',
    modal: isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200',
    controls: isDark ? 'bg-gradient-to-t from-black/80 to-transparent' : 'bg-gradient-to-t from-black/70 to-transparent',
    button: isDark ? 'text-white hover:text-cyan-400 bg-black/30 hover:bg-black/50' : 'text-white hover:text-blue-400 bg-black/30 hover:bg-black/50',
    closeButton: isDark ? 'text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 bg-white/90 hover:bg-white',
    progressBar: isDark ? 'bg-gray-600' : 'bg-gray-400',
    progressFill: isDark ? 'bg-cyan-400' : 'bg-blue-500',
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${themeClasses.overlay}`}>
      <div  
        ref={playerRef}
        className={`relative w-full max-w-6xl mx-4 rounded-2xl shadow-2xl ${themeClasses.modal} flex flex-col`}
        style={{ height: '90vh' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <button
          onClick={onClose}
          // MODIFICATION: Changed translate-x-1/2 to translate-x-full
          className={`absolute top-0 right-0 translate-x-full -translate-y-1/2 z-20 w-10 h-10 rounded-full ${themeClasses.closeButton} flex items-center justify-center transition-all shadow-lg hover:scale-110`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative bg-black flex-1 w-full rounded-t-2xl overflow-hidden">
          <iframe
            src={googleDriveVideoUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            frameBorder="0"
            title="AI Revenue Leak Demo Video"
          />
        </div>

        <div className={`flex-shrink-0 py-2 px-4 rounded-b-2xl ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
            Product Demo: AI-Powered Revenue Detection
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm leading-tight`}>
            See how our AI identifies billing anomalies, processes large datasets, and provides actionable insights.
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3 text-xs">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Duration: {duration > 0 ? formatTime(duration) : '4:18'}
              </span>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Product Walkthrough</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Press ESC to close • Space to play/pause
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;