'use client'

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "#/hooks/use-auth"

export function RequireAuth() {
  const { status } = useAuth()
  if (status === "loading") return null
  if (status === "anonymous") return <Navigate to="/login" replace />
  return <Outlet />
}

export function RedirectIfAuth() {
  const { status } = useAuth()
  if (status === "loading") return null
  if (status === "authenticated") return <Navigate to="/admin" replace />
  return <Outlet />
}