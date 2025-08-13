'use client'

import { useState, useEffect } from 'react'
import { Save, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPanel() {
  const [scrollSpeed, setScrollSpeed] = useState(50)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setScrollSpeed(data.scrollSpeed)
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scrollSpeed })
      })

      if (response.ok) {
        alert('Configurações salvas com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Configurações</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure as opções do sistema
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <SettingsIcon size={20} className="inline mr-2" />
              Configurações do Texto Rolante
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Velocidade do Texto
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={scrollSpeed}
                    onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-600 w-12 text-center">
                    {scrollSpeed}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Lento</span>
                  <span>Rápido</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Ajuste a velocidade com que o texto se move na tela. 
                  Valores menores tornam o movimento mais lento, valores maiores mais rápido.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
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
