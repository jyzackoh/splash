from django.shortcuts import render, redirect
import splash.gateway as gateway
import random, string

def index(request):
	return render(request, 'index.html', {})

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