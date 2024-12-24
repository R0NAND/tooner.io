import React, { useEffect, useState } from "react";

//@ts-ignore
//console.log(process.env.YOUTUBE_API_KEY);

const TutorialPlayer = () => {
  const [videoId, setVideoId] = useState("tCQ0r7vqkFQ");

  const queryVideos = () => {
    //@ts-ignore
    const song = document.getElementById("song-field").value.replace(" ", "+");
    //@ts-ignore
    const artist = document
      .getElementById("artist-field")
      //@ts-ignore
      .value.replace(" ", "+");
    //@ts-ignore
    const instructor = document
      .getElementById("instructor-field")
      //@ts-ignore
      .value.replace(" ", "+");

    const request = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${song}+${artist}+${instructor}+Tutorial&type=video&key=ITSASECRET`;
    fetch(request)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setVideoId(data["items"][0]["id"]["videoId"]);
      });
  };

  return (
    <>
      <div>
        <h1>Tutorial Player</h1>
        <label>Song</label>
        <input id="song-field"></input>
        <label>Artist</label>
        <input id="artist-field"></input>
        <label>Instructor</label>
        <input id="instructor-field"></input>
        <button onClick={queryVideos}>Load Tutorial</button>
      </div>
      <iframe
        width="420"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
      ></iframe>
    </>
  );
};

export default TutorialPlayer;
