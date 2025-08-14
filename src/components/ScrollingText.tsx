'use client'

import { useState, useEffect, useCallback } from 'react'

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
  const [settings, setSettings] = useState<Settings>({ scrollspeed: 1 })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = useCallback(async () => {
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
        console.log('🔄 Display - Novas configurações carregadas:', settingsData)
        setSettings(settingsData)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/public/settings')
      if (response.ok) {
        const settingsData = await response.json()
        console.log('🔄 Display - Verificando configurações:', settingsData)
        
        // Só atualiza se a velocidade realmente mudou
        if (settingsData.scrollspeed !== settings.scrollspeed) {
          console.log('🎯 Display - Velocidade mudou de', settings.scrollspeed, 'para', settingsData.scrollspeed)
          setSettings(settingsData)
          setLastUpdate(new Date())
        }
      }
    } catch (error) {
      console.error('Erro ao verificar configurações:', error)
    }
  }, [settings.scrollspeed])

  const forceRefresh = useCallback(() => {
    console.log('🔄 Display - Forçando refresh manual')
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
    
    // Recarregar configurações a cada 3 segundos para detectar mudanças
    const interval = setInterval(() => {
      fetchSettings()
    }, 3000)

    return () => clearInterval(interval)
  }, [fetchData, fetchSettings])

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
  // Agora com valores muito menores: 0.1 = muito lento, 10 = muito rápido
  // Fórmula: velocidade menor = duração maior (mais lento)
  const animationDuration = Math.max(30, 120 - (settings.scrollspeed * 10)) // 30s a 110s
  
  console.log('🎬 Display - Velocidade atual:', settings.scrollspeed, 'Duração:', animationDuration, 'Última atualização:', lastUpdate.toLocaleTimeString())

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Botão de refresh manual (visível apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={forceRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      )}
      
      {/* Indicador de status */}
      <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 px-3 py-2 rounded-md text-sm text-gray-600">
        <div>Velocidade: <strong>{settings.scrollspeed}</strong></div>
        <div>Duração: <strong>{animationDuration}s</strong></div>
        <div>Atualizado: <strong>{lastUpdate.toLocaleTimeString()}</strong></div>
      </div>

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
