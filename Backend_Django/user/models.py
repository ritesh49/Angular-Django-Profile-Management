# from django.db import models
from djongo import models
from django_resized import ResizedImageField

class RegisterModel(models.Model):
    '''DB Model for Registering User'''    
    full_name = models.CharField(default='',max_length=100)
    dob = models.DateField(default='2020-07-22')
    phone_no = models.BigIntegerField(default=0)
    email_id = models.EmailField(default='')
    passport_num = models.CharField(default='0',max_length=12)
    # Resize the image after uploading using Pillow library
    profile_image = ResizedImageField(size=[200, 200],crop=['middle', 'center'],upload_to='profile_photo',blank=True , default='profile_photo/profile_image.jpg' ,max_length=100)

    def __str__(self):
        return self.full_name