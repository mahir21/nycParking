'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PlateWatch {
  id: string
  plateNumber: string
  state: string
  borough?: string
  nickname?: string
  createdAt: string
  isActive: boolean
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [plateWatches, setPlateWatches] = useState<PlateWatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlate, setNewPlate] = useState({
    plateNumber: '',
    state: 'NY',
    borough: '',
    nickname: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchPlateWatches()
    }
  }, [session])

  const fetchPlateWatches = async () => {
    try {
      const response = await fetch('/api/user/plates')
      if (response.ok) {
        const data = await response.json()
        setPlateWatches(data.plates)
      }
    } catch (error) {
      console.error('Error fetching plates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPlate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/user/plates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlate),
      })

      if (response.ok) {
        setNewPlate({ plateNumber: '', state: 'NY', borough: '', nickname: '' })
        setShowAddForm(false)
        fetchPlateWatches()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add plate')
      }
    } catch (error) {
      console.error('Error adding plate:', error)
      alert('An error occurred while adding the plate')
    }
  }

  const handleRemovePlate = async (plateId: string) => {
    if (!confirm('Are you sure you want to remove this plate from monitoring?')) {
      return
    }

    try {
      const response = await fetch(`/api/user/plates/${plateId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPlateWatches()
      } else {
        alert('Failed to remove plate')
      }
    } catch (error) {
      console.error('Error removing plate:', error)
      alert('An error occurred while removing the plate')
    }
  }

  const handleToggleActive = async (plateId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/user/plates/${plateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchPlateWatches()
      } else {
        alert('Failed to update plate status')
      }
    } catch (error) {
      console.error('Error updating plate:', error)
      alert('An error occurred while updating the plate')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome, {session.user.firstName || session.user.name || session.user.email}!
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your license plates and violation monitoring
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Account: {session.user.email}</p>
              <button
                onClick={() => router.push('/')}
                className="mt-2 text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                ← Back to Violation Lookup
              </button>
            </div>
          </div>
        </div>

        {/* Monitored Plates Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Monitored License Plates ({plateWatches.length})
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showAddForm ? 'Cancel' : '+ Add Plate'}
            </button>
          </div>

          {/* Add Plate Form */}
          {showAddForm && (
            <div className="bg-slate-50 p-4 rounded-md mb-4">
              <form onSubmit={handleAddPlate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      License Plate Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPlate.plateNumber}
                      onChange={(e) => setNewPlate({...newPlate, plateNumber: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white"
                      placeholder="ABC1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State
                    </label>
                    <select
                      value={newPlate.state}
                      onChange={(e) => setNewPlate({...newPlate, state: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white"
                    >
                      <option value="NY">New York</option>
                      <option value="NJ">New Jersey</option>
                      <option value="CT">Connecticut</option>
                      <option value="PA">Pennsylvania</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Borough (Optional)
                    </label>
                    <select
                      value={newPlate.borough}
                      onChange={(e) => setNewPlate({...newPlate, borough: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white"
                    >
                      <option value="">All Boroughs</option>
                      <option value="MANHATTAN">Manhattan</option>
                      <option value="BROOKLYN">Brooklyn</option>
                      <option value="QUEENS">Queens</option>
                      <option value="BRONX">Bronx</option>
                      <option value="STATEN ISLAND">Staten Island</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      value={newPlate.nickname}
                      onChange={(e) => setNewPlate({...newPlate, nickname: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white"
                      placeholder="My Car, Work Vehicle, etc."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                  >
                    Add Plate
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Plates List */}
          {plateWatches.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-lg">No license plates are being monitored yet.</p>
              <p className="text-sm mt-2">Add a plate to start receiving violation alerts!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plateWatches.map((plate) => (
                <div key={plate.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-mono font-bold text-slate-800">
                          {plate.plateNumber}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          {plate.state}
                        </span>
                        {plate.borough && (
                          <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded">
                            {plate.borough}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${
                          plate.isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {plate.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      {plate.nickname && (
                        <p className="text-sm text-slate-600 mt-1">{plate.nickname}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        Added: {new Date(plate.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(plate.id, plate.isActive)}
                        className={`px-3 py-1 text-xs rounded ${
                          plate.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {plate.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => handleRemovePlate(plate.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-sky-900 mb-2">
            📧 Email Notifications
          </h3>
          <p className="text-sky-800 text-sm">
            We'll check for new violations daily and send you email alerts when new parking tickets are found for your monitored plates.
          </p>
        </div>
      </div>
    </div>
  )
}