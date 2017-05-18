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

        suggestions = suggester.suggest(request.data["words"])
        # suggestions = suggester.suggest(["the", "other"])

        return Response(suggestions, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
