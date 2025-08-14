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
    
    // Recarregar frases a cada 10 segundos para detectar mudanças
    const interval = setInterval(() => {
      fetchPhrases()
    }, 10000)

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

  // Velocidade fixa: 140 segundos para o ciclo completo (2x mais lento que antes)
  const animationDuration = 140

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
          {/* Primeira sequência de frases */}
          {phrases.map((phrase, index) => (
            <span key={`first-${phrase.id}`} className="inline-block mr-16">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="inline-block mx-8 text-gray-300">•</span>
              )}
            </span>
          ))}
          
          {/* Segunda sequência de frases (para transição suave) */}
          {phrases.map((phrase, index) => (
            <span key={`second-${phrase.id}`} className="inline-block mr-16">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="inline-block mx-8 text-gray-300">•</span>
              )}
            </span>
          ))}
          
          {/* Terceira sequência de frases (garantir continuidade) */}
          {phrases.map((phrase, index) => (
            <span key={`third-${phrase.id}`} className="inline-block mr-16">
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
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100vw);
          }
        }
        
        .animate-scroll {
          animation-name: scroll;
        }
      `}</style>
    </div>
  )
}
