web: python fizzbreaker/manage.py collectstatic --noinput; bin/gunicorn_django --workers=3 --bind=0.0.0.0:$PORT fizzbreaker/settings.py