import pytest
from rest_framework.test import APIClient
from useracc.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from theatre_owner.models import TheaterOwnerProfile

@pytest.fixture
def create_test_user(db):
    def make_user(**kwargs):
        return User.objects.create_user(
            username=kwargs.get("username", "testuser"),
            email=kwargs.get("email", "test@example.com"),
            password=kwargs.get("password", "pass1234")
        )
    return make_user
@pytest.fixture
def authenticated_client(create_test_user):
    
    """
    returns a tuple : ( authenticated api client , created user)
    """
    user = create_test_user()
    refresh = RefreshToken.for_user(user)
    token = str(refresh.access_token)
    
    
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    # return authenticated client
    return client , user


@pytest.fixture
def create_theatre_owner(make_user):
    user = make_user
    return TheaterOwnerProfile.objects.create(
        user = user ,
        theatre_name = "bharathi_theatres",
       location = 'malappuram',
       state = "kerala",
    )