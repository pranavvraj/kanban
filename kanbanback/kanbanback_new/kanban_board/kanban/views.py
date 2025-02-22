from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import TaskSerializer, BoardSerializer, ColSerializer, EmpSerializer
from rest_framework import status
from .models import Emp, Board, Task, Col
from django.contrib.auth.models import User
import os
from dotenv import load_dotenv
from django.views.decorators.csrf import csrf_exempt
import json
import anthropic
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny

load_dotenv()
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

class CustomTokenObtainPairView(TokenObtainPairView):
    pass  

class CustomTokenRefreshView(TokenRefreshView):
    pass

class RegisterView(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)

        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': str(refresh), 
        }, status=status.HTTP_201_CREATED)

@csrf_exempt
def ai_chatbot(request):
    
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        print("Received data:", data)

        user_query = data.get("query", "").strip()

        if not user_query:
            return JsonResponse({"response": "Please enter a question to get task details."})

        tasks = Task.objects.filter(
            Q(status="Not started") | Q(status="In progress") | Q(status="Completed")
        ).exclude(task_name__isnull=True).exclude(task_name="").values(
            "task_id", "task_name", "task_type", "start_date", "end_date",
            "reporter__empname", "assignee__empname", "priority", "description",
            "summary", "acceptance_criteria", "story_points", "status"
        ).distinct()
       
        pending_tasks = []
        completed_tasks = []
        high_priority_tasks = []
        assigned_users_reporters = []

        for task in tasks:
            task_details = f"""
            - **Task Name:** {task['task_name']}
            - **Type:** {task['task_type'] or 'N/A'}
            - **Start Date:** {task['start_date'] or 'N/A'}
            - **Due Date:** {task['end_date'] or 'N/A'}
            - **Reporter:** {task['reporter__empname'] or 'N/A'}
            - **Assignee:** {task['assignee__empname'] or 'N/A'}
            - **Priority:** {task['priority'] or 'N/A'}
            - **Summary:** {task['summary'] or 'N/A'}
            - **Description:** {task['description'] or 'N/A'}
            - **Acceptance Criteria:** {task['acceptance_criteria'] or 'N/A'}
            - **Story Points:** {task['story_points'] or 'N/A'}
            - **Status:** {task['status']}
            """

            if task["status"] == "Completed":
                completed_tasks.append(task_details)
            else:
                pending_tasks.append(task_details)

            if task["priority"] == 1: 
                high_priority_tasks.append(task_details)

            assigned_users_reporters.append(
                f"- **Assignee:** {task['assignee__empname'] or 'N/A'}, **Reporter:** {task['reporter__empname'] or 'N/A'}"
            )

        assigned_users_reporters_text = "\n".join(assigned_users_reporters) if assigned_users_reporters else "No specific assignees listed."

        prompt = f"""
        You are an intelligent AI assistant designed to provide precise and structured updates on tasks. Your responses should be clear, concise, and formatted for easy readability.

        ### ** Task Overview**
        - **Pending Tasks:**  
        {chr(10).join(pending_tasks) if pending_tasks else "No pending tasks."}
        
        - **Completed Tasks:**  
        {chr(10).join(completed_tasks) if completed_tasks else "No completed tasks."}
        
        - **High-Priority Tasks:**  
        {chr(10).join(high_priority_tasks) if high_priority_tasks else "No high-priority tasks."}

        - **Assigned Users & Reporters:**  
        {assigned_users_reporters_text}

        ### **🔎 User Query:**  
        "{user_query}"

        ### **📖 Response Guidelines**
        - Always keep responses **short and direct**, unless a detailed explanation is explicitly requested.
        - When listing multiple tasks, **format them in bullet points** for readability.
        - If the query relates to a **specific task**, provide all relevant details (status, priority, due date, assignee, etc.).
        - If the query asks about:
        - **Pending tasks:** List all tasks **not yet completed**.
        - **Completed tasks:** List tasks that have been **marked as done**.
        - **High-priority tasks:** Emphasize **urgent or time-sensitive** tasks.
        - **Assignees or reporters:** Group tasks under each responsible person.
        - **Task deadlines:** Display due dates and categorize tasks (e.g., "Overdue", "Due Today", "Upcoming").
        - If a task has **subtasks**, mention them in an indented format.
        - If the user asks something **not related to tasks**, acknowledge the query and **politely redirect them** to task-related discussions.
        - **Never disclose AI origins, internal processes, or company affiliations.** If asked, professionally deflect the question.
        - Ensure responses are **well-structured and professional** while maintaining a conversational tone.

        ### ** Response Example Format**
        - **Pending Tasks:**  
        - 🔹 *Task 1* (High Priority, Due: Feb 20)  
        - 🔹 *Task 2* (Medium Priority, Due: Feb 22)  

        - **Completed Tasks:**  
        - ✅ *Task A* (Completed on Feb 18)  
        - ✅ *Task B* (Completed on Feb 19)  

        If the query requires an **actionable recommendation** or decision-making input, phrase it accordingly.
        """

        print("Generated prompt:", prompt) 
        client = anthropic.Anthropic(api_key=anthropic_api_key)
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )

        return JsonResponse({"response": response.content[0].text})

    return JsonResponse({"error": "Invalid request"}, status=400)


