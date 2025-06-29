import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Search,
  Filter,
  TrendingUp
} from 'lucide-react'

const Home = () => {
  const [places, setPlaces] = useState([])
  const [advertisements, setAdvertisements] = useState([])
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
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // جلب الأماكن المعتمدة
      const placesResponse = await fetch('/api/places?status=approved')
      if (placesResponse.ok) {
        const placesData = await placesResponse.json()
        setPlaces(placesData)
      }

      // جلب الإعلانات النشطة
      const adsResponse = await fetch('/api/advertisements')
      if (adsResponse.ok) {
        const adsData = await adsResponse.json()
        setAdvertisements(adsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
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

  // فصل الأماكن المميزة عن العادية
  const featuredPlaces = filteredPlaces.filter(place => place.is_featured)
  const regularPlaces = filteredPlaces.filter(place => !place.is_featured)

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
    <div className="space-y-8">
      {/* الترحيب والبحث */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">مرحباً بك في دليل الأماكن السياحية</h1>
        <p className="text-xl text-gray-600">اكتشف أفضل الأماكن في منطقتك</p>
        
        {/* شريط البحث والفلترة */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن الأماكن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </div>

      {/* الإعلانات */}
      {advertisements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 space-x-reverse">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>الإعلانات المميزة</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.slice(0, 3).map(ad => (
              <Card key={ad.id} className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-lg">{ad.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit">إعلان مدفوع</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{ad.content}</p>
                  {ad.image_url && (
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* الأماكن المميزة */}
      {featuredPlaces.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 space-x-reverse">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>الأماكن المميزة</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaces.map(place => (
              <Card key={place.id} className="border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{place.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {getCategoryLabel(place.category)}
                      </Badge>
                    </div>
                    <Badge className="bg-yellow-500 text-white">مميز</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {place.description && (
                    <p className="text-gray-600 text-sm">{place.description}</p>
                  )}
                  {place.address && (
                    <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{place.address}</span>
                    </div>
                  )}
                  {place.phone && (
                    <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>{place.phone}</span>
                    </div>
                  )}
                  {place.website && (
                    <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                      <Globe className="h-4 w-4" />
                      <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        زيارة الموقع
                      </a>
                    </div>
                  )}
                  {place.image_url && (
                    <img 
                      src={place.image_url} 
                      alt={place.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* جميع الأماكن */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">جميع الأماكن</h2>
        {regularPlaces.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد أماكن متاحة حالياً</p>
            <Link to="/add-place">
              <Button className="mt-4">أضف مكان جديد</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPlaces.map(place => (
              <Card key={place.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{place.name}</CardTitle>
                  <Badge variant="outline">
                    {getCategoryLabel(place.category)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {place.description && (
                    <p className="text-gray-600 text-sm">{place.description}</p>
                  )}
                  {place.address && (
                    <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{place.address}</span>
                    </div>
                  )}
                  {place.phone && (
                    <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>{place.phone}</span>
                    </div>
                  )}
                  {place.website && (
                    <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                      <Globe className="h-4 w-4" />
                      <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        زيارة الموقع
                      </a>
                    </div>
                  )}
                  {place.image_url && (
                    <img 
                      src={place.image_url} 
                      alt={place.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

