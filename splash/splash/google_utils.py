from splash.models import CredentialsModel
from oauth2client import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.django_orm import Storage
from apiclient.discovery import build
from django.shortcuts import render, redirect
from . import settings
import httplib2, urllib2, os

CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), '..', 'client_secrets.json')

FLOW = flow_from_clientsecrets(
	CLIENT_SECRETS,
	scope=['https://www.googleapis.com/auth/plus.profile.emails.read', 'profile'],
	redirect_uri='http://localhost:8000/oauth2callback')

def get_stored_credential(request):
	google_id = None
	credential = None
	if request.session.get('google_id', False):
		google_id = str(request.session.get('google_id'))
		storage = Storage(CredentialsModel, 'id', google_id, 'credential')
		credential = storage.get()
	return credential

def get_auth_action(request, credential):
	if credential is None or credential.invalid == True:
		FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, '')
		authorize_url = FLOW.step1_get_authorize_url()
		return redirect(authorize_url)
	else:
		# To authorize any http requests with credentials. We might not need this as we only need authentication!
		http = httplib2.Http()
		http = credential.authorize(http)
		return redirect('/new_program')

def token_is_valid(request):
	return xsrfutil.validate_token(settings.SECRET_KEY, request.REQUEST['state'], '')

def get_new_credential(request):
	credential = FLOW.step2_exchange(request.REQUEST['code'])
	http = httplib2.Http()
	http = credential.authorize(http)
	store_new_credential(request, http, credential)

def store_new_credential(request, http, credential):
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