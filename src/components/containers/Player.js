import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Video from "../Video";
import Playlist from "./Playlist";
import StyledPlayer from "../styles/StyledPlayer";
import videoData from "../../data/videoData.json";

const theme = {
  bgcolor: "#353535",
  bgcolorItem: "#414141",
  bgcolorItemActive: "#405c63",
  bgcolorPlayed: "#526d4e",
  border: "none",
  borderPlayed: "none",
  color: "#fff"
};

const themeLight = {
  bgcolor: "#fff",
  bgcolorItem: "#fff",
  bgcolorItemActive: "#80a7b1",
  bgcolorPlayed: "#7d9979",
  border: "1px solid #353535",
  borderPlayed: "none",
  color: "#353535"
};

const Player = ({ match, history, location }) => {
  const savedState = JSON.parse(
    localStorage.getItem(`${videoData.playlistId}`)
  );
  const [state, setState] = useState(
    savedState
      ? savedState
      : {
          videos: videoData.playlist,
          activeVideo: videoData.playlist[0],
          nightMode: true,
          autoplay: false,
          playlistId: videoData.playlistId
        }
  );

  const { videos, activeVideo, nightMode, autoplay } = state;

  useEffect(() => {
    localStorage.setItem(`${state.playlistId}`, JSON.stringify({ ...state }));
  }, [state]);

  useEffect(() => {
    const videoId = match.params.activeVideo;
    if (videoId) {
      const newActiveVideo = videos.findIndex(video => video.id === videoId);
      setState(prev => ({
        ...prev,
        activeVideo: prev.videos[newActiveVideo],
        autoplay: location.autoplay
      }));
    } else {
      history.push({ pathname: `${activeVideo.id}`, autoplay: false });
    }
  }, [
    activeVideo.id,
    history,
    location.autoplay,
    match.params.activeVideo,
    videos
  ]);

  const nightModeCallback = () => {
    setState({ ...state, nightMode: !nightMode });
  };

  const endCallback = () => {
    const videoId = match.params.activeVideo;
    const currentVideoIndex = videos.findIndex(video => video.id === videoId);
    const nextVideo =
      currentVideoIndex === videos.length - 1 ? 0 : currentVideoIndex + 1;
    history.push({ pathname: `${videos[nextVideo].id}`, autoplay: false });
  };

  const progressCallback = e => {
    if (e.playedSeconds > 10 && e.playedSeconds < 11) {
      setState({
        ...state,
        videos: videos.map(video =>
          video.id === activeVideo.id ? { ...video, played: true } : video
        )
      });
    }
  };

  return (
    <ThemeProvider theme={nightMode ? theme : themeLight}>
      {videos && (
        <StyledPlayer>
          <Video
            active={activeVideo}
            autoplay={autoplay}
            endCallback={endCallback}
            progressCallback={progressCallback}
          />
          <Playlist
            videos={videos}
            active={activeVideo}
            nightModeCallback={nightModeCallback}
            nightMode={nightMode}
          />
        </StyledPlayer>
      )}
    </ThemeProvider>
  );
};

export default Player;
