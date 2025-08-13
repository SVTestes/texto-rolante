'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Users, MessageSquare, Settings, LogOut } from 'lucide-react'
import UserManagement from './UserManagement'
import PhraseManagement from './PhraseManagement'
import SettingsPanel from './SettingsPanel'

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('phrases')

  if (!session) {
    return null
  }

  const isAdmin = session.user?.isAdmin

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Texto Rolante
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('phrases')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'phrases'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} />
                <span>Gestão de Frases</span>
              </div>
            </button>
            
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>Gestão de Usuários</span>
                </div>
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings size={16} />
                <span>Configurações</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'phrases' && <PhraseManagement />}
        {activeTab === 'users' && isAdmin && <UserManagement />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}
