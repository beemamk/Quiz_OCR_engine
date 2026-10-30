from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from .models import QuestionBank, UserSubmission
from .serializers import QuestionBankSerializer, UserSubmissionSerializer


class QuestionBankViewSet(viewsets.ModelViewSet):
  queryset = QuestionBank.objects.all().order_by('-created_at')
  serializer_class = QuestionBankSerializer
  parser_classes = (MultiPartParser, FormParser)


class UserSubmissionViewSet(viewsets.ModelViewSet):
  queryset = UserSubmission.objects.all().order_by('-submitted_at')
  serializer_class = UserSubmissionSerializer
  parser_classes = (JSONParser, MultiPartParser, FormParser)