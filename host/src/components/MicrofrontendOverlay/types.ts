import { ReactNode } from "react"

export interface MfeRegistration {
  id: string
  name: string
  team: string
  technology: string
  description?: string
  element: HTMLElement | null
}

export interface MfeBoundaryProps {
  name: string
  team: string
  technology: string
  description?: string
  children: ReactNode
}

export interface OverlayContextState {
  isOverlayActive: boolean
  toggleOverlay: () => void
  registrations: Record<string, MfeRegistration>
  registerMfe: (registration: Omit<MfeRegistration, "id">) => void
  unregisterMfe: (name: string) => void
  updateMfeElement: (name: string, element: HTMLElement | null) => void
}
