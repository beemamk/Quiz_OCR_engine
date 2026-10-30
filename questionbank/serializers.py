from rest_framework import serializers
from .models import Question, QuestionBank, UserAnswer, UserSubmission


class QuestionSerializer(serializers.ModelSerializer):

  class Meta:
    model = Question
    fields = ['id', 'question_text', 'correct_answer', 'order']


class QuestionBankSerializer(serializers.ModelSerializer):
  questions = QuestionSerializer(many=True, read_only=True)
  uploaded_file = serializers.FileField(write_only=True)

  class Meta:
    model = QuestionBank
    fields = ['id', 'title', 'uploaded_file', 'created_at', 'questions']
    read_only_fields = ['created_at']

  def create(self, validated_data):
    uploaded_file = validated_data.pop('uploaded_file')
    question_bank = QuestionBank.objects.create(
        uploaded_file=uploaded_file, **validated_data
    )

    # Trigger asynchronous Celery task for PDF parsing
    from .tasks import parse_pdf_questions

    parse_pdf_questions.delay(question_bank.id)

    return question_bank


class UserAnswerSerializer(serializers.ModelSerializer):
  user_answer_text = serializers.CharField(required=False, allow_blank=True)

  class Meta:
    model = UserAnswer
    fields = [
        'id',
        'question',
        'user_answer_text',
        'score',
        'feedback',
    ]
    read_only_fields = ['score', 'feedback']


class UserSubmissionSerializer(serializers.ModelSerializer):
  answers = UserAnswerSerializer(many=True)

  class Meta:
    model = UserSubmission
    fields = [
        'id',
        'question_bank',
        'user_identifier',
        'total_score',
        'submitted_at',
        'answers',
    ]
    read_only_fields = ['total_score', 'submitted_at']

  def create(self, validated_data):
    answers_data = validated_data.pop('answers', [])
    submission = UserSubmission.objects.create(**validated_data)

    total_score = 0.0

    for answer_data in answers_data:
      question = answer_data.get('question')
      user_text = answer_data.get('user_answer_text', '').strip().lower()
      correct_answer = question.correct_answer.strip().lower()

      # Automated text-based grading logic
      if not user_text:
        score = 0.0
        feedback = 'No answer provided.'
      elif user_text == correct_answer:
        score = 10.0
        feedback = 'Exact match! Full points.'
      elif correct_answer in user_text or user_text in correct_answer:
        score = 5.0
        feedback = 'Partial match detected.'
      else:
        score = 0.0
        feedback = f'Incorrect. Correct answer was: {question.correct_answer}'

      UserAnswer.objects.create(
          submission=submission,
          question=question,
          user_answer_text=answer_data.get('user_answer_text', ''),
          score=score,
          feedback=feedback,
      )
      total_score += score

    # Save total calculated score
    submission.total_score = total_score
    submission.save()

    return submission