import { useEffect, useRef, useState } from "react";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTutorials from "../defaults/tutorials";
import { VideoData } from "../types/VideoData";
import VideoPlaylist from "../components/tutorial-player/VideoPlaylist";
import ReactPlayer from "react-player";
import VideoSearchPanel from "../components/tutorial-player/VideoSearchPanel";
import "./TutorialsPage.css";
import DualSlider from "../components/dual-slider/DualSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faStop } from "@fortawesome/free-solid-svg-icons";
import { OnProgressProps } from "react-player/base";
import Metronome from "../components/metronome/Metronome";

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

  const playerRef = useRef<ReactPlayer | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  useEffect(() => {}, [selectedVideo]);
  const [loopStartTime, setLoopStartTime] = useState(0);
  const [loopEndTime, setLoopEndTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const onNewVideo = (rp: ReactPlayer) => {
    const duration = rp.getDuration();
    setVideoDuration(duration);
    setLoopStartTime(0);
    setLoopEndTime(duration);
  };

  const onProgressCallback = (progress: OnProgressProps) => {
    if (isLooping && progress.playedSeconds > loopEndTime) {
      playerRef.current?.seekTo(loopStartTime);
    }
  };

  useEffect(() => {
    if (isLooping && isPlaying) {
      playerRef.current?.seekTo(loopStartTime);
    }
  }, [isPlaying, isLooping, loopStartTime, loopEndTime]);

  return (
    <div className="tutorials-page">
      <div className="tutorials-panel main-panel">
        <div className="tutorials-player-container">
          <div className="player-wrapper">
            <ReactPlayer
              className="react-player"
              style={{ position: "absolute" }}
              ref={playerRef}
              height="100%"
              width="100%"
              playing={isPlaying}
              controls={true}
              url={`https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`}
              onReady={onNewVideo}
              onProgress={onProgressCallback}
            />
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
          {videoDuration > 0 && (
            <div className="tutorials-loop-controls">
              <button
                style={{ width: "1.5em" }}
                className={`${isLooping ? "red" : ""}`}
                title={isLooping ? "Stop loop" : "Loop video"}
                onClick={() => {
                  if (!isLooping) {
                    setIsPlaying(true);
                    setIsLooping(true);
                  } else {
                    setIsPlaying(false);
                    setIsLooping(false);
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={!isLooping ? faRepeat : faStop}
                ></FontAwesomeIcon>
              </button>
              <DualSlider
                min={0}
                max={videoDuration}
                minValue={loopStartTime}
                maxValue={loopEndTime}
                displayType="time"
                inputPosition="top"
                width="100%"
                onMinChange={setLoopStartTime}
                onMaxChange={setLoopEndTime}
              ></DualSlider>
            </div>
          )}
        </div>
        <div className="tutorials-queue">
          <h3
            style={{ textAlign: "left", marginTop: 0, marginBottom: "0.5em" }}
          >
            Tutorials Playlist
          </h3>
          <VideoPlaylist
            className="video-playlist classy-scroll"
            videos={tutorials}
            playVideoCallback={playVideo}
            deleteVideoCallback={deleteVideo}
          ></VideoPlaylist>
          <h3 style={{ textAlign: "left", margin: "0.5em 0" }}>Metronome</h3>
          <div className="tutorials-metronome-container">
            <Metronome></Metronome>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
