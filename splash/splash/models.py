from django.db import models

class Programs(models.Model):
	PERMISSIONS = (
		('PU', 'public'),
		('PR', 'private'),
	)
	program_code = models.CharField(max_length=5, primary_key=True)
	serialized_program = models.TextField()
	permission = models.CharField(max_length=2, choices=PERMISSIONS, default='PU')
	owner = models.CharField(max_length=255)

class CredentialsModel(models.Model):
	id = models.ForeignKey(User, primary_key=True)
	credential = CredentialsField()