from django.conf.urls import patterns, include, url
import splash.views as views
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'splash.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^$', views.index),
    url(r'^new_program/([A-Z]{2})/$', views.new_program),
    url(r'^toggle_permissions/([0-9a-zA-Z]{5})/([A-Z]{2})/$', views.toggle_permissions),
    url(r'^save/([0-9a-zA-Z]{5})/$', views.save_program),
    url(r'^([0-9a-zA-Z]{5})/$', views.load_program),
    url(r'^([0-9a-zA-Z]{0,9999})/$', views.not_found_page),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^oauth2callback', views.auth_return)
)
