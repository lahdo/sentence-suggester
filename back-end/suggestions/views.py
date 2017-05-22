# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json

from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
# from suggestions.serializers import SentenceSerializer

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from suggester import suggester


class SuggestionsViewSet(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        #data = json.loads(request.data)#request.POST["_content"])

        query = {
            'words': request.data["words"] if request.data["words"] else [],
            'jargon': request.data["jargon"] if request.data["jargon"] else 'default'
        }

        suggestions = suggester.suggest(query)
        # suggestions = suggester.suggest(["the", "other"])

        return Response(suggestions, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JargonsViewSet(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        models = []

        for model in suggester.MODELS:
            models.append(suggester.MODELS[model]['name'])

        response = {
            'models': models
        }

        return Response(response, status=status.HTTP_200_OK)

class DefaultJargonViewSet(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        default_model = suggester.DEFAULT_MODEL['name']

        return Response(default_model, status=status.HTTP_200_OK)