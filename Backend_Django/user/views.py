from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import APIView,api_view,authentication_classes,permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import logout,authenticate,login
from .models import RegisterModel
from .serializers import RegisterSerializer
from rest_framework.response import Response
from django.db import connection
from rest_framework.authentication import SessionAuthentication,BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse, HttpResponseNotFound, Http404,  HttpResponseRedirect, FileResponse
from django.utils.encoding import smart_str
from django.conf import settings

def index(request):
    ''' For rendering the angular Compiled Code'''
    return render(request,'index.html')

@api_view(['GET'])
def authenticate_user(request,phone_no):    
    ''' Creating Sessions and Authenticating user
    If the user exists with that Phone No. in Database '''
    username= phone_no
    password = phone_no
    try :
        user = User.objects.get(username=username)
        request.session[username] = user.id #for storing sessions in django.contrib.sessions.models.Session
        authenticate(request)
        login(request,user)
        user_data = RegisterModel.objects.filter(phone_no=username)
        serialized_data = RegisterSerializer(user_data,many=True)
        return Response(serialized_data.data[0])
    except User.DoesNotExist:
        return Response({'error':'User with These Credentials Does not Exists'},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def logout_user(request):
    if request.user.is_authenticated:
        logout(request) # authomatically flushes the Session from the model
        return Response({'success':'User successfully logged out'})
    return Response({'error':'User Not Authenticated'},status=401)

def strip_spaces_from_data(obj):
    ''' For Stripping Spaces from the request body'''
    for i in obj:
        if type(obj[i]) == str:
            obj[i] = obj[i].strip()

class UserView(APIView):
    def put(self,request):
        ''' Registering a new user ,
         and checking if the user with that Phone No. already exists'''
        strip_spaces_from_data(request.data)
        data = request.data
        serialized_data = RegisterSerializer(data = request.data)
        try:
            check_user = User.objects.get(username = request.data['phone_no'])
            return Response({'error':'User with This Phone no. Already Exists'},status = status.HTTP_409_CONFLICT)
        except User.DoesNotExist:
            if serialized_data.is_valid():
                serialized_data.save()
                user = User.objects.create(username=request.data['phone_no'],password=request.data['phone_no'],email=request.data['email_id'])                
                return Response(serialized_data.data,status=status.HTTP_201_CREATED)                
            return Response(serialized_data.errors,status=status.HTTP_409_CONFLICT)
    
    @authentication_classes([BasicAuthentication,SessionAuthentication])    
    def get(self,request,id):
        ''' Getting the User Data'''
        user_data = RegisterModel.objects.filter(id = id)
        serialized_data = RegisterSerializer(user_data,many=True)
        return Response(serialized_data.data[0])

    @authentication_classes([BasicAuthentication,SessionAuthentication])
    def post(self,request):
        ''' Updating User data from Dashboard '''
        strip_spaces_from_data(request.data)
        data = request.data
        user_id = data['id']
        try :
            del data['id']
            num = RegisterModel.objects.filter(id=user_id).update(**data)
            return Response({'success':'Data Succesfully Updated'},status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response({'error':'Error Occured Contact Support'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
    

class FileView(APIView):
    @authentication_classes([BasicAuthentication,SessionAuthentication])
    @permission_classes([IsAuthenticated])
    def post(self, request, id):
        ''' For uploading Files according to RegUserId '''
        if request.FILES:
            data = RegisterModel.objects.get(id=id)
            data.profile_image = request.FILES.get('file')
            data.save()
            return Response({'success': 'Profile Pic Succesfully Uploaded'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'No File Attached'}, status=status.HTTP_204_NO_CONTENT)

    def get(self, request, id):
        ''' For downloading image according to RegUserId '''
        data = RegisterModel.objects.get(pk=id)
        image_url = str(data.profile_image)
        image_path = settings.MEDIA_ROOT + '\\' + image_url.replace('/', '\\')        
        try:
            with open(image_path, 'rb') as image_upload:
                image_data = image_upload.read()
        except IOError: # if the image doesn't exists then download the default image
            image_path = settings.MEDIA_ROOT + '\\' + 'profile_photo\\profile_image.jpg'
            with open(image_path, 'rb') as image_upload:
                image_data = image_upload.read()
        response = HttpResponse(image_data, content_type='image/png')
        response['Content-Disposition'] = 'attachment; filename=%s' % smart_str(
            image_url.split('/')[-1])
        response['X-Sendfile'] = smart_str(image_path)                        
        return response