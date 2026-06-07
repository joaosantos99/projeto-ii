'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { api } from "#/lib/api"
import { deleteCookie, getCookie, setCookie } from "#/lib/cookies"

const SESSION_MAX_AGE = 7 * 24 * 60 * 60
const isBrowser = typeof window !== "undefined"
const AuthContext = createContext(null)

function readCachedUser() {
  if (!isBrowser) return null
  const raw = localStorage.getItem("user")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * True when a JWT's `exp` claim is in the past. Lets us drop an expired session
 * up front instead of waiting for the server to reject it on /users/me. Returns
 * false on any decode failure — let the server be the authority in that case.
 */
function isTokenExpired(token) {
  try {
    const payload = token.split(".")[1]
    if (!payload) return false
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return typeof claims.exp === "number" && claims.exp * 1000 <= Date.now()
  } catch {
    return false
  }
}

export function AuthProvider({ children, initialUser = null, initialStatus = null }) {
  const [token, setToken] = useState(() => (isBrowser ? getCookie("token") : null))
  const [user, setUser] = useState(() => initialUser ?? readCachedUser())
  const [status, setStatus] = useState(() => {
    if (initialStatus) return initialStatus
    if (!isBrowser) return "anonymous"
    return getCookie("token") ? "loading" : "anonymous"
  })

  const clearSession = useCallback(() => {
    deleteCookie("token")
    if (isBrowser) localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    setStatus("anonymous")
  }, [])

  const updateUser = useCallback((partial) => {
    setUser((current) => {
      const next = { ...(current ?? {}), ...partial }
      if (isBrowser) localStorage.setItem("user", JSON.stringify(next))
      return next
    })
  }, [])

  const login = useCallback((nextToken, nextUser) => {
    setCookie("token", nextToken, SESSION_MAX_AGE)
    if (isBrowser) localStorage.setItem("user", JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
    setStatus("authenticated")
  }, [])

  useEffect(() => {
    if (!isBrowser) return
    if (!token) return
    // An expired token is rejected up front — no need to ask the server.
    if (isTokenExpired(token)) {
      clearSession()
      return
    }
    if (status === "authenticated" && user) return
    let cancelled = false
    setStatus("loading")
    api
      .get("/users/me")
      .then(({ data }) => {
        if (cancelled) return
        localStorage.setItem("user", JSON.stringify(data))
        setUser(data)
        setStatus("authenticated")
      })
      .catch((err) => {
        if (cancelled) return
        if (err.response?.status === 401) {
          clearSession()
        } else {
          setStatus("authenticated")
        }
      })
    return () => {
      cancelled = true
    }
  }, [token, status, user, clearSession])

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      updateUser,
      logout: clearSession,
    }),
    [token, user, status, login, updateUser, clearSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}