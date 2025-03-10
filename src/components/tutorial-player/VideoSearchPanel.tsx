import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VideoSearchPanel.css";
import {
  faAdd,
  faAngleDown,
  faAngleUp,
  faClose,
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
  const [areFiltersExpanded, setAreFiltersExpanded] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

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
    const request = `https://tklwhs2x3m.execute-api.us-east-2.amazonaws.com/default/fetchMusicTutorials?song=${qsong}&artist=${qartist}&channel=${qchannel}&instrument=${qinstrument}`;
    try {
      setIsQuerying(true);
      fetch(request)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setQueriedTutorials(data.items);
        })
        .finally(() => setIsQuerying(false));
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
          {!isQuerying ? (
            <FontAwesomeIcon
              icon={queriedTutorials.length > 0 ? faClose : faSearch}
            />
          ) : (
            <div className="spinner"></div>
          )}
        </button>
        <input
          className="song-search-input acrylic"
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
        className={`queried-videos classy-scroll ${
          queriedTutorials.length !== 0 ? "visible" : ""
        } acrylic`}
      >
        <button
          className="tutorials-filters-expand-button"
          onClick={() => setAreFiltersExpanded(!areFiltersExpanded)}
        >
          <FontAwesomeIcon
            icon={areFiltersExpanded ? faAngleUp : faAngleDown}
          ></FontAwesomeIcon>{" "}
          More Filters
        </button>
        <div
          className={`tutorials-filters-flex ${
            areFiltersExpanded ? "expanded" : ""
          }`}
        >
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
            enterKeyHint="search"
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
            enterKeyHint="search"
          ></input>
          <select
            className="tutorial-instrument-filter"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            {instruments.map((inst) => {
              return (
                <option
                  className="tutorial-instrument-filter-option"
                  value={inst}
                >
                  {inst}
                </option>
              );
            })}
          </select>
          <button className="filters-search-button" onClick={queryVideos}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        {queriedTutorials?.map((video) => {
          return (
            <div
              className="queried-video-card"
              key={video.snippet.thumbnails.default.url}
              onClick={() => playVideoCallback(video)}
              title={video.snippet.title}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
                <div className="queried-video-title strong-font">
                  {video.snippet.title}
                </div>
                <div
                  className="queried-video-title"
                  style={{ fontSize: "0.61em" }}
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
