from rest_framework.permissions import BasePermission
from rest_framework import status
from rest_framework.response import Response

class IsAuthenticatedUser(BasePermission):

    def has_permission(self, request, view):
        print(request.user)
        is_authenticated = request.user and request.user.is_authenticated
        print('inside the permission class')
        if not is_authenticated:
            print('not authenticated')
            
            return False
        return Response({'error' : 'user is not Authenticated' } , status=status.HTTP_400_BAD_REQUEST)