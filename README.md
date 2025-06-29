# دليل الأماكن السياحية

موقع ويب شامل لإدارة الأماكن السياحية مع نظام إدارة المحتوى وباقات مدفوعة.

## المميزات

### للمستخدمين العاديين
- تصفح الأماكن السياحية (مطاعم، ملاهي، صيدليات، فنادق، إلخ)
- البحث والفلترة حسب الفئة
- عرض تفاصيل الأماكن مع الصور والمعلومات
- إضافة أماكن جديدة (تحتاج موافقة الإدارة)

### للمستخدمين المميزين (Premium)
- إنشاء إعلانات مخصصة
- عرض أماكنهم في المقدمة
- إحصائيات متقدمة
- دعم فني مخصص

### للمسؤولين
- الموافقة على الأماكن المضافة
- إدارة المستخدمين والأدوار
- إدارة الباقات والإعلانات
- لوحة تحكم شاملة

## التقنيات المستخدمة

### الواجهة الخلفية (Backend)
- **Flask** - إطار عمل Python
- **SQLAlchemy** - ORM لقاعدة البيانات
- **SQLite** - قاعدة البيانات
- **Flask-CORS** - دعم CORS
- **Werkzeug** - تشفير كلمات المرور

### الواجهة الأمامية (Frontend)
- **React** - مكتبة JavaScript
- **Vite** - أداة البناء
- **Tailwind CSS** - إطار عمل CSS
- **Lucide React** - الأيقونات
- **React Router** - التنقل

## هيكل المشروع

```
tourism_platform/
├── backend/                 # الواجهة الخلفية
│   ├── src/
│   │   ├── models/         # نماذج قاعدة البيانات
│   │   ├── routes/         # مسارات API
│   │   ├── database/       # ملفات قاعدة البيانات
│   │   └── main.py         # الملف الرئيسي
│   ├── requirements.txt    # متطلبات Python
│   └── venv/              # البيئة الافتراضية
├── frontend/               # الواجهة الأمامية
│   ├── src/
│   │   ├── components/     # مكونات React
│   │   ├── contexts/       # سياقات React
│   │   └── main.jsx        # الملف الرئيسي
│   ├── package.json        # متطلبات Node.js
│   └── dist/              # ملفات البناء
└── README.md              # هذا الملف
```

## التثبيت والتشغيل

### متطلبات النظام
- Python 3.11+
- Node.js 20+
- Git

### 1. استنساخ المشروع
```bash
git clone https://github.com/YOUR_USERNAME/tourism_platform.git
cd tourism_platform
```

### 2. إعداد الواجهة الخلفية
```bash
cd backend
python -m venv venv
source venv/bin/activate  # في Linux/Mac
# أو
venv\Scripts\activate     # في Windows
pip install -r requirements.txt
python src/main.py
```

### 3. إعداد الواجهة الأمامية
```bash
cd frontend
pnpm install
pnpm run dev
```

### 4. الوصول للموقع
- الواجهة الأمامية: http://localhost:5173
- الواجهة الخلفية: http://localhost:5000

## بيانات الدخول الافتراضية

### المسؤول
- اسم المستخدم: `admin`
- كلمة المرور: `admin123`

## قاعدة البيانات

### الجداول الرئيسية

#### Users (المستخدمين)
- id, username, email, password_hash
- role (user, premium, admin)
- created_at, updated_at

#### Places (الأماكن)
- id, name, description, category, address
- phone, website, image_url
- latitude, longitude
- status (pending, approved, rejected)
- user_id, created_at, updated_at

#### Packages (الباقات)
- id, name, description, price, duration
- created_at, updated_at

#### Advertisements (الإعلانات)
- id, title, content, image_url
- start_date, end_date, is_active
- user_id, place_id, created_at

## API Endpoints

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - إنشاء حساب
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/me` - معلومات المستخدم الحالي

### الأماكن
- `GET /api/places` - جلب جميع الأماكن
- `POST /api/places` - إضافة مكان جديد
- `PUT /api/places/:id` - تحديث مكان
- `DELETE /api/places/:id` - حذف مكان
- `GET /api/places/categories` - جلب الفئات

### الباقات
- `GET /api/packages` - جلب جميع الباقات
- `POST /api/packages/subscribe` - الاشتراك في باقة

### الإعلانات
- `GET /api/advertisements` - جلب الإعلانات النشطة
- `POST /api/advertisements` - إنشاء إعلان
- `DELETE /api/advertisements/:id` - حذف إعلان

## النشر

### Render (موصى به)
1. ادفع الكود إلى GitHub
2. اربط المستودع بـ Render
3. اختر "Web Service" للواجهة الخلفية
4. اختر "Static Site" للواجهة الأمامية

### متغيرات البيئة
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///app.db
```

## المساهمة

1. Fork المشروع
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

للحصول على الدعم، يرجى فتح issue في GitHub أو التواصل عبر البريد الإلكتروني.

## الإصدارات المستقبلية

- [ ] تطبيق الهاتف المحمول
- [ ] نظام التقييمات والمراجعات
- [ ] خرائط تفاعلية
- [ ] نظام الإشعارات
- [ ] تكامل مع وسائل التواصل الاجتماعي
- [ ] نظام الدفع الإلكتروني
- [ ] تقارير وإحصائيات متقدمة

