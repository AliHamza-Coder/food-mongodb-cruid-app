'use client'

import { useState, useEffect } from 'react'
import { Food } from '@/types/food'
import Loader from '@/components/Loader'
import ButtonLoader from '@/components/ButtonLoader'
import { toast } from 'sonner'

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  })
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // Filter foods based on search term
  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Load foods
  const loadFoods = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/foods')
      const data = await res.json()
      
      // Check if data is an array, if not set empty array
      if (Array.isArray(data)) {
        setFoods(data)
      } else {
        console.error('API returned:', data)
        if (data.error === 'Database not configured') {
          toast.error('⚙️ Please configure MONGODB_URI in your .env.local file')
        } else {
          toast.error('Failed to load foods')
        }
        setFoods([])
      }
    } catch (error) {
      console.error('Error loading foods:', error)
      toast.error('Connection error. Please check your database configuration.')
      setFoods([])
    }
    setLoading(false)
  }

  // Add or update food
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const foodData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description
    }

    try {
      let res
      if (editingFood) {
        // Update
        res = await fetch(`/api/foods/${editingFood._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodData)
        })
      } else {
        // Add
        res = await fetch('/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodData)
        })
      }

      const result = await res.json()
      
      if (res.ok) {
        toast.success(editingFood ? 'Food updated successfully!' : 'Food added successfully!')
        setFormData({ name: '', price: '', category: '', description: '' })
        setEditingFood(null)
        loadFoods()
      } else {
        if (result.error === 'Database not configured') {
          toast.error('⚙️ Please configure MONGODB_URI in your .env.local file')
        } else {
          toast.error('Failed to save food')
        }
      }
    } catch (error) {
      console.error('Error saving food:', error)
      toast.error('Connection error. Please check your database configuration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete food
  const deleteFood = async (id: string) => {
    setDeletingIds(prev => new Set(prev).add(id))
    
    try {
      const res = await fetch(`/api/foods/${id}`, { method: 'DELETE' })
      const result = await res.json()
      
      if (res.ok) {
        toast.success('Food deleted successfully!')
        loadFoods()
      } else {
        toast.error('Failed to delete food')
      }
    } catch (error) {
      console.error('Error deleting food:', error)
      toast.error('Connection error. Please check your database configuration.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Edit food
  const editFood = (food: Food) => {
    setEditingFood(food)
    setFormData({
      name: food.name,
      price: food.price.toString(),
      category: food.category,
      description: food.description
    })
  }

  useEffect(() => {
    setIsHydrated(true)
    loadFoods()
  }, [])

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🍕 Food Manager
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Manage your favorite foods with style</p>
        </div>
        
        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-white/20 mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 text-gray-800">
            {editingFood ? '✏️ Edit Food' : '➕ Add New Food'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <input
              type="text"
              placeholder="🍔 Food Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={isSubmitting}
              className={`border-2 border-gray-200 p-3 lg:p-4 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-500 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              required
            />
            
            <input
              type="number"
              step="0.01"
              placeholder="💰 Price ($)"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              disabled={isSubmitting}
              className={`border-2 border-gray-200 p-3 lg:p-4 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-500 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              required
            />
            
            <input
              type="text"
              placeholder="🏷️ Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              disabled={isSubmitting}
              className={`border-2 border-gray-200 p-3 lg:p-4 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-500 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              required
            />
            
            <input
              type="text"
              placeholder="📝 Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={isSubmitting}
              className={`border-2 border-gray-200 p-3 lg:p-4 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-500 ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              required
            />
            
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 lg:gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ButtonLoader size="sm" />
                    {editingFood ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingFood ? '✅ Update Food' : '🚀 Add Food'
                )}
              </button>
              
              {editingFood && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setEditingFood(null)
                    setFormData({ name: '', price: '', category: '', description: '' })
                  }}
                  className={`bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Foods List */}
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🍽️ Food List</h2>
              <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'}
                {searchTerm && ` of ${foods.length}`}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full lg:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="🔍 Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 lg:py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12 lg:py-16">
              <Loader />
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="text-4xl lg:text-6xl mb-4">🍽️</div>
              <p className="text-gray-500 text-lg lg:text-xl">No foods found yet!</p>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">Add your first delicious food above ⬆️</p>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="text-4xl lg:text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg lg:text-xl">No foods match your search!</p>
              <p className="text-gray-400 mt-2 text-sm lg:text-base">Try searching for something else or clear your search</p>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredFoods.map((food) => (
                <div key={food._id} className="bg-gradient-to-br from-white to-gray-50 p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg lg:text-xl text-gray-800 mb-2 line-clamp-2">{food.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-green-600 font-bold text-xl lg:text-2xl">${food.price}</p>
                      <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                        {food.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed line-clamp-3">{food.description}</p>
                  </div>
                  
                  <div className="flex gap-2 lg:gap-3">
                    <button
                      onClick={() => editFood(food)}
                      disabled={isSubmitting || deletingIds.has(food._id!)}
                      className={`flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                        (isSubmitting || deletingIds.has(food._id!)) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteFood(food._id!)}
                      disabled={deletingIds.has(food._id!) || isSubmitting}
                      className={`flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-1 ${
                        (deletingIds.has(food._id!) || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {deletingIds.has(food._id!) ? (
                        <>
                          <ButtonLoader size="sm" />
                          Deleting...
                        </>
                      ) : (
                        '🗑️ Delete'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3 lg:space-y-4">
              {filteredFoods.map((food) => (
                <div key={food._id} className="bg-gradient-to-r from-white to-gray-50 p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="font-bold text-lg lg:text-xl text-gray-800">{food.name}</h3>
                        <div className="flex items-center gap-3">
                          <p className="text-green-600 font-bold text-xl lg:text-2xl">${food.price}</p>
                          <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                            {food.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{food.description}</p>
                    </div>
                    
                    <div className="flex gap-2 lg:gap-3 sm:flex-col sm:w-32">
                      <button
                        onClick={() => editFood(food)}
                        disabled={isSubmitting || deletingIds.has(food._id!)}
                        className={`flex-1 sm:flex-none bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                          (isSubmitting || deletingIds.has(food._id!)) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteFood(food._id!)}
                        disabled={deletingIds.has(food._id!) || isSubmitting}
                        className={`flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-1 ${
                          (deletingIds.has(food._id!) || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingIds.has(food._id!) ? (
                          <>
                            <ButtonLoader size="sm" />
                            Deleting...
                          </>
                        ) : (
                          '🗑️ Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}