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
        <div
          style={{
            zIndex: -999,
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          <ReactPlayer
            id="youtube-player"
            height="100%"
            width="100%"
            playing={isPlaying}
            controls={true}
            url={`https://www.youtube.com/watch?v=${videoId}`}
          />
        </div>
        <div style={{ margin: 15 }}>
          <VideoSearchPanel
            addVideoCallback={(vid: VideoData) => {
              setTutorials([...tutorials, vid]);
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
        ></VideoPlaylist>
      </div>
    </>
  );
};

export default TutorialPlayer;
