import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"

export function DashboardPage() {
  const { setTitle } = useOutletContext()

  useEffect(() => {
    setTitle("Visão geral")
  }, [setTitle])

  return (
    <div>
    </div>
  )
}
