import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VideoSearchPanel.css";
import {
  faAdd,
  faArrowRotateForward,
  faClose,
  faPlay,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import type { VideoData } from "./VideoData";

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

  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
  const openNav = () => {
    if (isSearchBarOpen) {
      setIsSearchBarOpen(false);
    } else {
      setIsSearchBarOpen(true);
    }
  };

  const queryVideos = () => {
    const song = songRef.current?.value.replace(" ", "+");
    const artist = artistRef.current?.value.replace(" ", "+");
    const channel = channelRef.current?.value.replace(" ", "+");

    const request = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${song}+${artist}+${channel}+Guitar+Tutorial&type=video&key=ITSASECRET`;
    fetch(request)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setQueriedTutorials(data.items);
      });
  };
  return (
    <div
      className={
        "search-panel" + (isSearchBarOpen ? " expanded-search-panel" : "")
      }
      id="searchPanel"
    >
      <button className="video-search-button" onClick={openNav}>
        <FontAwesomeIcon icon={isSearchBarOpen ? faClose : faSearch} />
      </button>
      <div className="video-query-panel" id="videoQuerySidebar">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Song</label>
          <input
            ref={songRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Artist</label>
          <input
            ref={artistRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Channel</label>
          <input
            ref={channelRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
        </div>
        <button>
          <FontAwesomeIcon icon={faArrowRotateForward} />
        </button>
      </div>
      <div></div>
      <div
        className={
          "queried-videos" +
          (queriedTutorials.length ? "" : " collapsed-queried-videos")
        }
      >
        {queriedTutorials?.map((video, i) => {
          return (
            <div
              className="queried-video-card"
              key={video.snippet.thumbnails.default.url}
            >
              <img src={video.snippet.thumbnails.default.url}></img>
              <div>
                <h3 style={{ width: 250 }}>{video.snippet.title}</h3>
                <label>{video.snippet.channelTitle}</label>
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
