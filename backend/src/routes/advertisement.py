from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
from src.models.user import db
from src.models.advertisement import Advertisement

advertisement_bp = Blueprint('advertisement', __name__)

@advertisement_bp.route('/', methods=['GET'])
def get_advertisements():
    try:
        # عرض الإعلانات النشطة فقط
        current_time = datetime.utcnow()
        advertisements = Advertisement.query.filter(
            Advertisement.is_active == True,
            Advertisement.start_date <= current_time,
            Advertisement.end_date >= current_time
        ).order_by(Advertisement.created_at.desc()).all()
        
        return jsonify([ad.to_dict() for ad in advertisements]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@advertisement_bp.route('/', methods=['POST'])
def create_advertisement():
    try:
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        # فقط المستخدمين المدفوعين والمسؤولين يمكنهم إنشاء إعلانات
        if user_role not in ['premium', 'admin']:
            return jsonify({'error': 'يجب أن تكون مشتركاً في باقة مدفوعة لإنشاء إعلانات'}), 403
        
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('content'):
            return jsonify({'error': 'العنوان والمحتوى مطلوبان'}), 400
        
        # تحديد تاريخ انتهاء الإعلان (افتراضياً 30 يوماً)
        start_date = datetime.utcnow()
        end_date_str = data.get('end_date')
        
        if end_date_str:
            try:
                end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
            except:
                return jsonify({'error': 'تنسيق تاريخ الانتهاء غير صحيح'}), 400
        else:
            end_date = start_date + timedelta(days=30)
        
        advertisement = Advertisement(
            user_id=user_id,
            place_id=data.get('place_id'),
            title=data['title'],
            content=data['content'],
            image_url=data.get('image_url', ''),
            start_date=start_date,
            end_date=end_date,
            is_active=True
        )
        
        db.session.add(advertisement)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الإعلان بنجاح',
            'advertisement': advertisement.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@advertisement_bp.route('/my-ads', methods=['GET'])
def get_my_advertisements():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        advertisements = Advertisement.query.filter_by(user_id=user_id).order_by(Advertisement.created_at.desc()).all()
        return jsonify([ad.to_dict() for ad in advertisements]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@advertisement_bp.route('/<int:ad_id>', methods=['PUT'])
def update_advertisement(ad_id):
    try:
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        advertisement = Advertisement.query.get_or_404(ad_id)
        
        # التحقق من الصلاحيات
        if advertisement.user_id != user_id and user_role != 'admin':
            return jsonify({'error': 'ليس لديك صلاحية لتعديل هذا الإعلان'}), 403
        
        data = request.get_json()
        
        if data.get('title'):
            advertisement.title = data['title']
        if data.get('content'):
            advertisement.content = data['content']
        if data.get('image_url'):
            advertisement.image_url = data['image_url']
        if 'place_id' in data:
            advertisement.place_id = data['place_id']
        if 'is_active' in data:
            advertisement.is_active = data['is_active']
        
        if data.get('end_date'):
            try:
                advertisement.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
            except:
                return jsonify({'error': 'تنسيق تاريخ الانتهاء غير صحيح'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث الإعلان بنجاح',
            'advertisement': advertisement.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@advertisement_bp.route('/<int:ad_id>', methods=['DELETE'])
def delete_advertisement(ad_id):
    try:
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        advertisement = Advertisement.query.get_or_404(ad_id)
        
        # التحقق من الصلاحيات
        if advertisement.user_id != user_id and user_role != 'admin':
            return jsonify({'error': 'ليس لديك صلاحية لحذف هذا الإعلان'}), 403
        
        db.session.delete(advertisement)
        db.session.commit()
        
        return jsonify({'message': 'تم حذف الإعلان بنجاح'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

