from django.contrib import admin
from .models import QuestionBank, Question, UserSubmission, UserAnswer

admin.site.register(QuestionBank)
admin.site.register(Question)
admin.site.register(UserSubmission)
admin.site.register(UserAnswer)
