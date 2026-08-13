const STREAM_URL =
  "https://www.youtube-nocookie.com/embed/b4tE5aKhtlg?autoplay=1&playsinline=1&controls=1&rel=0&hl=es";
const YOUTUBE_URL = "https://www.youtube.com/watch?v=b4tE5aKhtlg";

export default function Home() {
  return (
    <main className="tv-app">
      <header className="channel-label" aria-label="Canal en directo">
        <span className="live-dot" aria-hidden="true" />
        <span>Canal 24 Horas</span>
      </header>

      <section className="player-frame" aria-label="Emisión de TVE en directo">
        <iframe
          src={STREAM_URL}
          title="TVE Canal 24 Horas en directo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>

      <footer className="fallback">
        <a href={YOUTUBE_URL}>Si no se ve, tocar aquí</a>
      </footer>
    </main>
  );
}
