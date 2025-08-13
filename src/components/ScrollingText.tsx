'use client'

import { useState, useEffect } from 'react'

interface Phrase {
  id: string
  text: string
  order: number
}

interface Settings {
  scrollspeed: number
}

export default function ScrollingText() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [settings, setSettings] = useState<Settings>({ scrollspeed: 50 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [phrasesResponse, settingsResponse] = await Promise.all([
        fetch('/api/public/phrases'),
        fetch('/api/public/settings')
      ])

      if (phrasesResponse.ok) {
        const phrasesData = await phrasesResponse.json()
        setPhrases(phrasesData)
      }

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setSettings(settingsData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (phrases.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-gray-600">Nenhuma frase configurada</div>
      </div>
    )
  }

  // Calcular a duração da animação baseada na velocidade
  const animationDuration = Math.max(20, 100 - settings.scrollspeed) // 20s a 100s

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="relative h-screen flex items-center">
        <div 
          className="whitespace-nowrap text-4xl md:text-6xl lg:text-8xl font-bold text-gray-800 animate-scroll"
          style={{
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        >
          {phrases.map((phrase, index) => (
            <span key={phrase.id} className="inline-block mr-16">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="inline-block mx-8 text-gray-300">•</span>
              )}
            </span>
          ))}
          {/* Duplicar frases para criar loop contínuo */}
          {phrases.map((phrase, index) => (
            <span key={`${phrase.id}-duplicate`} className="inline-block mr-16">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="inline-block mx-8 text-gray-300">•</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation-name: scroll;
        }
      `}</style>
    </div>
  )
}
