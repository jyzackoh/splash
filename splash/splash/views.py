from django.shortcuts import render

def new_page(request):
	return generate_new_page(request)


def load_page(request, loading_code):
	#Check if code exists
	if (True):
		#check if 
		return render(request, 'main.html', {"url_sub_folder": loading_code})
	else:
		#If code does not exist, create new one with that code
		return generate_new_page(request)

def not_found_page(request, loading_code):
	return render(request, 'not_found.html', {"loading_code": loading_code})

def generate_new_page(request):
	#Generate a new page_code
	new_code = generate_page_code()
	#Tie this new page_code to user and empty string
	return render(request, 'main.html', {"url_sub_folder": ("Your New Page ID is " + new_code)})


def generate_page_code():
	new_code = "B7d3e"
	return new_code