import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  User, 
  LogOut, 
  Settings, 
  Plus,
  Package,
  Megaphone
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* الشعار */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">دليل الأماكن السياحية</span>
          </Link>

          {/* روابط التنقل */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              الرئيسية
            </Link>
            <Link to="/places" className="text-gray-700 hover:text-blue-600 transition-colors">
              الأماكن
            </Link>
            {user && (
              <>
                <Link to="/add-place" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 space-x-reverse">
                  <Plus className="h-4 w-4" />
                  <span>إضافة مكان</span>
                </Link>
                <Link to="/packages" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 space-x-reverse">
                  <Package className="h-4 w-4" />
                  <span>الباقات</span>
                </Link>
                {(user.role === 'premium' || user.role === 'admin') && (
                  <Link to="/advertisements" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 space-x-reverse">
                    <Megaphone className="h-4 w-4" />
                    <span>الإعلانات</span>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 space-x-reverse">
                    <Settings className="h-4 w-4" />
                    <span>لوحة الإدارة</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* أزرار المستخدم */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {user ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1 space-x-reverse">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 space-x-reverse"
                >
                  <LogOut className="h-4 w-4" />
                  <span>خروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Link to="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">إنشاء حساب</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

