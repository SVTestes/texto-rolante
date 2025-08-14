'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { MessageSquare, Users, Eye, LogOut } from 'lucide-react'
import UserManagement from './UserManagement'
import PhraseManagement from './PhraseManagement'

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('phrases')

  if (!session) {
    return <div>Carregando...</div>
  }

  const isAdmin = session.user?.isAdmin

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão PREVIEW */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Texto Rolante
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://texto-rolante-production.up.railway.app/display"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                PREVIEW
              </a>
              <span className="text-sm text-gray-700">
                Olá, {session.user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Painel de Controle</h2>
          <p className="mt-2 text-gray-600">
            Gerencie suas frases e usuários. Use o botão PREVIEW para ver o resultado na TV.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('phrases')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'phrases'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Gestão de Frases
            </button>
            
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Gestão de Usuários
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'phrases' && <PhraseManagement />}
          {activeTab === 'users' && isAdmin && <UserManagement />}
        </div>
      </div>
    </div>
  )
}
