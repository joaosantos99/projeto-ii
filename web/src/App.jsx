import { Routes, Route } from "react-router-dom"
import { LoginPage } from "#/pages/login"
import { RecuperarPage } from "#/pages/recuperar-password"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-password" element={<RecuperarPage />} />
    </Routes>
  )
}

export default App
