import random, string
from django.shortcuts import render, redirect
import splash.gateway as gateway

def get_google_id_string(request):
	owner = ''
	if request.session.get('google_id', False):
		owner = str(request.session.get('google_id'))
	return owner

def create_page_args(program_code, permission, owner):
	page_args = {
		'program_code': program_code,
		'permission': permission,
		'owner': owner
	}
	return page_args

def generate_program_code():
	new_code = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(5))
	while (gateway.program_is_exist(new_code)):
		new_code = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(5))
	return new_code

def generate_new_page(request, permission):
	owner = get_google_id_string(request)
	if (permission != 'PU' and permission != 'PR'):
		return redirect('/')

	program_code = generate_program_code()
	generate_page_args = create_page_args(program_code, permission, owner)
	gateway.add_new_program(generate_page_args['program_code'], generate_page_args['permission'], generate_page_args['owner'])

	return redirect('/'+generate_page_args['program_code'])

def get_loaded_program(request, program_code):
	owner = get_google_id_string(request)
	if (gateway.program_is_exist(program_code)):
		if (gateway.program_is_private(program_code)):
			if (gateway.get_owner(program_code)==owner):
				return render(request, 'splash.html', {"privacy_status": 'private', "program_code": program_code})
			else:
				return render(request, 'unauthorized.html', {"program_code":program_code})
		else:
			return render(request, 'splash.html', {"privacy_status": 'public', "program_code": program_code})

	generate_page_args = create_page_args(program_code, 'PR', owner)
	return generate_new_page(request, generate_page_args)