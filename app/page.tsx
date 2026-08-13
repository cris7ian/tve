"use client";

import { useRef, useState } from "react";

const STREAM_URL =
  "https://www.youtube-nocookie.com/embed/b4tE5aKhtlg?autoplay=0&playsinline=1&controls=0&disablekb=1&enablejsapi=1&fs=0&iv_load_policy=3&rel=0&hl=es&origin=https%3A%2F%2Ftv.cristiancaroli.com";

export default function Home() {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  function playStream() {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "playVideo", args: [] }),
      "https://www.youtube-nocookie.com",
    );
    setHasStarted(true);
  }

  return (
    <main className="tv-app">
      <iframe
        ref={playerRef}
        src={STREAM_URL}
        title="TVE Canal 24 Horas en directo"
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
      <button
        className="player-shield"
        type="button"
        data-started={hasStarted}
        aria-label={hasStarted ? "Reanudar TVE" : "Reproducir TVE"}
        onClick={playStream}
      >
        <span className="play-icon" aria-hidden="true" />
      </button>
    </main>
  );
}
