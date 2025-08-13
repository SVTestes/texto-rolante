'use client'

import { useState, useEffect } from 'react'

interface Phrase {
  id: string
  text: string
  order: number
}

interface Settings {
  scrollSpeed: number
}

export default function ScrollingText() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [settings, setSettings] = useState<Settings>({ scrollSpeed: 50 })
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
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
      </div>
    )
  }

  if (phrases.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Nenhuma frase encontrada
          </h2>
          <p className="text-gray-600">
            Adicione frases através do painel administrativo
          </p>
        </div>
      </div>
    )
  }

  // Calculate animation duration based on scroll speed
  const animationDuration = Math.max(20, 100 - settings.scrollSpeed) // 20s to 80s

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="scrolling-container">
        <div 
          className="scrolling-text"
          style={{ 
            animationDuration: `${animationDuration}s`,
            animationTimingFunction: 'linear'
          }}
        >
          {phrases.map((phrase, index) => (
            <span key={phrase.id} className="phrase-item">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="separator">•</span>
              )}
            </span>
          ))}
          {/* Duplicate phrases for seamless loop */}
          {phrases.map((phrase, index) => (
            <span key={`duplicate-${phrase.id}`} className="phrase-item">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="separator">•</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrolling-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: white;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .scrolling-text {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: scroll-left infinite;
          font-size: 2.5rem;
          font-weight: 300;
          color: #1f2937;
          letter-spacing: 0.025em;
        }

        .phrase-item {
          margin-right: 2rem;
          white-space: nowrap;
        }

        .separator {
          margin: 0 1rem;
          color: #d1d5db;
          font-weight: 400;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        /* Responsive adjustments for TV display */
        @media (min-width: 1920px) {
          .scrolling-text {
            font-size: 3rem;
          }
          .scrolling-container {
            height: 150px;
          }
        }

        @media (min-width: 2560px) {
          .scrolling-text {
            font-size: 3.5rem;
          }
          .scrolling-container {
            height: 180px;
          }
        }

        /* Ensure smooth scrolling on all devices */
        .scrolling-text {
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  )
}
