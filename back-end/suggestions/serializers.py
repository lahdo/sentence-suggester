from rest_framework import serializers

class SentenceSerializer(serializers.Serializer):
    words = serializers.CharField()