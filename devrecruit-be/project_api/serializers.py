from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Project


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','username', 'password']

    def create(self, validated_data):
        # Create a regular user (non-admin)
        user = User.objects.create_user(
            username=validated_data['username'],
            # email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class AdminUserSerializer(UserSerializer):
    def create(self, validated_data):
        # Create an admin user
        user = User.objects.create_superuser(
            username=validated_data['username'],
            # email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)  # Serialize the creator's info
    assigned_to = UserSerializer(read_only=True)  # Serialize the assigned user's info

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'priority', 'created_by', 'assigned_to', 'date_created',]
        read_only_fields = ['id', 'created_by', 'date_created',]  # 'created_by' and 'date_created' are read-only
        extra_kwargs = {
            'description': {'required': False},  # Make description optional
        }

    # Override the create method to set the 'created_by' and 'assigned_to' fields automatically
    def create(self, validated_data):
        print(self.context['request'].data)
        
        assigned_to_id = self.context['request'].data.get('assigned_to') # Remove assigned_to from validated_data
        validated_data['created_by'] = self.context['request'].user  # Set the created_by field
        # Create the project instance first
        project = super().create(validated_data)

        # If assigned_to_id is provided, fetch the user and assign it
        if assigned_to_id is not None:
            try:
                user = User.objects.get(id=assigned_to_id)  # Fetch the user by ID
                project.assigned_to = user  # Assign the user to the project
                project.save()  # Save the project instance again
            except User.DoesNotExist:
                raise serializers.ValidationError({"assigned_to": "User does not exist."})

        return project

    def update(self, instance, validated_data):
        assigned_to_id = self.context['request'].data.get('assigned_to') # Remove assigned_to from validated_data

        # Use the built-in update method for the model instance
        instance = super().update(instance, validated_data)

        # If assigned_to_id is provided, fetch the user and assign it
        if assigned_to_id is not None:
            try:
                user = User.objects.get(id=assigned_to_id)  # Fetch the user by ID
                instance.assigned_to = user  # Assign the user to the project
                instance.save()  # Save the project instance again
            except User.DoesNotExist:
                raise serializers.ValidationError({"assigned_to": "User does not exist."})

        return instance