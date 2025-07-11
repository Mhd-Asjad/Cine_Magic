from django.test import TestCase
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from .views import UserRegisterView
from rest_framework import status

# Create your tests here.


class UserRegisterViewTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_user_registeer(self):
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "securepassword",
        }
        request = self.factory.post("/register/", data, format="json")
        view = UserRegisterView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
