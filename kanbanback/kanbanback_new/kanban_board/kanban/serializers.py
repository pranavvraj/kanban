from rest_framework import serializers
from .models import Board, Col, Comments, Emp, Task

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields ='__all__' 

class ColSerializer(serializers.ModelSerializer):
    class Meta:
        model = Col
        fields ='__all__' 

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields ='__all__' 

class EmpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emp
        fields ='__all__' 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields ='__all__' 

