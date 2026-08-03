import { createContext, useContext } from "react"
import { OverlayContextState } from "./types"

export const OverlayContext = createContext<OverlayContextState | null>(null)

export const useOverlay = (): OverlayContextState => {
  const context = useContext(OverlayContext)
  if (!context) {
    throw new Error("useOverlay must be used within an OverlayProvider")
  }
  return context
}
