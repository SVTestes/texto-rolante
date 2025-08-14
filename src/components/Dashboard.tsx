'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { MessageSquare, Users, Settings } from 'lucide-react'
import UserManagement from './UserManagement'
import PhraseManagement from './PhraseManagement'

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('phrases')

  if (!session) {
    return <div>Carregando...</div>
  }

  const isAdmin = session.user?.isAdmin

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
          <p className="mt-2 text-gray-600">
            Bem-vindo, {session.user?.name}! Gerencie suas frases e usuários.
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
