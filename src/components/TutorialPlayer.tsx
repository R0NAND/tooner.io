import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./TutorialPlayer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateForward,
  faClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

type VideoData = {
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishAt: string;
    thumbnails: {
      default: {
        height: number;
        url: string;
        width: number;
      };
      high: {
        height: number;
        url: string;
        width: number;
      };
      medium: {
        height: number;
        url: string;
        width: number;
      };
    };
    title: string;
  };
};

const TutorialPlayer = () => {
  const [videoId, setVideoId] = useState("");
  const [tutorials, setTutorials] = useState<VideoData[]>([]);
  const [queriedTutorials, setQueriedTutorials] = useState<VideoData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

  const songRef = useRef<HTMLInputElement>(null);
  const artistRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<HTMLInputElement>(null);

  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
  const openNav = () => {
    if (isSearchBarOpen) {
      //@ts-ignore
      document.getElementById("videoQuerySidebar").style.width = "0";
      setIsSearchBarOpen(false);
    } else {
      //@ts-ignore
      document.getElementById("videoQuerySidebar").style.width = "auto";
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
        <div className="search-panel" style={{ margin: "10px" }}>
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
                      setTutorials([...tutorials, video]);
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
      </div>
      {tutorials?.map((video, i) => {
        return (
          <div key={video.snippet.thumbnails.default.url}>
            <img src={video.snippet.thumbnails.default.url}></img>
            <button
              onClick={() => {
                setVideoId(video.id.videoId);
                setIsPlaying(true);
              }}
            >
              Play
            </button>
            <button
              onClick={() => {
                setTutorials(
                  tutorials.filter((a) => a.id.videoId !== video.id.videoId)
                );
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </>
  );
};

export default TutorialPlayer;
