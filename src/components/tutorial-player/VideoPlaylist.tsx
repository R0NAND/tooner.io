import React from "react";
import type { VideoData } from "../../types/VideoData";
import "./VideoPlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faX } from "@fortawesome/free-solid-svg-icons";

interface Props {
  videos: VideoData[];
  playVideoCallback: (vid: VideoData) => void;
  deleteVideoCallback: (vid: VideoData) => void;
}

const VideoPlaylist = ({
  videos,
  playVideoCallback,
  deleteVideoCallback,
}: Props) => {
  return (
    <div>
      {videos.map((vid, i) => {
        return (
          <div className="playlist-row" key={vid.id.videoId}>
            <button
              className="playlist-video-delete"
              onClick={() => deleteVideoCallback(vid)}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
            <img
              style={{ height: "3em" }}
              src={vid.snippet.thumbnails.default.url}
            />
            <div style={{ textAlign: "left", width: "15em" }}>
              <div>{vid.snippet.title}</div>
              <div style={{ fontSize: "0.61em" }}>
                {vid.snippet.channelTitle}
              </div>
            </div>
            <button onClick={() => playVideoCallback(vid)}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default VideoPlaylist;
