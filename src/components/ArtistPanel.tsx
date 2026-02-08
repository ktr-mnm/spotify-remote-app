import ArtistCard from "./ArtistCard";
import VolumeControls from "./VolumeControls";

interface ArtistPanelProps {
  artists: any[] | null;
  artistIndex: number;
  onPrev: () => void;
  onNext: () => void;
  volume: number | null;
  loading: boolean;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onUnmute: () => void;
}

export default function ArtistPanel({
  artists,
  artistIndex,
  onPrev,
  onNext,
  volume,
  loading,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onUnmute,
}: ArtistPanelProps) {
  return (
    <div className="md:flex md:flex-col md:flex-[2] md:min-h-0">
      <div className="hidden md:flex md:flex-col md:shrink-0 w-full">
        {artists?.length ? (
          <ArtistCard
            artist={artists[artistIndex]}
            currentIndex={artistIndex}
            totalCount={artists.length}
            onPrev={onPrev}
            onNext={onNext}
          />
        ) : (
          <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10
                      flex items-center justify-center min-h-[200px]">
            <p className="text-center text-white/60 py-8">
              🎤 再生中の曲はありません
            </p>
          </div>
        )}
      </div>

      <div className="hidden md:block md:flex-1 md:min-h-4" />

      <VolumeControls
        loading={loading}
        volume={volume}
        onVolumeUp={onVolumeUp}
        onVolumeDown={onVolumeDown}
        onMute={onMute}
        onUnmute={onUnmute}
      />
    </div>
  );
}
