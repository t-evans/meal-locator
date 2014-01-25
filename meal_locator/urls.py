from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView, RedirectView
from django.conf import settings

admin.autodiscover()


class TextPlainView(TemplateView):
    def render_to_response(self, context, **kwargs):
        return super(TextPlainView, self).render_to_response(
            context, content_type='text/plain', **kwargs)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'meal_locator.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/locations/?', include('locations.api.urls')),

    url(r'^robots\.txt$', TextPlainView.as_view(template_name='robots.txt')),
    url(r'^favicon\.ico$', RedirectView.as_view(url=settings.STATIC_URL + 'favicon.ico')),

    url('500.html', TemplateView.as_view(template_name='500.html')),
    url('404.html', TemplateView.as_view(template_name='404.html')),
    url('403.html', TemplateView.as_view(template_name='403.html'))
)
