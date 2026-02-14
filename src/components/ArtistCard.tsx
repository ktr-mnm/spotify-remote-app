import { motion } from "framer-motion";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  followers: { total: number };
  external_urls?: { spotify: string };
}

interface ArtistCardProps {
  artist: Artist;
  currentIndex?: number;
  totalCount?: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function ArtistCard({ artist, currentIndex = 0, totalCount = 1, onPrev, onNext }: ArtistCardProps) {
  const showNav = totalCount > 1 && onPrev != null && onNext != null;

  return (
    <motion.div
      className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🖼 Artist Image with Navigation */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {/* ◀ Prev Button */}
        {showNav && (
          <motion.button
            type="button"
            onClick={onPrev}
            disabled={currentIndex <= 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/90
                      hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none
                      text-sm font-bold border border-white/10 transition-all"
          >
            ◀
          </motion.button>
        )}

        <img
          src={artist.images[0]?.url}
          alt={artist.name}
          className="w-28 h-28 rounded-full object-cover shadow-xl border border-white/10"
        />

        {/* Next ▶ Button */}
        {showNav && (
          <motion.button
            type="button"
            onClick={onNext}
            disabled={currentIndex >= totalCount - 1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/90
                      hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none
                      text-sm font-bold border border-white/10 transition-all"
          >
            ▶
          </motion.button>
        )}
      </div>

      {/* カウンター表示 */}
      {showNav && (
        <div className="text-center mb-2">
          <span className="text-white/60 text-xs tabular-nums">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      )}

      {/* 🎤 Name */}
      <h3 className="text-white text-xl font-semibold text-center mt-4">
        {artist.name}
      </h3>

      {/* 🏷 Genres */}
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {artist.genres?.slice(0, 3).map((genre) => (
          <span
            key={genre}
            className="px-3 py-1 text-xs rounded-full
                      bg-white/10 text-white/80 border border-white/10"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* 👥 Followers（メイン表示） */}
      <div className="mt-5 text-center">
        <div className="text-3xl font-bold text-white tabular-nums">
          {artist.followers.total >= 1_000_000
            ? `${(artist.followers.total / 1_000_000).toFixed(1)}M`
            : artist.followers.total >= 1_000
              ? `${(artist.followers.total / 1_000).toFixed(1)}K`
              : artist.followers.total.toLocaleString()}
        </div>
        <div className="text-white/60 text-sm mt-1">followers</div>
      </div>

      {/* 🔗 Open in Spotify */}
      {artist.external_urls?.spotify && (
        <motion.a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-[#1DB954] text-white text-sm font-semibold
                    hover:bg-[#1ed760] transition-colors"
        >
          Open in Spotify
        </motion.a>
      )}
    </motion.div>
  );
}
