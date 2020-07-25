'''
Routes for handling REST API requests
'''
from django.urls import path
from .views import authenticate_user,UserView,logout_user,FileView

urlpatterns = [
    path('login/<str:phone_no>',authenticate_user),
    path('logout',logout_user),
    path('register',UserView.as_view()),
    path('upload/<str:id>',FileView.as_view()),
    path('get_user_data/<str:id>',UserView.as_view())
]