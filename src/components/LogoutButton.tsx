import { motion } from "framer-motion";
import { logout } from "../api/spotifyFetch";
import { useState, useRef } from "react";

export default function LogoutButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    // 既存のタイマーをクリア
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (tapCount === 0) {
      // 1回目のタップ → ボタンを展開
      setTapCount(1);
      setIsExpanded(true);

      // 3秒以内に2回目がなければリセット
      resetTimerRef.current = setTimeout(() => {
        setTapCount(0);
        setIsExpanded(false);
      }, 3000);
    } else if (tapCount === 1) {
      // 2回目のタップ → ログアウト実行
      setTapCount(0);
      setIsExpanded(false);
      logout();
    }
  };

  const handleMouseEnter = () => {
    // デスクトップのホバー用（タップ以外の時のヒント）
    if (tapCount === 0) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    // デスクトップのホバー終了時（タップ状態でなければ閉じる）
    if (tapCount === 0) {
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 left-0 right-0 flex justify-center z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* 点（非展開時のみ表示） */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-red-400/40"
        initial={{ opacity: 1, scale: 1 }}
        animate={isExpanded ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* ボタンコンテナ */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative flex items-center gap-2 px-4 py-2 rounded-full
                  text-red-400/60 transition-colors duration-200
                  group outline-none"
      >
        {/* 背景装飾 */}
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/10 border border-red-400/30 -z-10"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={
            isExpanded
              ? { opacity: 1, scale: 1 } 
              : { opacity: 0, scale: 0.3 }
          }
          transition={{ 
            duration: 0.4, 
            type: "spring", 
            stiffness: 250, 
            damping: 30 
          }}
        />

        {/* グロー背景 */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-red-400/10 to-transparent blur-lg -z-10"
          initial={{ opacity: 0 }}
          animate={isExpanded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* テキスト */}
        <motion.span
          className="text-sm font-medium overflow-hidden whitespace-nowrap"
          initial={{ width: 0, opacity: 0 }}
          animate={isExpanded ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: isExpanded ? 0.05 : 0 
          }}
        >
          {tapCount === 1 ? "Confirm logout?" : "Sign out"}
        </motion.span>

        {/* アイコン */}
        <motion.span
          className="text-lg shrink-0"
          initial={{ opacity: 0.4 }}
          animate={isExpanded ? { opacity: 1 } : { opacity: 0.4 }}
          transition={{ duration: 0.2 }}
        >
          ⎋
        </motion.span>
      </motion.button>

      {/* 確認カウントダウン表示（オプション） */}
      {tapCount === 1 && (
        <motion.div
          className="absolute top-full mt-2 text-xs text-red-400/60 whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Tap again to logout
        </motion.div>
      )}
    </motion.div>
  );
}
