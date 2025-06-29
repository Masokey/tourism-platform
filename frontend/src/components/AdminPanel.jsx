import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  MapPin, 
  Check, 
  X, 
  Eye,
  Users,
  Package
} from 'lucide-react'

const AdminPanel = () => {
  const [pendingPlaces, setPendingPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchPendingPlaces()
  }, [user, navigate])

  const fetchPendingPlaces = async () => {
    try {
      const response = await fetch('/api/places/pending', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingPlaces(data)
      } else {
        setError('فشل في جلب الأماكن المعلقة')
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceAction = async (placeId, action) => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: action })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        // إزالة المكان من القائمة
        setPendingPlaces(prev => prev.filter(place => place.id !== placeId))
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error)
        setTimeout(() => setError(''), 3000)
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
      setTimeout(() => setError(''), 3000)
    }
  }

  const toggleFeatured = async (placeId, currentStatus) => {
    try {
      const response = await fetch(`/api/places/${placeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ is_featured: !currentStatus })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        // تحديث الحالة في القائمة
        setPendingPlaces(prev => 
          prev.map(place => 
            place.id === placeId 
              ? { ...place, is_featured: !currentStatus }
              : place
          )
        )
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error)
        setTimeout(() => setError(''), 3000)
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
      setTimeout(() => setError(''), 3000)
    }
  }

  if (!user || user.role !== 'admin') {
    return null
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
      <div className="flex items-center space-x-2 space-x-reverse">
        <Settings className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center space-x-2 space-x-reverse">
            <MapPin className="h-4 w-4" />
            <span>الأماكن المعلقة ({pendingPlaces.length})</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2 space-x-reverse">
            <Users className="h-4 w-4" />
            <span>إدارة المستخدمين</span>
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center space-x-2 space-x-reverse">
            <Package className="h-4 w-4" />
            <span>إدارة الباقات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الأماكن في انتظار الموافقة</CardTitle>
              <CardDescription>
                راجع الأماكن المضافة حديثاً ووافق عليها أو ارفضها
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPlaces.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أماكن معلقة</h3>
                  <p className="text-gray-600">جميع الأماكن تمت مراجعتها</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPlaces.map(place => (
                    <Card key={place.id} className="border-l-4 border-l-yellow-400">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start space-x-4 space-x-reverse">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <h3 className="text-lg font-semibold">{place.name}</h3>
                              <Badge variant="outline">{place.category}</Badge>
                              {place.is_featured && (
                                <Badge className="bg-yellow-500 text-white">مميز</Badge>
                              )}
                            </div>
                            
                            {place.description && (
                              <p className="text-gray-600">{place.description}</p>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                              {place.address && (
                                <div className="flex items-center space-x-1 space-x-reverse">
                                  <MapPin className="h-4 w-4" />
                                  <span>{place.address}</span>
                                </div>
                              )}
                              {place.phone && (
                                <div>الهاتف: {place.phone}</div>
                              )}
                              {place.website && (
                                <div>الموقع: {place.website}</div>
                              )}
                              <div>أضيف بواسطة: {place.owner}</div>
                            </div>

                            {place.image_url && (
                              <img 
                                src={place.image_url} 
                                alt={place.name}
                                className="w-full max-w-md h-32 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              onClick={() => handlePlaceAction(place.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 flex items-center space-x-1 space-x-reverse"
                            >
                              <Check className="h-4 w-4" />
                              <span>موافقة</span>
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handlePlaceAction(place.id, 'rejected')}
                              className="flex items-center space-x-1 space-x-reverse"
                            >
                              <X className="h-4 w-4" />
                              <span>رفض</span>
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFeatured(place.id, place.is_featured)}
                              className="flex items-center space-x-1 space-x-reverse"
                            >
                              <Eye className="h-4 w-4" />
                              <span>{place.is_featured ? 'إلغاء التمييز' : 'تمييز'}</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>
                قريباً - إدارة المستخدمين والأدوار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">هذه الميزة قيد التطوير</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الباقات</CardTitle>
              <CardDescription>
                قريباً - إدارة الباقات المدفوعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">هذه الميزة قيد التطوير</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminPanel

