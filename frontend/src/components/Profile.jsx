import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  MapPin, 
  Package,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react'

const Profile = () => {
  const [userPlaces, setUserPlaces] = useState([])
  const [userSubscriptions, setUserSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchUserData()
  }, [user, navigate])

  const fetchUserData = async () => {
    try {
      // جلب أماكن المستخدم
      const placesResponse = await fetch('/api/places', {
        credentials: 'include'
      })
      if (placesResponse.ok) {
        const placesData = await placesResponse.json()
        // فلترة الأماكن التي أضافها المستخدم الحالي
        const myPlaces = placesData.filter(place => place.user_id === user.id)
        setUserPlaces(myPlaces)
      }

      // جلب اشتراكات المستخدم
      const subscriptionsResponse = await fetch('/api/packages/my-subscriptions', {
        credentials: 'include'
      })
      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json()
        setUserSubscriptions(subscriptionsData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', variant: 'secondary' },
      approved: { label: 'معتمد', variant: 'default' },
      rejected: { label: 'مرفوض', variant: 'destructive' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      user: { label: 'مستخدم عادي', variant: 'secondary' },
      premium: { label: 'مستخدم مميز', variant: 'default' },
      admin: { label: 'مسؤول', variant: 'destructive' }
    }
    
    const config = roleConfig[role] || roleConfig.user
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (!user) {
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
        <User className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
      </div>

      {/* معلومات المستخدم */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الحساب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">اسم المستخدم</label>
              <p className="text-lg">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">البريد الإلكتروني</label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">نوع الحساب</label>
              <div className="mt-1">
                {getRoleBadge(user.role)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">تاريخ الانضمام</label>
              <p className="text-lg">
                {new Date(user.created_at).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="places" className="space-y-4">
        <TabsList>
          <TabsTrigger value="places" className="flex items-center space-x-2 space-x-reverse">
            <MapPin className="h-4 w-4" />
            <span>أماكني ({userPlaces.length})</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center space-x-2 space-x-reverse">
            <Package className="h-4 w-4" />
            <span>اشتراكاتي ({userSubscriptions.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="places" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الأماكن التي أضفتها</CardTitle>
              <CardDescription>
                جميع الأماكن التي قمت بإضافتها وحالة الموافقة عليها
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userPlaces.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لم تضف أي أماكن بعد</h3>
                  <p className="text-gray-600 mb-4">ابدأ بإضافة أماكن جديدة لمشاركتها مع الآخرين</p>
                  <Button onClick={() => navigate('/add-place')}>
                    إضافة مكان جديد
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userPlaces.map(place => (
                    <Card key={place.id} className="border-l-4 border-l-blue-400">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <h3 className="text-lg font-semibold">{place.name}</h3>
                              {getStatusBadge(place.status)}
                              {place.is_featured && (
                                <Badge className="bg-yellow-500 text-white">مميز</Badge>
                              )}
                            </div>
                            
                            {place.description && (
                              <p className="text-gray-600">{place.description}</p>
                            )}
                            
                            <div className="text-sm text-gray-500">
                              <p>الفئة: {place.category}</p>
                              {place.address && <p>العنوان: {place.address}</p>}
                              <p>تاريخ الإضافة: {new Date(place.created_at).toLocaleDateString('ar-SA')}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 space-x-reverse">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
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

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اشتراكاتي</CardTitle>
              <CardDescription>
                تاريخ اشتراكاتك في الباقات المدفوعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد اشتراكات</h3>
                  <p className="text-gray-600 mb-4">اشترك في إحدى الباقات للحصول على مزايا إضافية</p>
                  <Button onClick={() => navigate('/packages')}>
                    عرض الباقات
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSubscriptions.map(subscription => (
                    <Card key={subscription.id} className="border-l-4 border-l-green-400">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <h3 className="text-lg font-semibold">{subscription.package_name}</h3>
                              <Badge variant={subscription.is_active ? 'default' : 'secondary'}>
                                {subscription.is_active ? 'نشط' : 'منتهي'}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  من {new Date(subscription.start_date).toLocaleDateString('ar-SA')} 
                                  إلى {new Date(subscription.end_date).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                              <p>تاريخ الاشتراك: {new Date(subscription.created_at).toLocaleDateString('ar-SA')}</p>
                            </div>
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
      </Tabs>
    </div>
  )
}

export default Profile

