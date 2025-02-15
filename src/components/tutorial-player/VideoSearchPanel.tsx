import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VideoSearchPanel.css";
import {
  faAdd,
  faArrowRight,
  faArrowRotateForward,
  faClose,
  faPlay,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import type { VideoData } from "../../types/VideoData";

interface Props {
  addVideoCallback: (vid: VideoData) => void;
  playVideoCallback: (vid: VideoData) => void;
}

const VideoSearchPanel = ({ addVideoCallback, playVideoCallback }: Props) => {
  const [queriedTutorials, setQueriedTutorials] = useState<VideoData[]>([]);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const songRef = useRef<HTMLInputElement>(null);
  const artistRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<HTMLInputElement>(null);

  const openNav = () => {
    setIsSearchBarOpen(!isSearchBarOpen);
  };

  const queryVideos = () => {
    const song = songRef.current?.value.replace(" ", "+");
    const artist = artistRef.current?.value.replace(" ", "+");
    const channel = channelRef.current?.value.replace(" ", "+");
    const instrument = "guitar";

    const request = `https://tklwhs2x3m.execute-api.us-east-2.amazonaws.com/default/fetchMusicTutorials?song=${song}&artist=${artist}&channel=${channel}&instrument=${instrument}`;
    try {
      fetch(request)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setQueriedTutorials(data.items);
        });
    } catch {
      throw Error("Failed to Query Videos");
    }
  };

  return (
    <div className={"search-panel"} id="searchPanel">
      <button className="video-search-button" onClick={openNav}>
        <FontAwesomeIcon icon={isSearchBarOpen ? faClose : faSearch} />
      </button>
      <div
        className="video-query-panel"
        style={{
          visibility: isSearchBarOpen ? "visible" : "hidden",
        }}
      >
        <label>Song:</label>
        <input
          ref={songRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              queryVideos();
            }
          }}
        ></input>
        <label>Artist:</label>
        <input
          ref={artistRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              queryVideos();
            }
          }}
        ></input>
        <label>Channel:</label>
        <input
          ref={channelRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              queryVideos();
            }
          }}
        ></input>
        <button onClick={queryVideos}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div
        className={"queried-videos"}
        style={{
          visibility: isSearchBarOpen ? "visible" : "hidden",
        }}
      >
        {queriedTutorials?.map((video, i) => {
          return (
            <div
              className="queried-video-card"
              key={video.snippet.thumbnails.default.url}
            >
              <img
                style={{ height: "2em" }}
                src={video.snippet.thumbnails.default.url}
              ></img>
              <div style={{ textAlign: "left" }}>
                <span
                  className="queried-video-title"
                  style={{ fontSize: "1em", width: 250 }}
                >
                  {video.snippet.title}
                </span>
                <span style={{ fontSize: "0.61em" }}>
                  {video.snippet.channelTitle}
                </span>
              </div>
              <button
                onClick={() => {
                  playVideoCallback(video);
                }}
                style={{
                  margin: "auto",
                  height: 50,
                  width: 50,
                  borderRadius: "25%",
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button
                onClick={() => {
                  addVideoCallback(video);
                }}
                style={{
                  margin: "auto",
                  height: 50,
                  width: 50,
                  borderRadius: "25%",
                }}
              >
                <FontAwesomeIcon icon={faAdd} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoSearchPanel;
