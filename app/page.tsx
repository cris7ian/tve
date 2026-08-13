"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STREAM_URL =
  "https://www.youtube-nocookie.com/embed/b4tE5aKhtlg?autoplay=1&playsinline=1&controls=0&disablekb=1&enablejsapi=1&fs=0&iv_load_policy=3&rel=0&hl=es";

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

type PlayerMessage = {
  event?: string;
  info?: number | { playerState?: number };
};

export default function Home() {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const wasHiddenRef = useRef(false);
  const reloadRequestedRef = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);

  const sendPlayerCommand = useCallback((command: "playVideo" | "pauseVideo") => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      PLAYER_ORIGIN,
    );
  }, []);

  const playStream = useCallback(() => {
    sendPlayerCommand("playVideo");
  }, [sendPlayerCommand]);

  useEffect(() => {
    function refreshApp() {
      if (reloadRequestedRef.current) return;

      reloadRequestedRef.current = true;
      window.location.reload();
    }

    function handlePlayerMessage(event: MessageEvent) {
      if (event.origin !== PLAYER_ORIGIN) return;

      try {
        const message = JSON.parse(event.data) as PlayerMessage;
        const playerState =
          typeof message.info === "number"
            ? message.info
            : message.info?.playerState;

        if (playerState === 1) setHasStarted(true);
        if (playerState === 0 || playerState === 2) setHasStarted(false);
      } catch {
        // Ignore unrelated messages from the embedded player.
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        wasHiddenRef.current = true;
        sendPlayerCommand("pauseVideo");
        setHasStarted(false);
      } else if (wasHiddenRef.current) {
        refreshApp();
      }
    }

    function handlePageHide() {
      wasHiddenRef.current = true;
      sendPlayerCommand("pauseVideo");
      setHasStarted(false);
    }

    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) refreshApp();
    }

    window.addEventListener("message", handlePlayerMessage);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("message", handlePlayerMessage);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playStream, sendPlayerCommand]);

  function handlePlayerLoad() {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: "tve-player" }),
      PLAYER_ORIGIN,
    );
    playStream();
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
        onLoad={handlePlayerLoad}
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
