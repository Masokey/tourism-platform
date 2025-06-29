from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
from src.models.user import db
from src.models.package import Package, UserSubscription

package_bp = Blueprint('package', __name__)

@package_bp.route('/', methods=['GET'])
def get_packages():
    try:
        packages = Package.query.all()
        return jsonify([package.to_dict() for package in packages]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@package_bp.route('/', methods=['POST'])
def create_package():
    try:
        user_role = session.get('user_role')
        
        if user_role != 'admin':
            return jsonify({'error': 'ليس لديك صلاحية لإنشاء باقات'}), 403
        
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('price') or not data.get('duration'):
            return jsonify({'error': 'الاسم والسعر والمدة مطلوبة'}), 400
        
        package = Package(
            name=data['name'],
            description=data.get('description', ''),
            price=float(data['price']),
            duration=int(data['duration'])
        )
        
        db.session.add(package)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الباقة بنجاح',
            'package': package.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@package_bp.route('/subscribe', methods=['POST'])
def subscribe_to_package():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        data = request.get_json()
        
        if not data or not data.get('package_id'):
            return jsonify({'error': 'معرف الباقة مطلوب'}), 400
        
        package = Package.query.get_or_404(data['package_id'])
        
        # التحقق من عدم وجود اشتراك نشط
        active_subscription = UserSubscription.query.filter_by(
            user_id=user_id,
            is_active=True
        ).first()
        
        if active_subscription:
            return jsonify({'error': 'لديك اشتراك نشط بالفعل'}), 400
        
        # إنشاء اشتراك جديد
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=package.duration)
        
        subscription = UserSubscription(
            user_id=user_id,
            package_id=package.id,
            start_date=start_date,
            end_date=end_date,
            is_active=True
        )
        
        db.session.add(subscription)
        
        # تحديث دور المستخدم إلى premium
        from src.models.user import User
        user = User.query.get(user_id)
        user.role = 'premium'
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم الاشتراك في الباقة بنجاح',
            'subscription': subscription.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@package_bp.route('/my-subscriptions', methods=['GET'])
def get_my_subscriptions():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        subscriptions = UserSubscription.query.filter_by(user_id=user_id).order_by(UserSubscription.created_at.desc()).all()
        return jsonify([subscription.to_dict() for subscription in subscriptions]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@package_bp.route('/check-subscription', methods=['GET'])
def check_subscription():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        # التحقق من الاشتراكات المنتهية الصلاحية
        expired_subscriptions = UserSubscription.query.filter(
            UserSubscription.user_id == user_id,
            UserSubscription.is_active == True,
            UserSubscription.end_date < datetime.utcnow()
        ).all()
        
        # إلغاء الاشتراكات المنتهية
        for subscription in expired_subscriptions:
            subscription.is_active = False
        
        # تحديث دور المستخدم إذا لم يعد لديه اشتراك نشط
        active_subscription = UserSubscription.query.filter_by(
            user_id=user_id,
            is_active=True
        ).filter(UserSubscription.end_date > datetime.utcnow()).first()
        
        from src.models.user import User
        user = User.query.get(user_id)
        
        if not active_subscription and user.role == 'premium':
            user.role = 'user'
        
        db.session.commit()
        
        return jsonify({
            'has_active_subscription': active_subscription is not None,
            'subscription': active_subscription.to_dict() if active_subscription else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

