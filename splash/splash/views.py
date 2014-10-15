from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest
import splash.utils as utils
import splash.google_utils as google_utils

def new_program(request, permission):
	return utils.generate_new_page(request, permission)

def load_program(request, program_code):
	return utils.get_loaded_program(request, program_code)

def toggle_permissions(request, program_code, permission):
	print("TOGGLING " + str(program_code) + " to " + str(permission) + "!")
	return redirect("/"+program_code)

def save_program(request, program_code):
	print("SAVING " + str(program_code) + "!")
	return redirect("/"+program_code)

def not_found_page(request, program_code):
	return render(request, 'not_found.html', {"program_code": program_code})

def index(request):
	credential = google_utils.get_stored_credential(request)
	return google_utils.get_auth_action(request, credential)

def auth_return(request):
	if (not google_utils.token_is_valid(request)):
		print("invalid token")
		return  HttpResponseBadRequest()

	if 'error' in request.REQUEST:
		print("error")
		return redirect("/")

	google_utils.get_new_credential(request)
	
	return redirect("/")
