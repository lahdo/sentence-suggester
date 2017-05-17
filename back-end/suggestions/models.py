# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Sentence(object):
    def __init__(self, words):
        self.words = words