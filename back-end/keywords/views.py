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
from keywords import extractor


class KeywordsViewSet(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        query = {
            'text': request.data["text"] if request.data["text"] else [],
            'ratio': request.data["ratio"] if request.data["ratio"] else 0.1
        }

        current_status = status.HTTP_200_OK

        try:
            keywords = extractor.extract(query)
        except:
            keywords = []

        return Response(keywords, status=current_status)
