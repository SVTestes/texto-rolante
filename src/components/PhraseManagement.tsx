'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Phrase {
  id: string
  text: string
  order: number
}

export default function PhraseManagement() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPhrase, setNewPhrase] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    fetchPhrases()
  }, [])

  const fetchPhrases = async () => {
    try {
      const response = await fetch('/api/phrases')
      if (response.ok) {
        const data = await response.json()
        setPhrases(data)
      }
    } catch (error) {
      console.error('Erro ao buscar frases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPhrase = async () => {
    if (!newPhrase.trim()) return

    try {
      const response = await fetch('/api/phrases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newPhrase })
      })

      if (response.ok) {
        await fetchPhrases()
        setNewPhrase('')
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erro ao adicionar frase:', error)
    }
  }

  const handleEditPhrase = async (id: string) => {
    if (!editingText.trim()) return

    try {
      const response = await fetch(`/api/phrases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText })
      })

      if (response.ok) {
        await fetchPhrases()
        setEditingId(null)
        setEditingText('')
      }
    } catch (error) {
      console.error('Erro ao editar frase:', error)
    }
  }

  const handleDeletePhrase = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta frase?')) return

    try {
      const response = await fetch(`/api/phrases/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPhrases()
      }
    } catch (error) {
      console.error('Erro ao deletar frase:', error)
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(phrases)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setPhrases(updatedItems)

    try {
      await fetch('/api/phrases/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrases: updatedItems })
      })
    } catch (error) {
      console.error('Erro ao reordenar frases:', error)
      await fetchPhrases() // Revert on error
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
          <h1 className="text-xl font-semibold text-gray-900">Gestão de Frases</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie as frases que aparecem no texto rolante
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            Adicionar Frase
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              placeholder="Digite a nova frase..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              onClick={handleAddPhrase}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Save size={16} className="mr-2" />
              Salvar
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewPhrase('')
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Phrases List */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="phrases">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="divide-y divide-gray-200"
              >
                {phrases.map((phrase, index) => (
                  <Draggable key={phrase.id} draggableId={phrase.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-6 py-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500 w-8">
                              {phrase.order}
                            </div>
                            {editingId === phrase.id ? (
                              <div className="flex-1 flex space-x-2">
                                <input
                                  type="text"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <button
                                  onClick={() => handleEditPhrase(phrase.id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingId(null)
                                    setEditingText('')
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-900 flex-1">
                                {phrase.text}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingId(phrase.id)
                                setEditingText(phrase.text)
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeletePhrase(phrase.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
