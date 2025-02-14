import React from "react";
import TutorialPlayer from "../components/tutorial-player/TutorialPlayer";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTutorials from "../defaults/tutorials";
import { VideoData } from "../types/VideoData";
import VideoPlaylist from "../components/tutorial-player/VideoPlaylist";

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useLocalStorageArray<VideoData>(
    "tutorials",
    defaultTutorials
  );
  return (
    <div className="tutorials-page">
      <VideoPlaylist
        videos={tutorials}
        playVideoCallback={() => {}}
        deleteVideoCallback={() => {}}
      ></VideoPlaylist>
      <TutorialPlayer></TutorialPlayer>
    </div>
  );
};

export default TutorialsPage;
