import FloatingWidget from '../components/FloatingWidget.jsx'

// This page is used to embed the widget via iframe
// Add to any website: <script src="https://yourdomain.com/widget.js"></script>
export default function WidgetEmbed() {
  return (
    <div className="min-h-screen bg-transparent">
      <FloatingWidget />
    </div>
  )
}