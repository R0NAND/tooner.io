import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VideoSearchPanel.css";
import {
  faArrowRotateForward,
  faClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import type { VideoData } from "./VideoData";

interface Props {
  addVideoCallback: (vid: VideoData) => void;
}

const VideoSearchPanel = ({ addVideoCallback }: Props) => {
  const [queriedTutorials, setQueriedTutorials] = useState<VideoData[]>([]);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const songRef = useRef<HTMLInputElement>(null);
  const artistRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<HTMLInputElement>(null);

  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
  const openNav = () => {
    if (isSearchBarOpen) {
      //@ts-ignore
      document.getElementById("searchPanel").style.gridTemplateColumns =
        "50px 0px";
      setIsSearchBarOpen(false);
    } else {
      //@ts-ignore
      document.getElementById("searchPanel").style.gridTemplateColumns =
        "70px auto";
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
        console.log(data.items);
        setQueriedTutorials(data.items);
      });
  };
  return (
    <div className="search-panel" id="searchPanel">
      <button className="video-search-button" onClick={openNav}>
        <FontAwesomeIcon icon={isSearchBarOpen ? faClose : faSearch} />
      </button>
      <div className="video-query-panel" id="videoQuerySidebar">
        <div>
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
        <div>
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
        <div>
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
      <div className="queried-videos">
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
                  addVideoCallback(video);
                }}
                style={{
                  margin: "auto",
                  height: 50,
                  width: 50,
                  borderRadius: "25%",
                }}
              >
                +
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoSearchPanel;
