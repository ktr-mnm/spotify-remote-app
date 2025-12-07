import { useEffect, useState } from "react";
import { spotifyGet } from "../api/spotifyFetch";

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState<number | null>(null);

  useEffect(() => {

    const interval = setInterval(async () => {
      const res = await spotifyGet("https://api.spotify.com/v1/me/player");

      if (!res) {
        setTrack(null);
        setVolume(null);
        return;
      }

      if (res?.item) {
        setTrack(res.item);
      }
      if (res?.device?.volume_percent !== undefined) {
        setVolume(res.device.volume_percent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!track) return <p className="text-white/80 text-center mt-4">再生中の曲はありません</p>;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 rounded-xl shadow-lg max-w-sm mx-auto mt-6">
      <p className="mb-4 text-xl font-semibold text-white/90">
        Current Volume: {volume!== null ? volume: "No device"}
      </p>
      <img
        src={track.album.images[0]?.url}
        alt={track.name}
        className="w-48 h-48 rounded-lg shadow-md mb-4"
      />
      <h2 className="text-white text-xl font-bold text-center">{track.name}</h2>
      <p className="text-white/80 text-center mt-1">
        {track.artists.map(a => a.name).join(", ")}
      </p>
    </div>
  );
}
