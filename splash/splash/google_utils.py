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