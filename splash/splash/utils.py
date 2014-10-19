import random, string
from django.shortcuts import render, redirect
import splash.gateway as gateway

def get_google_id_string(request):
	owner = ''
	if request.session.get('google_id', False):
		owner = str(request.session.get('google_id'))
	print owner
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

def generate_new_page(request, program_code):
	owner = get_google_id_string(request)
	gateway.add_new_program(program_code, 'PU', owner)

	return redirect('/'+program_code)

def get_loaded_program(request, program_code):
	owner = get_google_id_string(request)
	if (gateway.program_is_exist(program_code)):
		if (gateway.program_is_private(program_code)):
			if (owner == ''):
				return render(request, 'unauthorized.html', {"program_code":program_code})
			elif (gateway.get_owner(program_code)==owner):
				return render(request, 'splash.html', {"privacy_status": 'private', "program_code": program_code})
			else:
				return render(request, 'unauthorized.html', {"program_code":program_code})
		else:
			#load the current data
			return render(request, 'splash.html', {"privacy_status": 'public', "program_code": program_code})

	return generate_new_page(request, program_code)

def save_program(request, program_code):
	response = {}
	response['success'] = True

	serialized_program = "{'name': 'abnn'}"

	owner = get_google_id_string(request)
	if (gateway.program_is_exist(program_code)):
		program_owner = gateway.get_owner(program_code)
		if (gateway.program_is_private(program_code)): #gateway is private, check owners
			if (program_owner != owner):
				return get_failure_msg('User is unauthorized!')
	
	gateway.save_program(program_code, serialized_program)
	return str(response)


def toggle_permissions(request, program_code, permission):
	if (permission != 'PU' and permission != 'PR'):
		return get_failure_msg('Invalid Permission')

	owner = get_google_id_string(request)
	if (gateway.program_is_exist(program_code)):
		program_owner = gateway.get_owner(program_code)
		if (program_owner == ''):
				return get_failure_msg('User is unauthorized!')
		if (gateway.program_is_private(program_code)): #gateway is private, check owners
			if (program_owner != owner):
				return get_failure_msg('User is unauthorized!')
	
	gateway.save_permission(program_code, permission)
	return get_success_msg('')


def load_serialized_program(request, program_code):
	owner = get_google_id_string(request)

	if (gateway.program_is_exist(program_code)):
		program_owner = gateway.get_owner(program_code)
		if (gateway.program_is_private(program_code)): #gateway is private, check owners
			if (program_owner != owner):
				return get_failure_msg('User is unauthorized!')

	saved_program = gateway.load_program(program_code)
	return get_success_msg(saved_program.permission + " = " + saved_program.owner + " = " + saved_program.serialized_program)


def get_failure_msg(error):
	response = {}
	response['success'] = False
	response['error'] = error
	return str(response)

def get_success_msg(data):
	response = {}
	response['success'] = True
	response['data'] = data
	return str(response)