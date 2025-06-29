import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MapPin, 
  Phone, 
  Globe, 
  Search,
  Filter,
  Plus
} from 'lucide-react'

const Places = () => {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    { value: '', label: 'جميع الفئات' },
    { value: 'restaurant', label: 'مطعم' },
    { value: 'entertainment', label: 'ملاهي' },
    { value: 'pharmacy', label: 'صيدلية' },
    { value: 'hotel', label: 'فندق' },
    { value: 'shopping', label: 'تسوق' },
    { value: 'hospital', label: 'مستشفى' },
    { value: 'gas_station', label: 'محطة وقود' },
    { value: 'bank', label: 'بنك' },
    { value: 'other', label: 'أخرى' }
  ]

  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/places?status=approved')
      if (response.ok) {
        const data = await response.json()
        setPlaces(data)
      }
    } catch (error) {
      console.error('Error fetching places:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || place.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* العنوان والبحث */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">جميع الأماكن</h1>
          <p className="text-gray-600">استكشف الأماكن المعتمدة في منطقتك</p>
        </div>
        <Link to="/add-place">
          <Button className="flex items-center space-x-2 space-x-reverse">
            <Plus className="h-4 w-4" />
            <span>إضافة مكان جديد</span>
          </Button>
        </Link>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث عن الأماكن..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* عدد النتائج */}
      <div className="text-sm text-gray-600">
        عرض {filteredPlaces.length} من أصل {places.length} مكان
      </div>

      {/* قائمة الأماكن */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أماكن</h3>
          <p className="text-gray-600 mb-4">لم يتم العثور على أماكن تطابق معايير البحث</p>
          <Link to="/add-place">
            <Button>أضف مكان جديد</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map(place => (
            <Card key={place.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{place.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {getCategoryLabel(place.category)}
                    </Badge>
                  </div>
                  {place.is_featured && (
                    <Badge className="bg-yellow-500 text-white">مميز</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {place.image_url && (
                  <img 
                    src={place.image_url} 
                    alt={place.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                
                {place.description && (
                  <p className="text-gray-600 text-sm">{place.description}</p>
                )}
                
                <div className="space-y-2">
                  {place.address && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{place.address}</span>
                    </div>
                  )}
                  
                  {place.phone && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{place.phone}</span>
                    </div>
                  )}
                  
                  {place.website && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Globe className="h-4 w-4 flex-shrink-0 text-gray-500" />
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline truncate"
                      >
                        زيارة الموقع
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-400">
                    أضيف بواسطة: {place.owner}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Places

