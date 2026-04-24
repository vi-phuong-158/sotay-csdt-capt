import { useApp } from './context/AppContext'
import LoginPage from './pages/LoginPage'
import MainApp from './pages/MainApp'

export default function App() {
  const { user } = useApp()
  return user ? <MainApp /> : <LoginPage />
}
