from django.test import TestCase
from .models import TheaterOwnerProfile
from rest_framework.test import APITestCase
from rest_framework import status 
from django.urls import reverse
from useracc.models import User
import logging
# Create your tests here.

logger = logging.getLogger(__name__)

class TheatreOwnerTestcase(TestCase):
    
    def test_simplemath(self):
    
        self.assertEqual(2+2 , 4)
        self.assertEqual([1, 2], [1, 2])
    # def test_owner_registration(self):
    #     url = reverse('create_profile')
    #     user = User.objects.get(id=18)
    #     data = {
            
    #         "user" : user ,
    #         "theatre_name" : 'kalpaka',
    #         "location" : 'mukkam',
    #         'state' : 'kerala'
    #     }
    #     print(user.username)
    #     response = self.client.post(url , data ,  format="json")
    #     logger.info(f'after calling url {response}')
    #     self.assertEqual(response.status_code , status.HTTP_201_CREATED)
        
    