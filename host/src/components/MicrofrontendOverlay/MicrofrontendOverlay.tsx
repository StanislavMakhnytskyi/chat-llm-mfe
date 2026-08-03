import React, { useEffect, useState, useRef } from "react"
import { useOverlay } from "./OverlayContext"

export const MicrofrontendOverlay: React.FC = () => {
  const { isOverlayActive, toggleOverlay, registrations } = useOverlay()
  const [rects, setRects] = useState<Record<string, DOMRect>>({})
  const rectsRef = useRef<Record<string, DOMRect>>({})

  useEffect(() => {
    if (!isOverlayActive) return

    let rafId: number

    const updatePositions = () => {
      let hasChanges = false
      const newRects = { ...rectsRef.current }

      Object.values(registrations).forEach((reg) => {
        if (reg.element) {
          // Retrieve the actual remote element rather than the display:contents wrapper
          const targetElement = (reg.element.firstElementChild ||
            reg.element) as HTMLElement
          const rect = targetElement.getBoundingClientRect()
          const prev = newRects[reg.id]

          if (
            !prev ||
            prev.x !== rect.x ||
            prev.y !== rect.y ||
            prev.width !== rect.width ||
            prev.height !== rect.height
          ) {
            newRects[reg.id] = rect
            hasChanges = true
          }
        }
      })

      if (hasChanges) {
        rectsRef.current = newRects
        setRects(newRects)
      }

      rafId = requestAnimationFrame(updatePositions)
    }

    rafId = requestAnimationFrame(updatePositions)

    const resizeObserver = new ResizeObserver(() => {
      // Observer triggers layout reads if needed, rAF handles the animation frame
    })

    Object.values(registrations).forEach((reg) => {
      if (reg.element && reg.element.firstElementChild) {
        resizeObserver.observe(reg.element.firstElementChild)
      }
    })

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
    }
  }, [isOverlayActive, registrations])

  const getThemeColors = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("sidebar")) {
      return {
        border: "border-blue-500",
        bg: "bg-blue-500/10",
        badge: "bg-blue-600",
        text: "text-blue-400",
      }
    }
    if (lowerName.includes("chat")) {
      return {
        border: "border-green-500",
        bg: "bg-green-500/10",
        badge: "bg-green-600",
        text: "text-green-400",
      }
    }
    return {
      border: "border-gray-500",
      bg: "bg-gray-500/10",
      badge: "bg-gray-600",
      text: "text-gray-400",
    }
  }

  return (
    <>
      {/* Persistent Toggle Button */}
      <button
        onClick={toggleOverlay}
        className="fixed top-6 right-6 z-[10000] bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-slate-200 px-4 py-2 rounded-full shadow-2xl border border-slate-700 transition-all duration-200 flex items-center gap-3 font-mono text-sm pointer-events-auto"
        title="Toggle Microfrontend Overlay (Ctrl+Shift+M)"
      >
        <span
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            isOverlayActive
              ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"
              : "bg-slate-500"
          }`}
        ></span>
        {isOverlayActive ? "Demo Mode: ON" : "Demo Mode: OFF"}
      </button>

      {/* Main Overlay Contents */}
      {isOverlayActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Render boundaries */}
          {Object.values(registrations).map((reg) => {
            const rect = rects[reg.id]
            if (!rect) return null

            const theme = getThemeColors(reg.name)

            return (
              <div
                key={reg.id}
                className={`absolute rounded-xl border-2 border-dashed ${theme.border} ${theme.bg} animate-in fade-in duration-500`}
                style={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                }}
              >
                {/* Floating Info Card */}
                <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-xl p-4 w-80 font-sans pointer-events-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      {reg.name}
                    </h3>
                    <span
                      className={`text-[10px] font-black tracking-wider px-2 py-1 rounded text-white ${theme.badge}`}
                    >
                      REMOTE
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team</span>
                      <span className="text-white font-medium">{reg.team}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Technology</span>
                      <span className="text-white font-medium">
                        {reg.technology}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 pt-1">
                      <span className="text-slate-400">Deployment</span>
                      <span className="text-white font-medium flex items-center gap-2">
                        <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[12px] font-bold border border-green-500/30">
                          Independent
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 pt-1">
                      <span className="text-slate-400">State</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          Shared Zustand Store
                        </span>
                        <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-500/30">
                          Sync
                        </span>
                      </div>
                    </div>

                    {reg.description && (
                      <div className="pt-3 mt-3 border-t border-slate-700/50">
                        <span className="text-slate-300 italic">
                          "{reg.description}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
