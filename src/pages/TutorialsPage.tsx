import { useState } from "react";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTutorials from "../defaults/tutorials";
import { VideoData } from "../types/VideoData";
import VideoPlaylist from "../components/tutorial-player/VideoPlaylist";
import ReactPlayer from "react-player";
import VideoSearchPanel from "../components/tutorial-player/VideoSearchPanel";
import "./TutorialsPage.css";

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useLocalStorageArray<VideoData>(
    "tutorials",
    defaultTutorials
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoData>(tutorials[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = (vid: VideoData) => {
    setSelectedVideo(vid);
    setIsPlaying(true);
  };
  const deleteVideo = (vid: VideoData) => {
    const newTutorials = tutorials.filter((v) => v !== vid);
    setTutorials(newTutorials);
  };

  return (
    <div className="tutorials-page">
      <VideoPlaylist
        videos={tutorials}
        playVideoCallback={playVideo}
        deleteVideoCallback={deleteVideo}
      ></VideoPlaylist>
      <div style={{ display: "flex", height: "800px" }}>
        <div
          style={{
            position: "relative",
            height: "720px",
            width: "1080px",
          }}
        >
          <ReactPlayer
            style={{ position: "absolute" }}
            id="youtube-player"
            height="100%"
            width="100%"
            playing={isPlaying}
            controls={true}
            url={`https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`}
          />
          <div style={{ margin: 15, position: "absolute" }}>
            <VideoSearchPanel
              addVideoCallback={(vid: VideoData) => {
                const newTutorials = [...tutorials, vid];
                setTutorials(newTutorials);
              }}
              playVideoCallback={(vid: VideoData) => {
                setSelectedVideo(vid);
                setIsPlaying(true);
              }}
            ></VideoSearchPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
