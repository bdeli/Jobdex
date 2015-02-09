from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from card.models import *
from user.models import *
from user.forms import *
from django.core import serializers
from django.http import Http404

@csrf_exempt
def signup_view(request):
    if request.method == 'GET':
        raise Http404
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        email = request.POST['email']
        if not username or not password or not confirm_password or not email:
            error_message = "Please fill in all fields."
        elif password and password != confirm_password:
            error_message = "Passwords don't match"
        else:
            user_form = UserForm(data=request.POST)
            if user_form.is_valid():
                user = user_form.save()
                user.set_password(user.password)
                user.save()
                u = authenticate(username=username, password=password)
                login(request, u)
                # return JsonResponse(username_output, safe=False)
                return HttpResponseRedirect('/')
            else:
                error_message = user_form.errors.items()[0][1]
    else:
        error_message = None
    context = {'error_message': -2}
    return render(request, 'landing.html', context)

@csrf_exempt
def login_view(request):
    if request.method == 'GET':
        raise Http404
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username = username, password = password)
        if user is not None and user.is_active:
            login(request, user)
        else:
            context = {'error_message': -1}
            return render(request, 'landing.html', context)
        return redirect('home')
    else:
        return redirect('home')

@login_required
def logout_view(request):
    logout(request)
    return redirect('home')

@csrf_exempt
def page_not_found(request):
    return render(request, 'custom_404_page.html')

def change_password_page(request):
    return render(request, 'password-reset.html')

@login_required
def change_password(request):
    if request.method == 'POST':
        try:
            u = User.objects.get(username=request.user.username)
        except User.DoesNotExist:
            return redirect('home')
        current_pass = request.POST['current']
        new_pass = request.POST['new']
        confirm_pass = request.POST['confirm']
        if not u.check_password(current_pass):
            error_message = "Incorrect Password"
        elif not current_pass or not new_pass or not confirm_pass:
            error_message = "Missing Fields"
        elif new_pass != confirm_pass:
            error_message = "Passwords don't match"
        elif new_pass == current_pass:
            error_message = "Passwords cannot be the same"
        else:
            u.set_password(new_pass)
            u.save()
            return render(request, 'index.html')
        context = {'error_message': error_message}
        return render(request, 'change_password.html', context)
    return render(request, 'change_password.html')
