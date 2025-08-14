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
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)

  useEffect(() => {
    fetchPhrases()
    
    // Recarregar frases a cada 10 segundos para detectar mudanças
    const interval = setInterval(() => {
      fetchPhrases()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phrases.length === 0) return

    // Timer para cada frase: 10 segundos por frase
    const timer = setTimeout(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
    }, 10000)

    return () => clearTimeout(timer)
  }, [currentPhraseIndex, phrases.length])

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

  const currentPhrase = phrases[currentPhraseIndex]
  const nextPhraseIndex = (currentPhraseIndex + 1) % phrases.length
  const nextPhrase = phrases[nextPhraseIndex]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="relative h-screen flex items-center justify-center">
        {/* Frase atual */}
        <div className="text-center">
          <div className="text-4xl md:text-6xl lg:text-8xl font-bold text-gray-800 mb-8">
            {currentPhrase.text}
          </div>
          
          {/* Indicador de progresso */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-1000 ease-linear"
              style={{ width: '100%' }}
            />
          </div>
          
          {/* Informações da frase */}
          <div className="mt-4 text-lg text-gray-600">
            Frase {currentPhraseIndex + 1} de {phrases.length}
          </div>
          
          {/* Próxima frase (pequena) */}
          {phrases.length > 1 && (
            <div className="mt-8 text-xl text-gray-400">
              Próxima: {nextPhrase.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
