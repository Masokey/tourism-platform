# دليل نشر منصة الأماكن السياحية على Render

## الخطوات المطلوبة للنشر:

### 1. إنشاء حساب على Render
- اذهب إلى https://render.com
- انقر على "Get Started"
- أنشئ حساباً جديداً باستخدام GitHub أو البريد الإلكتروني

### 2. ربط المستودع
- في لوحة تحكم Render، انقر على "New +"
- اختر "Blueprint"
- اربط حساب GitHub الخاص بك
- اختر مستودع `tourism-platform`

### 3. إعداد المتغيرات البيئية
سيتم إنشاء الخدمات التالية تلقائياً:
- **tourism-backend**: الواجهة الخلفية (Flask)
- **tourism-frontend**: الواجهة الأمامية (React)
- **tourism-db**: قاعدة البيانات (PostgreSQL)

### 4. الوصول للموقع
بعد اكتمال النشر، ستحصل على:
- رابط الواجهة الأمامية: `https://tourism-frontend.onrender.com`
- رابط الواجهة الخلفية: `https://tourism-backend.onrender.com`

### 5. إعداد قاعدة البيانات
- ستحتاج إلى تشغيل الأوامر التالية لإنشاء الجداول:
```bash
# في الواجهة الخلفية
python -c "from src.main import app, db; app.app_context().push(); db.create_all()"
```

### 6. إنشاء المستخدم الإداري
```bash
python -c "
from src.main import app, db
from src.models.user import User
from werkzeug.security import generate_password_hash

app.app_context().push()
admin = User(
    username='admin',
    email='admin@tourism.com',
    password_hash=generate_password_hash('admin123'),
    role='admin'
)
db.session.add(admin)
db.session.commit()
print('Admin user created successfully')
"
```

## ملاحظات مهمة:
- الخطة المجانية في Render تدعم 750 ساعة شهرياً
- قد تحتاج إلى ترقية الخطة للاستخدام المكثف
- يمكن ربط نطاق مخصص في الإعدادات المتقدمة

## بيانات الدخول الافتراضية:
- **المسؤول**: admin / admin123
- **مستخدم عادي**: user / user123

## الميزات المتاحة:
- ✅ تسجيل المستخدمين وتسجيل الدخول
- ✅ إضافة الأماكن السياحية
- ✅ نظام الموافقة للمسؤولين
- ✅ الباقات المدفوعة والإعلانات
- ✅ البحث والتصفية
- ✅ واجهة إدارية شاملة

