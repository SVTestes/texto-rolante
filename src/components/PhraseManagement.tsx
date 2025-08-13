'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Phrase {
  id: string
  text: string
  order: number
  isactive: boolean
}

export default function PhraseManagement() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPhrase, setNewPhrase] = useState('')
  const [editText, setEditText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPhrases()
  }, [])

  const fetchPhrases = async () => {
    try {
      const response = await fetch('/api/phrases')
      if (response.ok) {
        const data = await response.json()
        setPhrases(data)
      } else {
        setError('Erro ao carregar frases')
      }
    } catch (error) {
      setError('Erro ao carregar frases')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPhrase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhrase.trim()) return

    try {
      const response = await fetch('/api/phrases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newPhrase }),
      })

      if (response.ok) {
        setNewPhrase('')
        setShowAddForm(false)
        fetchPhrases()
      } else {
        setError('Erro ao adicionar frase')
      }
    } catch (error) {
      setError('Erro ao adicionar frase')
    }
  }

  const handleEditPhrase = async (id: string) => {
    if (!editText.trim()) return

    try {
      const response = await fetch(`/api/phrases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      })

      if (response.ok) {
        setEditingId(null)
        setEditText('')
        fetchPhrases()
      } else {
        setError('Erro ao editar frase')
      }
    } catch (error) {
      setError('Erro ao editar frase')
    }
  }

  const handleDeletePhrase = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta frase?')) return

    try {
      const response = await fetch(`/api/phrases/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPhrases()
      } else {
        setError('Erro ao deletar frase')
      }
    } catch (error) {
      setError('Erro ao deletar frase')
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(phrases)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setPhrases(items)

    try {
      const phraseIds = items.map(item => item.id)
      const response = await fetch('/api/phrases/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phraseIds }),
      })

      if (!response.ok) {
        setError('Erro ao salvar nova ordem')
        fetchPhrases() // Reverter mudanças
      }
    } catch (error) {
      setError('Erro ao salvar nova ordem')
      fetchPhrases() // Reverter mudanças
    }
  }

  const startEditing = (phrase: Phrase) => {
    setEditingId(phrase.id)
    setEditText(phrase.text)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText('')
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Frases</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Frase
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <form onSubmit={handleAddPhrase} className="flex gap-2">
            <input
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Digite a nova frase..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="phrases">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {phrases.map((phrase, index) => (
                <Draggable key={phrase.id} draggableId={phrase.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="text-gray-400 cursor-move"
                      >
                        ⋮⋮
                      </div>
                      
                      {editingId === phrase.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleEditPhrase(phrase.id)}
                            className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="text-gray-900">{phrase.text}</p>
                            <p className="text-sm text-gray-500">Ordem: {phrase.order}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(phrase)}
                              className="text-blue-600 hover:text-blue-800 p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePhrase(phrase.id)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
