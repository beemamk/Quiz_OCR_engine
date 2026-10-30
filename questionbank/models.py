from django.db import models


class QuestionBank(models.Model):
  title = models.CharField(max_length=255)
  uploaded_file = models.FileField(upload_to="pdfs/")
  created_at = models.DateTimeField(auto_now_add=True)


class Question(models.Model):
  question_bank = models.ForeignKey(
      QuestionBank, related_name="questions", on_delete=models.CASCADE
  )
  question_text = models.TextField()
  correct_answer = models.TextField()
  order = models.PositiveIntegerField(default=0)


class UserSubmission(models.Model):
  question_bank = models.ForeignKey(
      QuestionBank, on_delete=models.CASCADE, related_name="submissions"
  )
  user_identifier = models.CharField(
      max_length=255
  ) 
  total_score = models.FloatField(default=0.0)
  submitted_at = models.DateTimeField(auto_now_add=True)


class UserAnswer(models.Model):
  submission = models.ForeignKey(
      UserSubmission, related_name="answers", on_delete=models.CASCADE
  )
  question = models.ForeignKey(Question, on_delete=models.CASCADE)
  user_answer_text = models.TextField(
      blank=True, null=True
  )
  extracted_ocr_text = models.TextField(blank=True, null=True)
  score = models.FloatField(default=0.0)
  feedback = models.TextField(blank=True, null=True)