import React, { useEffect, useState, useRef } from "react"
import { useOverlay } from "./OverlayContext"
import { cva } from "class-variance-authority"

const indicatorVariants = cva("w-2.5 h-2.5 rounded-full transition-colors", {
  variants: {
    active: {
      true: "bg-emerald-500",
      false: "bg-slate-300",
    },
  },
})

const overlayBoxVariants = cva(
  "absolute rounded-2xl border-2 border-dashed animate-in fade-in duration-500",
  {
    variants: {
      theme: {
        sidebar: "border-indigo-400 bg-indigo-400/5",
        chat: "border-emerald-400 bg-emerald-400/5",
        default: "border-slate-400 bg-slate-400/5",
      },
    },
    defaultVariants: {
      theme: "default",
    },
  }
)

const badgeVariants = cva(
  "text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full text-white",
  {
    variants: {
      theme: {
        sidebar: "bg-indigo-500",
        chat: "bg-emerald-500",
        default: "bg-slate-500",
      },
    },
    defaultVariants: {
      theme: "default",
    },
  }
)

const dotVariants = cva("w-2 h-2 rounded-full", {
  variants: {
    theme: {
      sidebar: "bg-indigo-500",
      chat: "bg-emerald-500",
      default: "bg-slate-500",
    },
  },
  defaultVariants: {
    theme: "default",
  },
})

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
        className="fixed top-6 right-6 z-[10000] bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-200 transition-all duration-200 flex items-center gap-3 font-medium text-sm pointer-events-auto cursor-pointer"
        title="Toggle Microfrontend Overlay (Ctrl+Shift+M)"
      >
        <span className={indicatorVariants({ active: isOverlayActive })}></span>
        {isOverlayActive ? "Explain this layout: ON" : "Explain this layout"}
      </button>

      {isOverlayActive && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden animate-in fade-in duration-300">
          {/* One-line explainer so the concept reads instantly, not just the boxes */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-md rounded-full px-4 py-2 text-sm text-slate-600 pointer-events-auto">
            Each dashed box below is a{" "}
            <span className="font-semibold text-slate-900">separate app</span>,
            built and shipped on its own, stitched together on this page
          </div>

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
                <div className="absolute top-4 left-4 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-80 font-sans pointer-events-auto">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                      <span className={dotVariants({ theme })}></span>
                      {reg.name}
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Built by</span>
                      <span className="text-slate-700 font-medium">
                        {reg.team}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Built with</span>
                      <span className="text-slate-700 font-medium">
                        {reg.technology}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Ships on its own?</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200">
                        Yes, independently
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">
                        Talks to other apps via
                      </span>
                      <span className="text-slate-700 font-medium">
                        Shared Zustand store
                      </span>
                    </div>

                    {reg.description && (
                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <span className="text-slate-500 italic leading-relaxed">
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
