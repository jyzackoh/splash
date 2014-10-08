from django.conf.urls import patterns, include, url
from splash.views import new_page, load_page, not_found_page
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'splash.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    
    url(r'^$', new_page),
    url(r'^([0-9a-zA-Z]{5})/$', load_page),
    url(r'^([0-9a-zA-Z]{0,9999})/$', not_found_page),
    url(r'^admin/', include(admin.site.urls)),
)
