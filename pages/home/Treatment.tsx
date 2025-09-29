"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "@/styles/HappyStories.module.css";

interface Short {
  _id: string;
  platform: "youtube" | "instagram";
  videoUrl: string; // YouTube Shorts URL or Instagram .mp4
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

const TreatmentStories = () => {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [current, setCurrent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const playersRef = useRef<any[]>([]);
  const ytReadyRef = useRef<boolean>(false);

  // ✅ Load YouTube API safely
  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      ytReadyRef.current = true;
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      ytReadyRef.current = true;
      initYouTubePlayers();
    };
  }, []);

  // Fetch treatment shorts from backend
  const fetchShorts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/treatment-shorts");
      setShorts(res.data);
    } catch (err) {
      console.error("Failed to fetch treatment shorts", err);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  // ✅ Initialize YouTube players when shorts are loaded
  useEffect(() => {
    if (shorts.length && ytReadyRef.current) {
      initYouTubePlayers();
    }
  }, [shorts]);

  const initYouTubePlayers = () => {
    shorts.forEach((short, index) => {
      if (short.platform === "youtube" && !playersRef.current[index]) {
        const videoId = extractVideoId(short.videoUrl);
        if (!videoId) return;

        playersRef.current[index] = new (window as any).YT.Player(
          `yt-player-${index}`,
          {
            videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              fs: 0,
              showinfo: 0,
              enablejsapi: 1,
            },
            events: {
              onReady: (event: any) => {
                event.target.mute(); // start muted
              },
            },
          }
        );
      }
    });
  };

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/shorts\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  // Auto-scroll slider
  useEffect(() => {
    if (isHovered || shorts.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % shorts.length;
        containerRef.current?.scrollTo({
          left: next * containerRef.current.offsetWidth * 0.75,
          behavior: "smooth",
        });
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, shorts.length]);

  // ✅ Hover handlers
  const handleMouseEnter = (index: number) => {
    setIsHovered(true);
    const short = shorts[index];
    if (short.platform === "instagram") {
      const vid = videoRefs.current[index];
      if (vid) {
        vid.muted = isMuted;
        vid.play().catch(() => {});
      }
    } else if (short.platform === "youtube") {
      const player = playersRef.current[index];
      if (player && typeof player.playVideo === "function") {
        isMuted ? player.mute() : player.unMute();
        player.playVideo();
      }
    }
  };

  const handleMouseLeave = (index: number) => {
    setIsHovered(false);
    const short = shorts[index];
    if (short.platform === "instagram") {
      const vid = videoRefs.current[index];
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    } else if (short.platform === "youtube") {
      const player = playersRef.current[index];
      if (player && typeof player.pauseVideo === "function") {
        player.pauseVideo();
      }
    }
  };

  // Toggle mute for all
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;

      videoRefs.current.forEach((vid) => {
        if (vid) vid.muted = newState;
      });

      playersRef.current.forEach((player) => {
        if (player && typeof player.mute === "function") {
          newState ? player.mute() : player.unMute();
        }
      });

      return newState;
    });
  };

  if (!shorts.length)
    return <p style={{ textAlign: "center" }}>No treatment shorts available</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.slider} ref={containerRef}>
        {shorts.map((short, index) => (
          <div
            key={short._id}
            className={`${styles.card} ${
              index === current ? styles.active : styles.inactive
            }`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className={styles.videoWrapper}>
              {short.platform === "youtube" ? (
                <div
                  id={`yt-player-${index}`}
                  className={styles.youtubeIframe}
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={short.videoUrl} // must be direct .mp4 link
                  muted
                  playsInline
                  controls={false}
                  preload="metadata"
                  className={styles.videoTag}
                  loop
                />
              )}
              <button className={styles.muteBtn} onClick={toggleMute}>
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {shorts.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === current ? styles.activeDot : ""}`}
            onClick={() => {
              setCurrent(i);
              containerRef.current?.scrollTo({
                left: i * containerRef.current.offsetWidth * 0.75,
                behavior: "smooth",
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TreatmentStories;
