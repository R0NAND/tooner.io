import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./TutorialPlayer.css";
import VideoSearchPanel from "./VideoSearchPanel";
import type { VideoData } from "./VideoData";
import VideoPlaylist from "./VideoPlaylist";

const TutorialPlayer = () => {
  const [videoId, setVideoId] = useState("");
  const [tutorials, setTutorials] = useState<VideoData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const setLocalStorage = (vids: VideoData[]) => {
    localStorage.setItem("videos", JSON.stringify(vids));
  };

  useEffect(() => {
    if (document.cookie !== null) {
      try {
        const storedVideos = localStorage.getItem("videos");
        if (storedVideos !== null) {
          try {
            setTutorials(JSON.parse(storedVideos));
          } catch {
            throw new Error(
              "Failed to convert localStorage to tutorials playlist."
            );
          }
        }
      } catch {
        throw new Error("Failed to fetch videos from user's cookies");
      }
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "720px",
          width: "1080px",
          border: "2px solid red",
        }}
      >
        <ReactPlayer
          style={{ position: "absolute" }}
          id="youtube-player"
          height="100%"
          width="100%"
          playing={isPlaying}
          controls={true}
          url={`https://www.youtube.com/watch?v=${videoId}`}
        />
        <div style={{ margin: 15, position: "absolute" }}>
          <VideoSearchPanel
            addVideoCallback={(vid: VideoData) => {
              const newTutorials = [...tutorials, vid];
              setTutorials(newTutorials);
              setLocalStorage(newTutorials);
            }}
            playVideoCallback={(vid: VideoData) => {
              setVideoId(vid.id.videoId);
              setIsPlaying(true);
            }}
          ></VideoSearchPanel>
        </div>
      </div>
      <div style={{ margin: "auto" }}>
        <VideoPlaylist
          videos={tutorials}
          playVideoCallback={(vid: VideoData) => {
            setVideoId(vid.id.videoId);
            setIsPlaying(true);
          }}
          deleteVideoCallback={(vid: VideoData) => {
            const newTutorials = tutorials.filter((v) => v !== vid);
            setTutorials(newTutorials);
            setLocalStorage(newTutorials);
          }}
        ></VideoPlaylist>
      </div>
    </>
  );
};

export default TutorialPlayer;
