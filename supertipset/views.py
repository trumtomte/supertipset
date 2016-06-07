from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password, make_password

from api.models import User, Tournament

# Front page
def index(request):
    tournaments = Tournament.objects.all()
    ctx = {"tournaments": tournaments}
    return render(request, 'supertipset/index.html', ctx)

# Login page
def login(request):
    tournaments = Tournament.objects.all()

    # POST
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        if username == '' or password == '':
            ctx = {
                "error_login": True,
                "tournaments": tournaments
            }
            return render(request, 'supertipset/index.html', ctx) 

        users = User.objects.filter(username=username)

        # Username does not exist
        if len(users) == 0:

            # Try with the email as well
            users = User.objects.filter(email=username)
            if len(users) == 0:
                ctx = {
                    "error_login": True,
                    "tournaments": tournaments
                }
                return render(request, 'supertipset/index.html', ctx) 

        user = users[0]

        # Password is incorrect
        if not check_password(password, user.password):
            ctx = {
                "error_login": True,
                "tournaments": tournaments
            }
            return render(request, 'supertipset/index.html', ctx) 

        request.session['user_id'] = user.id
        request.session['tournament'] = request.POST.get('tournament')
        return redirect('/s/') 
    # GET
    else:
        return redirect('/')

def register(request):
    tournaments = Tournament.objects.all()

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
            ctx = {
                "error_register": True,
                "tournaments": tournaments
            }
            return render(request, 'supertipset/index.html', ctx)

        # Passwords are not equal
        if password_1 != password_2:
            ctx = {
                "error_register": True,
                "tournaments": tournaments
            }
            return render(request, 'supertipset/index.html', ctx)

        # NOTE: should we check for email as well?
        # Username already exists
        users = User.objects.filter(username=username)
        if len(users) > 0:
            ctx = {
                "error_register": True,
                "tournaments": tournaments
            }
            return render(request, 'supertipset/index.html', ctx)

        # TODO: salt
        # Create password hash
        password_hash = make_password(password_1)

        # Create a new user
        user = User(email=email, username=username, firstname=firstname,
                    lastname=lastname, password=password_hash)
        # TODO: error handling?
        user.save()
        request.session['user_id'] = user.id

        return redirect('/')
    else:
        return redirect('/')

# Logout
def logout(request):
    if request.session.get('user_id', False):
        del request.session['user_id']

    return redirect('/')

# The App
def app(request):
    user_id = request.session.get('user_id', False)
    tournament = request.session.get('tournament', False)

    if not user_id or not tournament:
        return redirect('/login/')

    # TODO: send initial data to server?

    ctx = {
        "user_id": user_id,
        "tournament": tournament
    }

    return render(request, 'supertipset/app.html', ctx)

# 404 page
def page_not_found(request):
    return render(request, 'supertipset/404.html')

# 500 page
def internal_server_error(request):
    return render(request, 'supertipset/500.html')
