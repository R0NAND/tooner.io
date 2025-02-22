import { useState } from "react";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTutorials from "../defaults/tutorials";
import { VideoData } from "../types/VideoData";
import VideoPlaylist from "../components/tutorial-player/VideoPlaylist";
import ReactPlayer from "react-player";
import VideoSearchPanel from "../components/tutorial-player/VideoSearchPanel";
import "./TutorialsPage.css";
import Slider from "../components/metronome/Slider";

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
      <div className="tutorials-player-container">
        <div className="tutorials-player">
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
        <div style={{ display: "flex" }}>
          <label>Timestamp Looper Placeholder:</label>
          <Slider
            min={0}
            max={100}
            value={50}
            width="7em"
            onChange={() => {
              return 50;
            }}
          ></Slider>
        </div>
      </div>
      <VideoPlaylist
        videos={tutorials}
        playVideoCallback={playVideo}
        deleteVideoCallback={deleteVideo}
      ></VideoPlaylist>
    </div>
  );
};

export default TutorialsPage;
