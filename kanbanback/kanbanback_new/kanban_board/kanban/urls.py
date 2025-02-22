from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('homePage/', ApiOverview.as_view(), name='api-overview'),
    path('users/get/', EmpView.as_view(), name='user-list'),                          #for both get and post
    path('users/put/<str:id>/', EmpView2.as_view(), name='update-user'),
    path('users/delete/<str:id>/', EmpView2.as_view(), name='delete-user'),
    path('boards/get/', BoardView.as_view(), name='board-list'),                          #for both get and post
    path('boards/put/<str:id>/', BoardView2.as_view(), name='update-board'),
    path('boards/delete/<str:id>/', BoardView2.as_view(), name='delete-board'),
    path('tasks/get/', TaskView.as_view(), name='task-list'),                          #for both get and post
    path('tasks/put/<str:id>/', TaskView2.as_view(), name='update-task'),
    path('tasks/delete/<str:id>/', TaskView2.as_view(), name='delete-task'),
    path("chatbot/", ai_chatbot, name="ai_chatbot"),
]
