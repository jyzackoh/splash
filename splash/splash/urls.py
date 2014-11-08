from django.conf.urls import patterns, include, url
import splash.views as views
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'splash.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^$', views.index),
    url(r'^login/', views.login),
    url(r'^new_program/', views.new_program),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^oauth2callback', views.auth_return),
    url(r'^([0-9a-zA-Z]{5})/perm/([A-Z]{2})/$', views.toggle_permissions),
    url(r'^([0-9a-zA-Z]{5})/save/$', views.save_program),
    url(r'^([0-9a-zA-Z]{5})/load/$', views.load_program),
    url(r'^([0-9a-zA-Z]{5})/share/$', views.share_page),
    url(r'^([0-9a-zA-Z]{5})/share/load/$', views.load_program),
    url(r'^([0-9a-zA-Z]{5})/$', views.load_page),
    url(r'^([0-9a-zA-Z]{0,9999})/$', views.not_found_page)
)
