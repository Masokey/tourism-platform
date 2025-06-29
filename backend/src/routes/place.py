from flask import Blueprint, request, jsonify, session
from src.models.user import db
from src.models.place import Place

place_bp = Blueprint('place', __name__)

@place_bp.route('/', methods=['GET'])
def get_places():
    try:
        status = request.args.get('status', 'approved')
        category = request.args.get('category')
        featured = request.args.get('featured')
        
        query = Place.query
        
        if status:
            query = query.filter_by(status=status)
        
        if category:
            query = query.filter_by(category=category)
            
        if featured == 'true':
            query = query.filter_by(is_featured=True)
        
        # ترتيب الأماكن المميزة أولاً
        query = query.order_by(Place.is_featured.desc(), Place.created_at.desc())
        
        places = query.all()
        return jsonify([place.to_dict() for place in places]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@place_bp.route('/<int:place_id>', methods=['GET'])
def get_place(place_id):
    try:
        place = Place.query.get_or_404(place_id)
        return jsonify(place.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@place_bp.route('/', methods=['POST'])
def create_place():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('category'):
            return jsonify({'error': 'الاسم والفئة مطلوبان'}), 400
        
        place = Place(
            name=data['name'],
            description=data.get('description', ''),
            address=data.get('address', ''),
            phone=data.get('phone', ''),
            website=data.get('website', ''),
            category=data['category'],
            user_id=user_id,
            image_url=data.get('image_url', '')
        )
        
        db.session.add(place)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إضافة المكان بنجاح وهو في انتظار الموافقة',
            'place': place.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@place_bp.route('/<int:place_id>', methods=['PUT'])
def update_place(place_id):
    try:
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        place = Place.query.get_or_404(place_id)
        
        # التحقق من الصلاحيات
        if place.user_id != user_id and user_role != 'admin':
            return jsonify({'error': 'ليس لديك صلاحية لتعديل هذا المكان'}), 403
        
        data = request.get_json()
        
        if data.get('name'):
            place.name = data['name']
        if data.get('description'):
            place.description = data['description']
        if data.get('address'):
            place.address = data['address']
        if data.get('phone'):
            place.phone = data['phone']
        if data.get('website'):
            place.website = data['website']
        if data.get('category'):
            place.category = data['category']
        if data.get('image_url'):
            place.image_url = data['image_url']
        
        # المسؤول فقط يمكنه تغيير الحالة والميزة
        if user_role == 'admin':
            if 'status' in data:
                place.status = data['status']
            if 'is_featured' in data:
                place.is_featured = data['is_featured']
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث المكان بنجاح',
            'place': place.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@place_bp.route('/<int:place_id>', methods=['DELETE'])
def delete_place(place_id):
    try:
        user_id = session.get('user_id')
        user_role = session.get('user_role')
        
        if not user_id:
            return jsonify({'error': 'يجب تسجيل الدخول أولاً'}), 401
        
        place = Place.query.get_or_404(place_id)
        
        # التحقق من الصلاحيات
        if place.user_id != user_id and user_role != 'admin':
            return jsonify({'error': 'ليس لديك صلاحية لحذف هذا المكان'}), 403
        
        db.session.delete(place)
        db.session.commit()
        
        return jsonify({'message': 'تم حذف المكان بنجاح'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@place_bp.route('/pending', methods=['GET'])
def get_pending_places():
    try:
        user_role = session.get('user_role')
        
        if user_role != 'admin':
            return jsonify({'error': 'ليس لديك صلاحية للوصول لهذه البيانات'}), 403
        
        places = Place.query.filter_by(status='pending').order_by(Place.created_at.desc()).all()
        return jsonify([place.to_dict() for place in places]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@place_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = [
            {'value': 'restaurant', 'label': 'مطعم'},
            {'value': 'entertainment', 'label': 'ملاهي'},
            {'value': 'pharmacy', 'label': 'صيدلية'},
            {'value': 'hotel', 'label': 'فندق'},
            {'value': 'shopping', 'label': 'تسوق'},
            {'value': 'hospital', 'label': 'مستشفى'},
            {'value': 'gas_station', 'label': 'محطة وقود'},
            {'value': 'bank', 'label': 'بنك'},
            {'value': 'other', 'label': 'أخرى'}
        ]
        return jsonify(categories), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

