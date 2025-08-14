'use client'

import { useState, useEffect } from 'react'

interface Phrase {
  id: string
  text: string
  order: number
}

export default function ScrollingText() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhrases()
    
    // Recarregar frases a cada 10 minutos (600.000ms)
    const interval = setInterval(() => {
      fetchPhrases()
    }, 600000)

    return () => clearInterval(interval)
  }, [])

  const fetchPhrases = async () => {
    try {
      const response = await fetch('/api/public/phrases')
      if (response.ok) {
        const phrasesData = await response.json()
        setPhrases(phrasesData)
      }
    } catch (error) {
      console.error('Erro ao carregar frases:', error)
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

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="relative h-screen flex items-center">
        <div className="scrolling-text-container">
          <div className="scrolling-text">
            {/* Primeira sequência */}
            {phrases.map((phrase, index) => (
              <span key={`first-${phrase.id}`} className="phrase">
                {phrase.text}
                {index < phrases.length - 1 && (
                  <span className="separator">•</span>
                )}
              </span>
            ))}
            
            {/* Segunda sequência (para loop perfeito) */}
            {phrases.map((phrase, index) => (
              <span key={`second-${phrase.id}`} className="phrase">
                {phrase.text}
                {index < phrases.length - 1 && (
                  <span className="separator">•</span>
                )}
              </span>
            ))}
            
            {/* Terceira sequência (garantir continuidade) */}
            {phrases.map((phrase, index) => (
              <span key={`third-${phrase.id}`} className="phrase">
                {phrase.text}
                {index < phrases.length - 1 && (
                  <span className="separator">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrolling-text-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .scrolling-text {
          display: inline-block;
          white-space: nowrap;
          animation: scroll 150s linear infinite;
          font-size: 4rem;
          font-weight: bold;
          color: #1f2937;
        }
        
        .phrase {
          display: inline-block;
          margin-right: 4rem;
        }
        
        .separator {
          display: inline-block;
          margin: 0 2rem;
          color: #d1d5db;
          font-weight: normal;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        /* Responsividade para diferentes tamanhos de tela */
        @media (max-width: 768px) {
          .scrolling-text {
            font-size: 2.5rem;
          }
          .phrase {
            margin-right: 2rem;
          }
          .separator {
            margin: 0 1rem;
          }
        }
        
        @media (min-width: 1024px) {
          .scrolling-text {
            font-size: 6rem;
          }
          .phrase {
            margin-right: 6rem;
          }
          .separator {
            margin: 0 3rem;
          }
        }
        
        @media (min-width: 1440px) {
          .scrolling-text {
            font-size: 8rem;
          }
          .phrase {
            margin-right: 8rem;
          }
          .separator {
            margin: 0 4rem;
          }
        }
      `}</style>
    </div>
  )
}
