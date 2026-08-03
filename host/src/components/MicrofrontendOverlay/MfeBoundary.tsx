import React, { useEffect, useRef } from "react"
import { useOverlay } from "./OverlayContext"
import { MfeBoundaryProps } from "./types"

export const MfeBoundary: React.FC<MfeBoundaryProps> = ({
  name,
  team,
  technology,
  description,
  children,
}) => {
  const { registerMfe, unregisterMfe, updateMfeElement } = useOverlay()
  const boundaryRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    registerMfe({
      name,
      team,
      technology,
      description,
      element: boundaryRef.current,
    })

    return () => {
      unregisterMfe(name)
    }
  }, [name, team, technology, description, registerMfe, unregisterMfe])

  useEffect(() => {
    // Keep reference updated in case of re-mounts
    if (boundaryRef.current) {
      updateMfeElement(name, boundaryRef.current)
    }
  }, [name, updateMfeElement])

  return (
    // display: contents ensures this wrapper div doesn't impact any layout (Grid/Flexbox) of the host application
    <div ref={boundaryRef} style={{ display: "contents" }}>
      {children}
    </div>
  )
}
