from splash.models import Programs

def add_new_program(program_code, permission, owner):
	Programs.objects.create(program_code=program_code, serialized_program="", permission=permission, owner=owner)
	pass

def update_program(program_code, serialized_program):
	pass

def program_is_exist(program_code):
	program_obj = None
	try:
		program_obj = Programs.objects.get(program_code=program_code)
	except Programs.DoesNotExist:
		program_obj = None

	if (program_obj == None):
		return False
	else:
		return True

def program_is_private(program_code):
	if (program_is_exist(program_code)):
		program_obj = Programs.objects.get(program_code=program_code)
		if (program_obj.permission == 'PR'):
			return True
	else:
		return False
