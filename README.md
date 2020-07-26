# User Profile Management
### Mavenai Technologies Python/Django Assignment

This is a [website](http://18.206.208.159) in which the user can register through details and manage and update the profile.

# DEPLOYED LINK
[http://18.206.208.159](http://18.206.208.159)

Deployed in aws using ec2 instance with manually doing the configuration of gunicorn and nginx

## Technologies Used
- **Frontend**:- Angular 9
- **Backend**:- Django 3.0.8
- **Database**: MongoDB Atlas

## PREREQUISITES
- NodeJS Installed
- @angular/cli installed
- Python Virtualenv installed

## How To Run App

#### Running Backend
- First you need to create a virtual environment using virtualenv
> virtualenv venv
- Activate the Virtual environment by
> cd venv/Scripts/activate
- Install the required python modules inside
> cd backend/
> pip install -r requirements.txt
- After that goto backend folder and run
> python manage.py runserver
- After this the backend will run at localhost:8000

### Running Frontend
- For installing all dependencies run
> npm install
- For running Angular code
> ng serve
- After this the frontend will run at localhost:4200