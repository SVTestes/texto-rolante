'use client'

import { useState, useEffect } from 'react'
import { Save, Play, Zap, Snail } from 'lucide-react'

interface Settings {
  id: string
  scrollspeed: number
  updatedat: string
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [scrollspeed, setScrollspeed] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setScrollspeed(data.scrollspeed)
      } else {
        setError('Erro ao carregar configurações')
      }
    } catch (error) {
      setError('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scrollspeed }),
      })

      if (response.ok) {
        const updatedSettings = await response.json()
        setSettings(updatedSettings)
        setMessage(`✅ Configurações salvas! Velocidade: ${scrollspeed}`)
        setTimeout(() => setMessage(''), 5000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao salvar configurações')
      }
    } catch (error) {
      setError('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const testSpeed = (speed: number) => {
    setScrollspeed(speed)
    setMessage(`🚀 Velocidade de teste definida: ${speed}`)
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
        <p className="mt-2 text-sm text-gray-600">
          Configure as configurações gerais do sistema de texto rolante
        </p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="scrollspeed" className="block text-sm font-medium text-gray-700 mb-2">
              Velocidade de Rolagem
            </label>
            
            {/* Botões de teste rápido */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => testSpeed(0.1)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Snail className="w-4 h-4" />
                Muito Lento (0.1)
              </button>
              <button
                type="button"
                onClick={() => testSpeed(1)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Play className="w-4 h-4" />
                Lento (1.0)
              </button>
              <button
                type="button"
                onClick={() => testSpeed(5)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                <Zap className="w-4 h-4" />
                Médio (5.0)
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="scrollspeed"
                min="0.1"
                max="10"
                step="0.1"
                value={scrollspeed}
                onChange={(e) => setScrollspeed(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-lg font-semibold text-gray-900 min-w-[4rem] text-center">
                {scrollspeed}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Muito Lento</span>
              <span>Muito Rápido</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Velocidade de 0.1 (muito lento) a 10 (muito rápido). 
              Valores menores = movimento mais lento e suave.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Última atualização: {settings?.updatedat ? new Date(settings.updatedat).toLocaleString('pt-BR') : 'Nunca'}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}
