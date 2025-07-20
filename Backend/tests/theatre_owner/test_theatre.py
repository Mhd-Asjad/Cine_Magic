import pytest
from rest_framework.test import APIClient
from useracc.models import User
import logging
from django.urls import reverse

logger = logging.getLogger(__name__)

@pytest.mark.django_db
def test_create_theatre(authenticated_client):
    client = APIClient()
    client , user = authenticated_client
    
    payload = {
        "user" : user.id ,
       "theatre_name" : "bharathi_theatres",
       "location" : 'malappuram',
       "state" : "kerala",
    }
    
    response = client.post(reverse('create_profile'), payload , format='json')
    logger.info(f'theatre created : {response.data}')
    assert response.status_code == 201
    assert response.data["data"]["theatre_name"] == "bharathi_theatres"
            
@pytest.mark.django_db
def test_confirmation_theatre(authenticated_client , create_theatre_owner):
    client , user = authenticated_client
    owner = create_theatre_owner
    
    payload = {
        'id': owner.id,
        'ownership_status' : 'rejected',
        'rejection_reason' : 'create a proper documentation for this'
    }
    response = client.post(reverse('theatreowners'), payload , format='json')
    data = response.data
    logger.info(f'response for change status : {data}')