import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./TutorialPlayer.css";

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
        width: 120;
      };
      high: {
        height: number;
        url: string;
        width: 120;
      };
      medium: {
        height: number;
        url: string;
        width: 120;
      };
    };
    title: string;
  };
};

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
  //@ts-ignore
  document.getElementById("videoQuerySidebar").style.width = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  //@ts-ignore
  document.getElementById("videoQuerySidebar").style.width = "0";
}

const TutorialPlayer = () => {
  const [videoId, setVideoId] = useState("");
  const [tutorials, setTutorials] = useState<VideoData[]>([]);
  const [queriedTutorials, setQueriedTutorials] = useState<VideoData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const songRef = useRef<HTMLInputElement>(null);
  const artistRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<HTMLInputElement>(null);

  const queryVideos = () => {
    const song = songRef.current?.value.replace(" ", "+");
    const artist = artistRef.current?.value.replace(" ", "+");
    const channel = channelRef.current?.value.replace(" ", "+");

    const request = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${song}+${artist}+${channel}+Tutorial&type=video&key=ITSASECRET`;
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
          height: "500px",
          width: "500px",
          border: "2px solid red",
        }}
      >
        <div style={{ position: "absolute" }}>
          <ReactPlayer
            height="500px"
            playing={isPlaying}
            controls={true}
            url={`https://www.youtube.com/watch?v=${videoId}`}
          />
        </div>
        <div className="video-query-panel" id="videoQuerySidebar">
          <label>Song</label>
          <br />
          <input
            ref={songRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
          <br />
          <label>Artist</label>
          <br />
          <input
            ref={artistRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
          <br />
          <label>Channel</label>
          <br />
          <input
            ref={channelRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
          <br />
          <button onClick={queryVideos}>Load Tutorial</button>
          {queriedTutorials?.map((video, i) => {
            return (
              <div
                key={video.snippet.thumbnails.default.url}
                style={{ display: "flex" }}
              >
                <img src={video.snippet.thumbnails.default.url}></img>
                <div>
                  <h3>{video.snippet.title}</h3>
                  <label>{video.snippet.channelTitle}</label>
                </div>
                <button
                  onClick={() => {
                    setTutorials([...tutorials, video]);
                  }}
                  style={{ borderRadius: "50%" }}
                >
                  +
                </button>
              </div>
            );
          })}
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
