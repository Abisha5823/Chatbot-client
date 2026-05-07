import { Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'

import WidgetEmbed from './pages/WidgetEmbed.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
    
      <Route path="/widget" element={<WidgetEmbed />} />
    </Routes>
  )
}