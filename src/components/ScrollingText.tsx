'use client'

import { useState, useEffect, useRef } from 'react'

interface Phrase {
  id: string
  text: string
  order: number
}

export default function ScrollingText() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    fetchPhrases()
    
    // Recarregar frases a cada 10 segundos para detectar mudanças
    const interval = setInterval(() => {
      fetchPhrases()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (phrases.length === 0 || !containerRef.current) return

    const container = containerRef.current
    const textElement = container.querySelector('.scrolling-text') as HTMLElement
    if (!textElement) return

    // Reset position
    textElement.style.transform = 'translateX(100%)'
    
    // Velocidade: 90 segundos para o ciclo completo (um pouco mais lento)
    const totalDuration = 90
    
    // Calcular pixels por segundo para movimento real
    const textWidth = textElement.scrollWidth
    const containerWidth = container.clientWidth
    const totalDistance = textWidth + containerWidth // Da direita até sair pela esquerda
    const pixelsPerSecond = totalDistance / totalDuration

    let startTime: number | null = null
    let currentPosition = containerWidth // Começa da direita

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      
      const elapsed = timestamp - startTime
      const elapsedSeconds = elapsed / 1000
      
      // Calcular nova posição
      currentPosition = containerWidth - (elapsedSeconds * pixelsPerSecond)
      
      // Aplicar transformação
      textElement.style.transform = `translateX(${currentPosition}px)`
      
      // Verificar se precisa reiniciar (quando a primeira frase da sequência sair completamente)
      if (currentPosition < -(textWidth / 5)) { // textWidth / 5 = largura de uma sequência
        // Reiniciar animação
        startTime = timestamp
        currentPosition = containerWidth
        textElement.style.transform = `translateX(${currentPosition}px)`
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [phrases])

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
      <div ref={containerRef} className="relative h-screen flex items-center">
        <div className="scrolling-text whitespace-nowrap text-4xl md:text-6xl lg:text-8xl font-bold text-gray-800">
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
          
          {/* Quarta sequência de frases (loop perfeito) */}
          {phrases.map((phrase, index) => (
            <span key={`fourth-${phrase.id}`} className="inline-block mr-16">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="inline-block mx-8 text-gray-300">•</span>
              )}
            </span>
          ))}
          
          {/* Quinta sequência de frases (continuidade infinita) */}
          {phrases.map((phrase, index) => (
            <span key={`fifth-${phrase.id}`} className="inline-block mr-16">
              {phrase.text}
              {index < phrases.length - 1 && (
                <span className="inline-block mx-8 text-gray-300">•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
