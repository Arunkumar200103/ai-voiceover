import React, { useEffect, useRef } from "react";

interface CharacterVideoProps {
  src: string;
  volume: number;
  isPlaying: boolean;
}

const CharacterVideo: React.FC<CharacterVideoProps> = ({
  src,
  volume,
  isPlaying,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "32px", // 🔼 margin from top
  },
  video: {
    width: "220px",
    height: "220px",
    borderRadius: "50%", // 🔵 round shape
    objectFit: "cover",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    backgroundColor: "#000",
  },
};


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.min(1, Math.max(0, volume));

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [volume, isPlaying]);

  return (
    <div style={styles.wrapper}>
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        muted={volume === 0}
        style={styles.video}
      />
    </div>
  );
};

export default CharacterVideo;
