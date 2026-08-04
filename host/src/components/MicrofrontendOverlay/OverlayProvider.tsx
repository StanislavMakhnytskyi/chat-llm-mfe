import React, { useState, useEffect, useCallback, ReactNode } from "react"
import { OverlayContext } from "./OverlayContext"
import { MfeRegistration } from "./types"

interface OverlayProviderProps {
  children: ReactNode
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({
  children,
}) => {
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(true)
  const [registrations, setRegistrations] = useState<
    Record<string, MfeRegistration>
  >({})

  useEffect(() => {
    // Check initial URL params for ?demo
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("demo")) {
      setIsOverlayActive(true)
    }
  }, [])

  const registerMfe = useCallback(
    (registration: Omit<MfeRegistration, "id">) => {
      setRegistrations((prev) => ({
        ...prev,
        [registration.name]: {
          ...registration,
          id: registration.name,
        },
      }))
    },
    []
  )

  const unregisterMfe = useCallback((name: string) => {
    setRegistrations((prev) => {
      const updated = { ...prev }
      delete updated[name]
      return updated
    })
  }, [])

  const updateMfeElement = useCallback(
    (name: string, element: HTMLElement | null) => {
      setRegistrations((prev) => {
        if (!prev[name]) return prev
        return {
          ...prev,
          [name]: {
            ...prev[name],
            element,
          },
        }
      })
    },
    []
  )

  const toggleOverlay = useCallback(() => {
    setIsOverlayActive((prev) => !prev)
  }, [])

  return (
    <OverlayContext.Provider
      value={{
        isOverlayActive,
        toggleOverlay,
        registrations,
        registerMfe,
        unregisterMfe,
        updateMfeElement,
      }}
    >
      {children}
    </OverlayContext.Provider>
  )
}
