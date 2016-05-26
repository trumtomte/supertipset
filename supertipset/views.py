from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password, make_password

from api.models import User

# Front page
def index(request):
    return render(request, 'supertipset/index.html')

# Login page
def login(request):
    # POST
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # TODO error message
        if username == '' or password == '':
            ctx = {"error": True}
            return render(request, 'supertipset/login.html', ctx) 

        # No user exists
        users = User.objects.filter(username=username)
        if len(users) == 0:
            ctx = {"error": True}
            return render(request, 'supertipset/login.html', ctx) 

        user = users[0]

        # Password is incorrect
        if not check_password(password, user.password):
            ctx = {"error": True}
            return render(request, 'supertipset/login.html', ctx) 

        request.session['user_id'] = user.id
        
        return redirect('/s/') 

    # GET
    else:
        return render(request, 'supertipset/login.html')

def register(request):
    if request.method == 'POST':
        # Request data
        email = request.POST.get('email')
        username = request.POST.get('username')
        firstname = request.POST.get('firstname')
        lastname = request.POST.get('lastname')
        password_1 = request.POST.get('password1')
        password_2 = request.POST.get('password2')

        args = [email, username, firstname, lastname, password_1, password_2]

        # One or more arguments are missing
        if any(v == '' for v in args):
            ctx = {"error": True}
            return render(request, 'supertipset/register.html', ctx)

        # Passwords are not equal
        if password_1 != password_2:
            ctx = {"error": True}
            return render(request, 'supertipset/register.html', ctx)

        # NOTE: should we check for email as well?
        # Username already exists
        users = User.objects.filter(username=username)
        if len(users) > 0:
            ctx = {"error": True}
            return render(request, 'supertipset/register.html', ctx)

        # TODO: salt
        # Create password hash
        password_hash = make_password(password_1)

        # Create a new user
        user = User(email=email, username=username, firstname=firstname,
                    lastname=lastname, password=password_hash)
        # TODO: error handling?
        user.save()
        request.session['user_id'] = user.id

        return redirect('/s/')
    else:
        return render(request, 'supertipset/register.html')

# Logout
def logout(request):
    if request.session.get('user_id', False):
        del request.session['user_id']

    return redirect('/')

# The App
def app(request):
    user_id = request.session.get('user_id', False)

    if not user_id:
        return redirect('/login/')

    # check which tournament is the current one (Default = 1)
        # check from date fields etc
    # get current user by id
        # get user bets by tournament
        # get user points by tournament
        # get user specialbets by tournament
        # get user specialbetsresults by tournament
    # specialbets by tournament (so we can see each users country)
    # profile, empty object
    # get rounds by tournament
    # get games by tournament
    # get results by tournament
    # get groups
    # get teams
    # get players

    ctx = {"user_id": user_id}

    return render(request, 'supertipset/app.html', ctx)
