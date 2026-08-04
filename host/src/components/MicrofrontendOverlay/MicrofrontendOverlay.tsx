import React, { useEffect, useState, useRef } from "react"
import { useOverlay } from "./OverlayContext"
import { cva } from "class-variance-authority"

const indicatorVariants = cva("w-2.5 h-2.5 rounded-full transition-colors", {
  variants: {
    active: {
      true: "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]",
      false: "bg-slate-500",
    },
  },
})

const overlayBoxVariants = cva(
  "absolute rounded-xl border-2 border-dashed animate-in fade-in duration-500",
  {
    variants: {
      theme: {
        sidebar: "border-blue-500 bg-blue-500/10",
        chat: "border-green-500 bg-green-500/10",
        default: "border-gray-500 bg-gray-500/10",
      },
    },
    defaultVariants: {
      theme: "default",
    },
  }
)

const badgeVariants = cva(
  "text-[10px] font-black tracking-wider px-2 py-1 rounded text-white",
  {
    variants: {
      theme: {
        sidebar: "bg-blue-600",
        chat: "bg-green-600",
        default: "bg-gray-600",
      },
    },
    defaultVariants: {
      theme: "default",
    },
  }
)

type ThemeType = "sidebar" | "chat" | "default"
const getThemeVariant = (name: string): ThemeType => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("sidebar")) return "sidebar"
  if (lowerName.includes("chat")) return "chat"
  return "default"
}

export const MicrofrontendOverlay: React.FC = () => {
  const { isOverlayActive, toggleOverlay, registrations } = useOverlay()

  const [rects, setRects] = useState<
    Record<string, { top: number; left: number; width: number; height: number }>
  >({})
  const rectsRef = useRef<
    Record<string, { top: number; left: number; width: number; height: number }>
  >({})

  useEffect(() => {
    if (!isOverlayActive) return

    let rafId: number

    const updatePositions = () => {
      let hasChanges = false
      const newRects = { ...rectsRef.current }

      Object.values(registrations).forEach((reg) => {
        if (reg.element) {
          const targetElement = (reg.element.firstElementChild ||
            reg.element) as HTMLElement
          const rawRect = targetElement.getBoundingClientRect()

          const rect = {
            top: Math.round(rawRect.top),
            left: Math.round(rawRect.left),
            width: Math.round(rawRect.width),
            height: Math.round(rawRect.height),
          }

          const prev = newRects[reg.id]

          if (
            !prev ||
            prev.left !== rect.left ||
            prev.top !== rect.top ||
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

    const resizeObserver = new ResizeObserver(() => {})

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

  return (
    <>
      <button
        onClick={toggleOverlay}
        className="fixed top-6 right-6 z-[10000] bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-slate-200 px-4 py-2 rounded-full shadow-2xl border border-slate-700 transition-all duration-200 flex items-center gap-3 font-mono text-sm pointer-events-auto cursor-pointer"
        title="Toggle Microfrontend Overlay (Ctrl+Shift+M)"
      >
        <span className={indicatorVariants({ active: isOverlayActive })}></span>
        {isOverlayActive ? "Demo Mode: ON" : "Demo Mode: OFF"}
      </button>

      {isOverlayActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {Object.values(registrations).map((reg) => {
            const rect = rects[reg.id]
            if (!rect) return null

            const theme = getThemeVariant(reg.name)

            return (
              <div
                key={reg.id}
                className={overlayBoxVariants({ theme })}
                style={{
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                }}
              >
                <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-xl p-4 w-80 font-sans pointer-events-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      {reg.name}
                    </h3>
                    <span className={badgeVariants({ theme })}>REMOTE</span>
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
                      </div>
                    </div>

                    {reg.description && (
                      <div className="pt-3 mt-3 border-t border-slate-700/50">
                        <span className="text-slate-300 italic">
                          {reg.description}
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
