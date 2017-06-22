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
from entity_recognition import analyzer


class EntityRecognitionViewSet(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        query = {
            'text': request.data["text"] if request.data["text"] else []
        }

        current_status = status.HTTP_200_OK

        result = analyzer.analyze(query)

        # try:
        #     sentiments = analyzer.analyze(query)
        # except:
        #     sentiments = []

        return Response(result, status=current_status)
