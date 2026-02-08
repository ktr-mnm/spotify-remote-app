import { useEffect, useRef, useState } from "react";
import NowPlaying from "./NowPlaying";
import { spotifyCmd, spotifyGet, setLogger } from "../api/spotifyFetch";
import ArtistPanel from "./ArtistPanel";
import StatusPanel from "./StatusPanel";
import LogoutButton from "./LogoutButton";
import type { LogItem } from "../types";

const MAX_LOGS = 100;

export default function MainUI() {
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState<number | null>(null);
  const [lastVolume, setLastVolume] = useState<number>(10);
  const lastLocalVolumeChange = useRef<number>(0);
  const [artists, setArtists] = useState<any[] | null>(null);
  const [artistIndex, setArtistIndex] = useState(0);
  const [logs, setLogs] = useState<LogItem[]>([]);

  const addLog = (message: string, type: LogItem["type"] = "info") => {
    setLogs((prev) => {
      const next = [
        ...prev,
        {
          id: Date.now() + Math.random(),
          message,
          type,
          time: new Date().toLocaleTimeString(),
        },
      ];
      if (next.length > MAX_LOGS) {
        return next.slice(next.length - MAX_LOGS);
      }
      return next;
    });
  };

  useEffect(() => {
    if (artists?.length) setArtistIndex(0);
  }, [artists]);

  useEffect(() => {
    setLogger(addLog);
    const fetchVolume = async () => {
      try {
        addLog("Fetching current volume...");
        const state = await spotifyGet("https://api.spotify.com/v1/me/player");
        if (state?.device?.volume_percent !== undefined) {
          setVolume(state.device.volume_percent);
          addLog(`Volume synced: ${state.device.volume_percent}%`, "success");
        }
      } catch {
        addLog("Failed to fetch volume", "error");
        console.warn("音量取得失敗");
      }
    };
    fetchVolume();
  }, []);

  const setSpotifyVolume = async (newVolume: number) => {
    setLoading(true);
    try {
      lastLocalVolumeChange.current = Date.now();
      addLog(`Setting volume to ${newVolume}%...`);
      await spotifyCmd(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`,
        { method: "PUT" }
      );
      setVolume(newVolume);
      addLog(`Volume set to ${newVolume}%`, "success");
    } catch {
      addLog("Volume change failed", "error");
      alert("音量変更失敗！");
    } finally {
      setLoading(false);
    }
  };

  const volumeUp = () => {
    if (volume === null) return;
    setSpotifyVolume(Math.min(100, volume + 1));
  };

  const volumeDown = () => {
    if (volume === null) return;
    setSpotifyVolume(Math.max(0, volume - 1));
  };

  const mute = () => {
    if (volume === null) return;
    setLastVolume(volume > 0 ? volume : lastVolume);
    addLog("Muted audio");
    setSpotifyVolume(0);
  };

  const unmute = () => {
    addLog("Unmuted audio");
    setSpotifyVolume(lastVolume || 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white
                    flex flex-col items-center px-4 pt-8 pb-16 overflow-hidden">

      <div className="w-full max-w-[1600px] mx-auto
                    flex flex-col md:flex-row md:items-stretch md:justify-center gap-10 md:gap-x-15 md:max-h-[600px]">

        <div className="w-full md:flex-[3] md:min-h-0">
          <NowPlaying
            volume={volume}
            setVolume={setVolume}
            lastLocalVolumeChange={lastLocalVolumeChange}
            addLog={addLog}
            setArtists={setArtists}
          />
        </div>

        <ArtistPanel
          artists={artists}
          artistIndex={artistIndex}
          onPrev={() => setArtistIndex((i) => Math.max(0, i - 1))}
          onNext={() => setArtistIndex((i) => Math.min(Math.max(0, (artists?.length ?? 1) - 1), i + 1))}
          volume={volume}
          loading={loading}
          onVolumeUp={volumeUp}
          onVolumeDown={volumeDown}
          onMute={mute}
          onUnmute={unmute}
        />

        <StatusPanel logs={logs} />
      </div>

      <LogoutButton />
    </div>
  );
}
