// Web Speech API wrapper for voice input/output

export function isSpeechSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

export function isTTSSupported() {
  return 'speechSynthesis' in window
}

export function startVoiceRecognition(onResult, onError, language = 'en-IN') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser.')
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = language // 'ta-IN' for Tamil, 'en-IN' for English
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event) => {
    onError(event.error)
  }

  recognition.start()
  return recognition
}

export function speak(text, lang = 'en-IN') {
  return
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}