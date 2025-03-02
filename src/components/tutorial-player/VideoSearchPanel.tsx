import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VideoSearchPanel.css";
import {
  faAdd,
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
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [channel, setChannel] = useState("");
  const instruments = ["guitar", "bass", "ukulele", "piano"];
  const [instrument, setInstrument] = useState(instruments[0]);

  const songRef = useRef<HTMLInputElement>(null);

  const queryVideos = () => {
    const qsong = song.replace(" ", "+");
    const qartist = artist.replace(" ", "+");
    const qchannel = channel.replace(" ", "+");
    const qinstrument = instrument.replace(" ", "+");
    debugger;
    const request = `https://tklwhs2x3m.execute-api.us-east-2.amazonaws.com/default/fetchMusicTutorials?song=${qsong}&artist=${qartist}&channel=${qchannel}&instrument=${qinstrument}`;
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
    <div className={"search-panel"}>
      <div
        className={`video-search-bar ${
          isSearchBarExpanded || queriedTutorials.length != 0 ? "expanded" : ""
        } ${queriedTutorials.length !== 0 ? "queried" : ""}`}
      >
        <button
          className={`video-search-button ${
            isSearchBarExpanded ? "expanded" : ""
          }`}
          onClick={() => {
            if (queriedTutorials.length > 0) {
              setQueriedTutorials(new Array<VideoData>());
              setSong("");
              setArtist("");
              setChannel("");
            } else {
              songRef.current?.focus();
            }
          }}
        >
          <FontAwesomeIcon
            icon={queriedTutorials.length > 0 ? faClose : faSearch}
          />
        </button>
        <input
          className="song-search-input"
          onFocus={() => {
            setIsSearchBarExpanded(true);
            setChannel("");
            setArtist("");
          }}
          onBlur={() => setIsSearchBarExpanded(false)}
          ref={songRef}
          value={song}
          onChange={(e) => setSong(e.target.value)}
          enterKeyHint="search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              queryVideos();
            }
          }}
          placeholder="Search song..."
        ></input>
      </div>
      <div
        className={`queried-videos ${
          queriedTutorials.length !== 0 ? "visible" : ""
        } acrylic`}
      >
        <div className="tutorials-filters-flex">
          <span>Filters:</span>
          <input
            className="tutorial-filter-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
          <input
            className="tutorial-filter-input"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Channel"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                queryVideos();
              }
            }}
          ></input>
          <select
            className="tutorial-filter-input"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            {instruments.map((inst) => {
              return <option value={inst}>{inst}</option>;
            })}
          </select>
          <button onClick={queryVideos}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {queriedTutorials?.map((video) => {
          return (
            <div
              className="queried-video-card"
              key={video.snippet.thumbnails.default.url}
            >
              <button
                onClick={() => {
                  playVideoCallback(video);
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button
                onClick={() => {
                  addVideoCallback(video);
                }}
              >
                <FontAwesomeIcon icon={faAdd} />
              </button>
              <img
                style={{ height: "100%" }}
                src={video.snippet.thumbnails.default.url}
              ></img>
              <div style={{ textAlign: "left" }}>
                <div
                  className="queried-video-title"
                  style={{ fontSize: "1em" }}
                >
                  {video.snippet.title}
                </div>
                <div
                  className="queried-video-title"
                  style={{ fontSize: "0.61em", marginLeft: "auto" }}
                >
                  {video.snippet.channelTitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoSearchPanel;
