"""sentence_suggester URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.models import User
from keywords.views import KeywordsViewSet
from rest_framework import routers, serializers, viewsets

from sentiment.views import SentimentViewSet
from suggestions.views import SuggestionsViewSet
from suggestions.views import JargonsViewSet
from suggestions.views import DefaultJargonViewSet
from entity_recognition.views import EntityRecognitionViewSet
from content_enrichment.views import ContentEnrichmentViewSet
from summary.views import SummaryViewSet
from random_text.views import RandomTextViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

urlpatterns = [
    url(r'^api/v1/random-text', RandomTextViewSet.as_view()),
    url(r'^api/v1/content-enrichment', ContentEnrichmentViewSet.as_view()),
    url(r'^api/v1/summary', SummaryViewSet.as_view()),
    url(r'^api/v1/entities', EntityRecognitionViewSet.as_view()),
    url(r'^api/v1/sentiment', SentimentViewSet.as_view()),
    url(r'^api/v1/keywords', KeywordsViewSet.as_view()),
    url(r'^api/v1/suggestions', SuggestionsViewSet.as_view()),
    url(r'^api/v1/jargons/default', DefaultJargonViewSet.as_view()),
    url(r'^api/v1/jargons', JargonsViewSet.as_view()),
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
