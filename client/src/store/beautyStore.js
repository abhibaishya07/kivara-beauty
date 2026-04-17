import { create } from 'zustand';

/**
 * Global beauty store — drives both the DOM overlays and the R3F scene.
 * GSAP ScrollTrigger writes scrollProgress; useFrame reads it.
 */
const useBeautyStore = create((set, get) => ({
  // ── Scroll ──────────────────────────────────────────────────────────────────
  scrollProgress: 0,   // 0 → 1 (normalized across full page height)
  activeZone: 0,       // 0 | 1 | 2 | 3  (which scroll zone we're in)

  setScrollProgress: (p) => {
    const zone = p < 0.15 ? 0 : p < 0.40 ? 1 : p < 0.75 ? 2 : 3;
    set({ scrollProgress: p, activeZone: zone });
  },

  // ── Mouse ───────────────────────────────────────────────────────────────────
  mouseNorm: { x: 0, y: 0 },     // –1 → 1 in each axis
  setMouseNorm: (x, y) => set({ mouseNorm: { x, y } }),

  // ── UI state ─────────────────────────────────────────────────────────────────
  hoveredCard: null,              // 'skincare' | 'makeup' | null
  setHoveredCard: (card) => set({ hoveredCard: card }),

  // ── AI chat ──────────────────────────────────────────────────────────────────
  chatMessages: [],
  chatLoading: false,
  addMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatLoading: (v) => set({ chatLoading: v }),
}));

export default useBeautyStore;
