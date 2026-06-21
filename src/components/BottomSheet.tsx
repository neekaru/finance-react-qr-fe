import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Bottom sheet — slides up from bottom, drag-to-dismiss, scrim backdrop. */
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* sheet */}
          <motion.div
            className="glass-strong fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] no-scrollbar"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            {/* grab handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/25" />
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
