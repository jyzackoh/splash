from django.shortcuts import render, redirect
import splash.gateway as gateway
import random, string, os
from . import settings
from django.http import HttpResponseRedirect

import httplib2, urllib2
from splash.models import CredentialsModel
from oauth2client import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.django_orm import Storage
from apiclient.discovery import build

def new_program(request, permission):
	if (permission != 'PU' and permission != 'PR'):
		return redirect('/')
	generate_page_args = {
		'program_code': generate_program_code(),
		'permission': permission,
		'owner': ''
	}
	return generate_new_page(request, generate_page_args)


def load_program(request, program_code):
	#Check if program_code exists
	if (gateway.program_is_exist(program_code)):
		if (gateway.program_is_private(program_code)):
			#Check if authorized and program owner == user. if yes, return page. else, redirect to main page with unauthorized msg
			return render(request, 'program.html', {"url_sub_folder": program_code + 'is private', "request": request})
		else:
			return render(request, 'program.html', {"url_sub_folder": program_code})
	else:
		generate_page_args = {
			'program_code': program_code,
			'permission': 'PR',
			'owner': ''
		}
		return generate_new_page(request, generate_page_args)


def not_found_page(request, program_code):
	return render(request, 'not_found.html', {"program_code": program_code})


def generate_new_page(request, generate_page_args):
	#Generate a new program object
	gateway.add_new_program(generate_page_args['program_code'], generate_page_args['permission'], generate_page_args['owner'])
	#Tie this new program_code to user and empty string
	return redirect('/'+generate_page_args['program_code'])


def generate_program_code():
	new_code = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(5))
	while (gateway.program_is_exist(new_code)):
		new_code = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(5))
	return new_code

# The key is held in a CREDENTIALS object
# All the steps needed to go through getting CREDENTIALS is in a FLOW object
# Since keys can change over time, a STORAGE object is used for storing and retriving keys
# Set up and run a FLOW to get CREDENTIALS to keep in STORAGE
# Access STORAGE for the key when needed



CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), '..', 'client_secrets.json')

print(CLIENT_SECRETS)

FLOW = flow_from_clientsecrets(
	CLIENT_SECRETS,
	scope=['https://www.googleapis.com/auth/plus.profile.emails.read', 'profile'],
	redirect_uri='http://localhost:8000/oauth2callback')

def index(request):
	google_id = None
	credential = None
	if request.session.get('google_id', False):
		google_id = str(request.session.get('google_id'))
		storage = Storage(CredentialsModel, 'id', google_id, 'credential')
		credential = storage.get()

	if credential is None or credential.invalid == True:
		# IMPORTANT settings.SECRETKEY?!?!
		FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, request.user.id)
		authorize_url = FLOW.step1_get_authorize_url()
		return HttpResponseRedirect(authorize_url)
	else:
		# To authorize any http requests with credentials. We might not need this as we only need authentication!
		http = httplib2.Http()
		http = credential.authorize(http)
		return render(request, 'index.html', {})

def auth_return(request):
	if not xsrfutil.validate_token(settings.SECRET_KEY, request.REQUEST['state'], request.user.id):
		return  HttpResponseBadRequest()

	if 'error' in request.REQUEST:
		return HttpResponseRedirect("/")

	#We don't even want to store the user's stuff. Just need their Email. So we get the credential and just apply it to current session.
	#Current settings only work for localhost version.
	credential = FLOW.step2_exchange(request.REQUEST['code'])
	
	http = httplib2.Http()
	http = credential.authorize(http)

	user_info_service = build(
		serviceName='oauth2', version='v2',
		http=http)
	user_info = None
	try:
		user_info = user_info_service.userinfo().get().execute()
	except:
		logging.error('An error occurred: %s', e)

	if (user_info and user_info.get('id')):
		##We can now use this user id to check whether the page can be rendered/store it in a cookie.
		request.session['google_id'] = str(user_info.get('id'))
		storage = Storage(CredentialsModel, 'id', str(request.session['google_id']), 'credential')
		storage.put(credential)
	
	return HttpResponseRedirect("/")