class ApiOverview(APIView):
    def get(self):
        api_urls = {
            'List': '/task-list/'
        }
        return Response(api_urls)

class EmpView(APIView):
    def get(self):
        tasks = Emp.objects.all()
        serialized = EmpSerializer(tasks, many=True)
        return Response(serialized.data)

    def post(self, request):
        serialized = EmpSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        return Response(serialized.data)
    
class EmpView2(APIView):    
    def put(self, request, id):
        try:
            task = Emp.objects.get(emp_id=id)
            serialized = EmpSerializer(task, data=request.data, partial=True)
            if serialized.is_valid():
                serialized.save()
                
            return Response(serialized.data)
        except Emp.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, id):
        try:
            task = Emp.objects.get(emp_id=id)
            task.delete()
            return Response('Item successfully deleted!')
        except Emp.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

class BoardView(APIView):
    def get(self):
        tasks = Board.objects.all()
        serialized = BoardSerializer(tasks, many=True)
        return Response(serialized.data)

    def post(self, request):
        serialized = BoardSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()

        return Response(serialized.data)
    
class BoardView2(APIView):    
    def put(self, request, id):
        try:
            task = Board.objects.get(board_id=id)
            serialized = BoardSerializer(task, data=request.data, partial=True)
            if serialized.is_valid():
                serialized.save()

            return Response(serialized.data)
        except Board.DoesNotExist:
            return Response({'error': 'Board not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, id):
        task = Board.objects.get(board_id=id)
        task.delete()
        return Response('Item successfully deleted!')

class ColView(APIView):
    def get(self):
        tasks = Col.objects.all()
        serialized = ColSerializer(tasks, many=True)
        return Response(serialized.data)

    def post(self, request):
        serialized = ColSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()

        return Response(serialized.data)
    
class ColView2(APIView):    
    def put(self, request, id):
        try:
            task = Col.objects.get(col_id=id)
            serialized = ColSerializer(task, data=request.data, partial=True)
            if serialized.is_valid():
                serialized.save()

            return Response(serialized.data)
        except Col.DoesNotExist:
            return Response({'error': 'Col not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self,id):
        task = Col.objects.get(col_id=id)
        task.delete()
        return Response('Item successfully deleted!')

class TaskView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        not_started = Task.objects.filter(status='Not started').order_by('priority')
        in_progress = Task.objects.filter(status='In progress').order_by('priority')
        completed = Task.objects.filter(status='Completed').order_by('priority')

        not_started_serializer = TaskSerializer(not_started, many=True)
        in_progress_serializer = TaskSerializer(in_progress, many=True)
        completed_serializer = TaskSerializer(completed, many=True)

        data = {
            'not_started': not_started_serializer.data,
            'in_progress': in_progress_serializer.data,
            'completed': completed_serializer.data,
        }
        return Response(data)

    def post(self, request):
        serialized = TaskSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)        
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TaskView2(APIView):    
    permission_classes = [IsAuthenticated]
    def put(self, request, id):
        try:
            task = Task.objects.get(task_id=id)
            serialized = TaskSerializer(task, data=request.data, partial=True)
            if serialized.is_valid():
                serialized.save()
                return Response(serialized.data)
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
            
    
    def delete(self, request, id):  
        try:
            task = Task.objects.get(task_id=id)
            task.delete()
            return Response({'message': 'Item successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    

    





