import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from celery import shared_task
from .models import Question, QuestionBank, UserSubmission, UserAnswer


@shared_task
def parse_pdf_questions(question_bank_id):
  """Background task to extract text from an uploaded PDF and populate Question objects.

  Assumes PDF format lines starting with 'Q:' for questions and 'A:' for answers.
  """
  try:
    qb = QuestionBank.objects.get(pk=question_bank_id)
    doc = fitz.open(qb.uploaded_file.path)

    full_text = ""
    for page in doc:
      full_text += page.get_text() + "\n"

    lines = full_text.split("\n")
    current_q = None
    current_a = None
    order_counter = 1

    for line in lines:
      cleaned_line = line.strip()
      if cleaned_line.startswith("Q:"):
        # Save previous question pair if exists
        if current_q and current_a:
          Question.objects.create(
              question_bank=qb,
              question_text=current_q.strip(),
              correct_answer=current_a.strip(),
              order=order_counter,
          )
          order_counter += 1
          current_a = None
        current_q = cleaned_line.replace("Q:", "", 1)
      elif cleaned_line.startswith("A:"):
        current_a = cleaned_line.replace("A:", "", 1)
      elif current_q and not current_a:
        # Handle multi-line question text
        current_q += " " + cleaned_line
      elif current_q and current_a:
        # Handle multi-line answer text
        current_a += " " + cleaned_line

    # Save the final question pair
    if current_q and current_a:
      Question.objects.create(
          question_bank=qb,
          question_text=current_q.strip(),
          correct_answer=current_a.strip(),
          order=order_counter,
      )

  except Exception as e:
    print(f"Error parsing PDF for QuestionBank {question_bank_id}: {str(e)}")


@shared_task
def evaluate_submission(submission_id):
  """Background task to process student typed answers and score them

  against the correct answers.
  """
  try:
    submission = UserSubmission.objects.get(pk=submission_id)
    total_score = 0.0
    answers = submission.answers.all()

    for ans in answers:
      # Get the typed student answer text (default to empty string if missing)
      student_text = getattr(ans, 'user_answer_text', '').strip().lower()
      correct_answer = ans.question.correct_answer.strip().lower()

      if not student_text:
        ans.score = 0.0
        ans.feedback = 'No answer provided.'
      elif student_text == correct_answer:
        ans.score = 10.0  # Full points for exact match
        ans.feedback = 'Exact match! Full points.'
      elif correct_answer in student_text or student_text in correct_answer:
        ans.score = 5.0  # Partial points for close match
        ans.feedback = 'Partial match detected.'
      else:
        ans.score = 0.0
        ans.feedback = (
            f'Incorrect. Correct answer was: {ans.question.correct_answer}'
        )

      ans.save()
      total_score += ans.score

    # Update total submission score
    submission.total_score = total_score
    submission.save()

  except Exception as e:
    print(f'Error evaluating submission {submission_id}: {str(e)}')