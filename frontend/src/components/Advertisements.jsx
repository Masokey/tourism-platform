import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Megaphone, 
  Plus, 
  Edit,
  Trash2,
  Calendar
} from 'lucide-react'

const Advertisements = () => {
  const [advertisements, setAdvertisements] = useState([])
  const [myAds, setMyAds] = useState([])
  const [userPlaces, setUserPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    place_id: '',
    end_date: ''
  })

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || (user.role !== 'premium' && user.role !== 'admin')) {
      navigate('/')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      // جلب جميع الإعلانات
      const adsResponse = await fetch('/api/advertisements')
      if (adsResponse.ok) {
        const adsData = await adsResponse.json()
        setAdvertisements(adsData)
      }

      // جلب إعلانات المستخدم
      const myAdsResponse = await fetch('/api/advertisements/my-ads', {
        credentials: 'include'
      })
      if (myAdsResponse.ok) {
        const myAdsData = await myAdsResponse.json()
        setMyAds(myAdsData)
      }

      // جلب أماكن المستخدم المعتمدة
      const placesResponse = await fetch('/api/places?status=approved', {
        credentials: 'include'
      })
      if (placesResponse.ok) {
        const placesData = await placesResponse.json()
        const myPlaces = placesData.filter(place => place.user_id === user.id)
        setUserPlaces(myPlaces)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/advertisements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setFormData({
          title: '',
          content: '',
          image_url: '',
          place_id: '',
          end_date: ''
        })
        fetchData() // إعادة جلب البيانات
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (adId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      return
    }

    try {
      const response = await fetch(`/api/advertisements/${adId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        fetchData()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    }
  }

  if (!user || (user.role !== 'premium' && user.role !== 'admin')) {
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
        <Megaphone className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">إدارة الإعلانات</h1>
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

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create" className="flex items-center space-x-2 space-x-reverse">
            <Plus className="h-4 w-4" />
            <span>إنشاء إعلان</span>
          </TabsTrigger>
          <TabsTrigger value="my-ads" className="flex items-center space-x-2 space-x-reverse">
            <Edit className="h-4 w-4" />
            <span>إعلاناتي ({myAds.length})</span>
          </TabsTrigger>
          <TabsTrigger value="all-ads" className="flex items-center space-x-2 space-x-reverse">
            <Megaphone className="h-4 w-4" />
            <span>جميع الإعلانات ({advertisements.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء إعلان جديد</CardTitle>
              <CardDescription>
                أنشئ إعلاناً مخصصاً لترويج أماكنك أو خدماتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الإعلان *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="أدخل عنوان الإعلان"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="place_id">المكان المرتبط (اختياري)</Label>
                    <select
                      id="place_id"
                      name="place_id"
                      value={formData.place_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">لا يوجد مكان محدد</option>
                      {userPlaces.map(place => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">محتوى الإعلان *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    placeholder="أدخل محتوى الإعلان"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">رابط الصورة (اختياري)</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">تاريخ انتهاء الإعلان (اختياري)</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={creating} className="w-full">
                  {creating ? 'جاري إنشاء الإعلان...' : 'إنشاء الإعلان'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعلاناتي</CardTitle>
              <CardDescription>
                جميع الإعلانات التي قمت بإنشائها
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myAds.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
                  <p className="text-gray-600">لم تقم بإنشاء أي إعلانات بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAds.map(ad => (
                    <Card key={ad.id} className="border-l-4 border-l-blue-400">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-semibold">{ad.title}</h3>
                            <p className="text-gray-600">{ad.content}</p>
                            
                            {ad.place_name && (
                              <p className="text-sm text-blue-600">مرتبط بالمكان: {ad.place_name}</p>
                            )}
                            
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  من {new Date(ad.start_date).toLocaleDateString('ar-SA')} 
                                  إلى {new Date(ad.end_date).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                              <p>الحالة: {ad.is_active ? 'نشط' : 'غير نشط'}</p>
                            </div>

                            {ad.image_url && (
                              <img 
                                src={ad.image_url} 
                                alt={ad.title}
                                className="w-full max-w-md h-32 object-cover rounded-lg"
                              />
                            )}
                          </div>
                          
                          <div className="flex space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(ad.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        <TabsContent value="all-ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>جميع الإعلانات النشطة</CardTitle>
              <CardDescription>
                الإعلانات المعروضة حالياً في الموقع
              </CardDescription>
            </CardHeader>
            <CardContent>
              {advertisements.length === 0 ? (
                <div className="text-center py-8">
                  <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
                  <p className="text-gray-600">لا توجد إعلانات نشطة حالياً</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advertisements.map(ad => (
                    <Card key={ad.id} className="border-2 border-yellow-200 bg-yellow-50">
                      <CardHeader>
                        <CardTitle className="text-lg">{ad.title}</CardTitle>
                        <p className="text-sm text-gray-600">بواسطة: {ad.user_name}</p>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-gray-700">{ad.content}</p>
                        
                        {ad.place_name && (
                          <p className="text-sm text-blue-600">المكان: {ad.place_name}</p>
                        )}
                        
                        {ad.image_url && (
                          <img 
                            src={ad.image_url} 
                            alt={ad.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        
                        <div className="text-xs text-gray-500">
                          ينتهي في: {new Date(ad.end_date).toLocaleDateString('ar-SA')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Advertisements

