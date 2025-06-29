import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Package, 
  Check, 
  Star,
  Crown,
  Zap
} from 'lucide-react'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPackages()
    if (user) {
      checkCurrentSubscription()
    }
  }, [user])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/packages/check-subscription', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  const handleSubscribe = async (packageId) => {
    if (!user) {
      navigate('/login')
      return
    }

    setSubscribing(packageId)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/packages/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ package_id: packageId })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        checkCurrentSubscription()
        setTimeout(() => {
          window.location.reload() // إعادة تحميل الصفحة لتحديث حالة المستخدم
        }, 2000)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setSubscribing(null)
    }
  }

  const getPackageIcon = (index) => {
    const icons = [Star, Crown, Zap]
    const Icon = icons[index % icons.length]
    return <Icon className="h-8 w-8" />
  }

  const getPackageColor = (index) => {
    const colors = ['text-blue-600', 'text-purple-600', 'text-yellow-600']
    return colors[index % colors.length]
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
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Package className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">الباقات المدفوعة</h1>
        <p className="text-xl text-gray-600">اختر الباقة المناسبة لك واحصل على مزايا إضافية</p>
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

      {/* الاشتراك الحالي */}
      {currentSubscription && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">اشتراكك الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-green-800">{currentSubscription.package_name}</h3>
                <p className="text-green-600">
                  ينتهي في: {new Date(currentSubscription.end_date).toLocaleDateString('ar-SA')}
                </p>
              </div>
              <Badge className="bg-green-600 text-white">نشط</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* مزايا الباقات المدفوعة */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>مزايا الباقات المدفوعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Check className="h-5 w-5 text-green-600" />
              <span>عرض أماكنك في المقدمة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Check className="h-5 w-5 text-green-600" />
              <span>إنشاء إعلانات مخصصة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Check className="h-5 w-5 text-green-600" />
              <span>أولوية في الموافقة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Check className="h-5 w-5 text-green-600" />
              <span>إحصائيات مفصلة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Check className="h-5 w-5 text-green-600" />
              <span>دعم فني مميز</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Check className="h-5 w-5 text-green-600" />
              <span>شارة مستخدم مميز</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الباقات المتاحة */}
      {packages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد باقات متاحة</h3>
            <p className="text-gray-600">سيتم إضافة باقات قريباً</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                currentSubscription?.package_id === pkg.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <CardHeader className="text-center">
                <div className={`flex justify-center mb-4 ${getPackageColor(index)}`}>
                  {getPackageIcon(index)}
                </div>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="text-3xl font-bold text-gray-900 mt-4">
                  {pkg.price} ريال
                  <span className="text-sm font-normal text-gray-500">/{pkg.duration} يوم</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">مدة الاشتراك: {pkg.duration} يوم</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">جميع المزايا المميزة</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">دعم فني على مدار الساعة</span>
                  </div>
                </div>

                {currentSubscription?.package_id === pkg.id ? (
                  <Button disabled className="w-full">
                    مشترك حالياً
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleSubscribe(pkg.id)}
                    disabled={subscribing === pkg.id || !!currentSubscription}
                    className="w-full"
                  >
                    {subscribing === pkg.id ? 'جاري الاشتراك...' : 
                     currentSubscription ? 'لديك اشتراك نشط' : 'اشترك الآن'}
                  </Button>
                )}
              </CardContent>
              
              {currentSubscription?.package_id === pkg.id && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 text-white">نشط</Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {!user && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-blue-900 mb-2">سجل دخولك للاشتراك</h3>
            <p className="text-blue-700 mb-4">يجب تسجيل الدخول أولاً للاشتراك في الباقات</p>
            <div className="space-x-2 space-x-reverse">
              <Button onClick={() => navigate('/login')}>
                تسجيل الدخول
              </Button>
              <Button variant="outline" onClick={() => navigate('/register')}>
                إنشاء حساب
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Packages

