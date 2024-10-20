from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Project

class UserRegistrationAndLoginTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Sample data for regular user and admin user
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'isAdmin': False
        }
        self.admin_data = {
            'username': 'adminuser',
            'password': 'adminpassword123',
            'isAdmin': True
        }

   
class ProjectViewSetTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Create regular user
        self.user = User.objects.create_user(username='testuser', password='testpassword123')

        # Create admin user
        self.admin_user = User.objects.create_user(username='adminuser', password='adminpassword123', is_staff=True)

        # Create tokens for users
        self.user_token = Token.objects.create(user=self.user)
        self.admin_token = Token.objects.create(user=self.admin_user)

    def test_create_project_as_admin(self):
        """Admin should be able to create a project"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        response = self.client.post(reverse('project-list'), {
            'name': 'New Project',
            'description': 'This is a test project',
            'priority': 'high',
            'status': 'in progress',
            'assigned_to': self.user.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)

    def test_regular_user_cannot_create_project(self):
        """Regular user should not be able to create a project"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.user_token.key}')
        response = self.client.post(reverse('project-list'), {
            'name': 'Unauthorized Project',
            'description': 'Regular user attempting to create project',
            'priority': 'Low',
            'status': 'In progress'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_view_assigned_project(self):
        """Regular user can view only projects assigned to them"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        project = Project.objects.create(
            name='Assigned Project',
            description='Project for regular user',
            status='In progress',
            priority='Low',
            created_by=self.admin_user,
            assigned_to=self.user
        )

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.user_token.key}')
        response = self.client.get(reverse('project-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Assigned Project')

    def test_admin_can_update_project(self):
        """Admin should be able to update a project"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.admin_token.key}')
        project = Project.objects.create(
            name='Project to Update',
            description='Project to update',
            status='In progress',
            priority='mid',
            created_by=self.admin_user
        )

        update_data = {
            'name': 'Updated Project Name',
            'priority': 'high',
            'status': 'done',
        }
        response = self.client.put(reverse('project-detail', kwargs={'pk': project.id}), update_data)
        print(response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        project.refresh_from_db()
        self.assertEqual(project.name, 'Updated Project Name')

    def test_regular_user_cannot_update_project(self):
        """Regular user should not be able to update a project"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.user_token.key}')
        project = Project.objects.create(
            name='Project to Update',
            description='Project to update',
            status='In progress',
            priority='Mid',
            created_by=self.admin_user
        )
        response = self.client.put(reverse('project-detail', kwargs={'pk': project.id}), {
            'name': 'Unauthorized Update',
            'status': 'Done',
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
