from splash.models import Programs

def add_new_program(program_code, permission, owner):
	#print(owner)
	Programs.objects.create(program_code=program_code, serialized_program="", permission=permission, owner=owner)

def save_program(program_code, serialized_program):
	program = Programs.objects.get(program_code=program_code)
	program.serialized_program = serialized_program
	program.save()

def save_permission(program_code, permission):
	program = Programs.objects.get(program_code=program_code)
	program.permission = permission
	program.save()

def load_program(program_code):
	return Programs.objects.get(program_code=program_code)

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

def get_owner(program_code):
	try:
		program_obj = Programs.objects.get(program_code=program_code)
	except Programs.DoesNotExist:
		program_obj = None

	print(str(program_obj.owner))

	if (program_obj):
		return program_obj.owner
	else:
		return None