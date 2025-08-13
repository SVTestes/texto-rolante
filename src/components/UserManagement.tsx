'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, UserPlus } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    isAdmin: false
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!formData.email || !formData.name || !formData.password) return

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchUsers()
        setFormData({ email: '', name: '', password: '', isAdmin: false })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
    }
  }

  const handleEditUser = async (id: string) => {
    if (!formData.email || !formData.name) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchUsers()
        setEditingId(null)
        setFormData({ email: '', name: '', password: '', isAdmin: false })
      }
    } catch (error) {
      console.error('Erro ao editar usuário:', error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
    }
  }

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      isAdmin: user.isAdmin
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ email: '', name: '', password: '', isAdmin: false })
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
          <h1 className="text-xl font-semibold text-gray-900">Gestão de Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os usuários do sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlus size={16} className="mr-2" />
            Adicionar Usuário
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Novo Usuário</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Administrador</label>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Save size={16} className="mr-2" />
              Salvar
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setFormData({ email: '', name: '', password: '', isAdmin: false })
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    {editingId === user.id ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isAdmin}
                            onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-900">Admin</label>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <span className="text-sm text-gray-900">{user.email}</span>
                        <span className="text-sm text-gray-900">{user.name}</span>
                        <span className="text-sm text-gray-500">
                          {user.isAdmin ? 'Administrador' : 'Usuário'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {editingId === user.id ? (
                    <>
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
