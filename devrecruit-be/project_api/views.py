from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,AdminUserSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth import authenticate
from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework import viewsets
from django.contrib.auth.models import User


class RegisterAndLoginUserView(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        SerializerClass = UserSerializer
        isAdmin = bool(request.data.get('isAdmin'))  # Simplified isAdmin check
        if isAdmin:
            SerializerClass = AdminUserSerializer

        username = request.data.get('username')
        password = request.data.get('password')
        isRegistering = request.data.get('isRegistering')

        if not username or not password:
            return Response({'message': "Please fill the form properly"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle registration
        if isRegistering:
            serializer = SerializerClass(data=request.data)
            if serializer.is_valid():
                serializer.save()
                token = Token.objects.create(user=serializer.instance)
                return Response({"token": token.key, "isAdmin": isAdmin}, status=status.HTTP_201_CREATED)
            return Response({"message": "User with this username exists or password is too short"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle login
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, "isAdmin": user.is_staff}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "User with these details doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterAdminUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            token=Token.objects.create(user=serializer.instance)
            return Response({"token":token.key} ,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    # Override the get_queryset method to filter based on the user's role
    def get_queryset(self):
        user = self.request.user
        # Admins can see all projects
        if user.is_staff:
            return Project.objects.all()
        # Regular users can only see the projects assigned to them
        return Project.objects.filter(assigned_to=user)



class ViewUsers(APIView):
    permission_classes=[AllowAny]

    def get(self, request):
        user=User.objects.all()
        serializer=UserSerializer(user,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
