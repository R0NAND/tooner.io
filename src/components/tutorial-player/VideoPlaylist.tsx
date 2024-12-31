import React from "react";
import type { VideoData } from "./VideoData";
import "./VideoPlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTrash, faX } from "@fortawesome/free-solid-svg-icons";

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
    <table className="playlist-table">
      <tbody>
        {videos.map((vid, i) => {
          return (
            <tr className="playlist-row" key={vid.id.videoId}>
              <td>
                <div onClick={() => playVideoCallback(vid)}>
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              </td>
              <td>
                <img height="50px" src={vid.snippet.thumbnails.default.url} />
              </td>
              <td>{vid.snippet.title}</td>
              <td>{vid.snippet.channelTitle}</td>
              <td>
                <div onClick={() => deleteVideoCallback(vid)}>
                  <FontAwesomeIcon icon={faX} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default VideoPlaylist;
