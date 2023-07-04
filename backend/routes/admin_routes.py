from flask import Blueprint, jsonify
from services.user_service import delete_user, get_user_by_id, get_all_users

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/admin')


@admin_bp.route('/users', methods=['GET'])
def get_users():
    # Retrieve all users from the database
    users = get_all_users()

    # Serialize the users into a response
    user_list = []
    for user in users:
        user_date = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_approved': user.is_approved,
            'admin': user.admin,
        }
        user_list.append(user_date)

    return jsonify(users=user_list), 200


@admin_bp.route('/users/<int:user_id>/approve', methods=['PUT'])
def approve_user(user_id):
    # Retrieve the user from the database
    user = get_user_by_id(user_id)

    if user is None:
        return jsonify(message='User not found'), 404

    # Approve the user
    user.is_approved = True
    user.update()

    return jsonify(message='User approved'), 200


@admin_bp.route('/users/<int:user_id>/disapprove', methods=['PUT'])
def disapprove_user(user_id):
    # Retrieve the user from the database
    user = get_user_by_id(user_id)

    if user is None:
        return jsonify(message='User not found'), 404

    # Disapprove the user
    user.is_approved = False
    user.update()

    return jsonify(message='User disapproved'), 200


@admin_bp.route('/users/<int:user_id>/promote', methods=['PUT'])
def promote_user(user_id):
    # Retrieve the user from the database
    user = get_user_by_id(user_id)

    if user is None:
        return jsonify(message='User not found'), 404

    # Promote the user
    user.admin = True
    user.update()

    return jsonify(message='User promoted'), 200


@admin_bp.route('/users/<int:user_id>/demote', methods=['PUT'])
def demote_user(user_id):
    # Retrieve the user from the database
    user = get_user_by_id(user_id)

    if user is None:
        return jsonify(message='User not found'), 404

    # Demote the user
    user.admin = False
    user.update()

    return jsonify(message='User demoted'), 200

@admin_bp.route('/users/<int:user_id>/delete', methods=['DELETE'])
def delete_user_route(user_id):
    # Retrieve the user from the database
    user = get_user_by_id(user_id)
    
    if user is None:
        return jsonify(message='User not found'), 404
    
    # Delete the user
    delete_user(user)
    
    return jsonify(message='User deleted'), 200