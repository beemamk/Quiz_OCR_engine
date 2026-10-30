from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import QuestionBankViewSet, UserSubmissionViewSet

router = DefaultRouter()
router.register(r'question-banks', QuestionBankViewSet, basename='questionbank')
router.register(
    r'submissions', UserSubmissionViewSet, basename='usersubmission'
)

urlpatterns = [
    path('api/', include(router.urls)),
]