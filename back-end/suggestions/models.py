# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


def test_make_sentence_with_start_three_words(self):
    start_str = "Sherlock Holmes was"
    text_model = sherlock_model
    try:
        text_model.make_sentence_with_start(start_str)
        assert(False)
    except markovify.text.ParamError:
        assert(True)
    text_model = markovify.Text(sherlock, state_size=3)
    text_model.make_sentence_with_start(start_str)