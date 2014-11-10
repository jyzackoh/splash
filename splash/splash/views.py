from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest, HttpResponse
import splash.utils as utils
import splash.google_utils as google_utils
from django.views.decorators.csrf import csrf_exempt


def index(request):
	return render(request, 'index.html', {})

def new_program(request):
	return utils.generate_new_page(request, utils.generate_program_code())

def load_page(request, program_code):
	return utils.get_loaded_program(request, program_code)

@csrf_exempt 
def toggle_permissions(request, program_code, permission):
	response = utils.toggle_permissions(request, program_code, permission)
	return HttpResponse(response, content_type="application/json")

@csrf_exempt 
def load_program(request, program_code):
	response = utils.load_serialized_program(request, program_code)
	return HttpResponse(response, content_type="application/json")

@csrf_exempt 
def save_program(request, program_code):
	response = utils.save_program(request, program_code)
	return HttpResponse(response, content_type="application/json")

@csrf_exempt
def share_program(request, program_code):
	share_code = utils.share_program(request, program_code)
	if (share_code):
		return HttpResponse('{"success":"True", "data":"'+share_code+'"}', content_type="application/json")
	else:
		return HttpResponse('{"success":"False", "data":"Program not found!"}', content_type="application/json")

def not_found_page(request, program_code):
	return render(request, 'not_found.html', {"program_code": program_code})

def login(request):
	credential = google_utils.get_stored_credential(request)
	return google_utils.get_auth_action(request, credential)

def auth_return(request):
	if (not google_utils.token_is_valid(request)):
		print("invalid token")
		return  HttpResponseBadRequest()

	if 'error' in request.REQUEST:
		print("error")
		return redirect("/login")

	google_utils.get_new_credential(request)
	
	return redirect("/login")
