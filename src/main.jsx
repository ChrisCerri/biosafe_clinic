import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import Dashboard from "./pages/Dashboard"
import Reparti from "./pages/Reparti"
import Allarmi from "./pages/Allarmi"
import Storico from "./pages/Storico"
import Report from "./pages/Report"
import "./index.css"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Navigate to="/" replace /> },
      { path: "reparto", element: <Navigate to="/reparti" replace /> },
      { path: "reparti", element: <Reparti /> },
      { path: "allarmi", element: <Allarmi /> },
      { path: "storico", element: <Storico /> },
      { path: "report", element: <Report /> },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
