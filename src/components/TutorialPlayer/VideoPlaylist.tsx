import React from "react";
import type { VideoData } from "./VideoData";
import "./VideoPlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

interface Props {
  videos: VideoData[];
  playVideoCallback: (vid: VideoData) => void;
}

const VideoPlaylist = ({ videos, playVideoCallback }: Props) => {
  return (
    <table className="playlist-table">
      <tr>
        <th>#</th>
        <th></th>
        <th>Title</th>
        <th>Channel</th>
      </tr>
      {videos.map((vids, i) => {
        return (
          <tr className="playlist-row">
            <div onClick={() => playVideoCallback(vids)}>
              <FontAwesomeIcon icon={faPlay} />
            </div>
            <td>
              <img height="50px" src={vids.snippet.thumbnails.default.url} />
            </td>
            <td>{vids.snippet.title}</td>
            <td>{vids.snippet.channelTitle}</td>
          </tr>
        );
      })}
    </table>
  );
};

export default VideoPlaylist;
