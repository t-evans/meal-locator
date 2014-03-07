from django.views.generic.base import TemplateView


class MealLocatorView(TemplateView):
    template_name = "meal_locator.html"
