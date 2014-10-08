from django.conf.urls import patterns, include, url
from splash.views import index, new_program, load_program, not_found_page
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'splash.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^$', index),
    url(r'^new_program$', new_program),
    url(r'^([0-9a-zA-Z]{5})/$', load_program),
    url(r'^([0-9a-zA-Z]{0,9999})/$', not_found_page),
    url(r'^admin/', include(admin.site.urls)),
)
