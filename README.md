Jobdex
==========

A web app for managing job applications and making the job hunting process easier. Project done as part of UC Berkeley's CS 169 class (Software Engineering).

Guide
----------
### When you start
Run 
```
env/bin/activate
gulp watch
python manage.py runserver
```
This ensures your development environment has the Python dependencies, converts SCSS/JS changes to minified files automatically, and runs a local server at port 8000.

### Sync with remote repository
To check if your local files are up-to-date with those in the remote repo on Github, run `git remote show origin`. If any of them are *not* up to date, run
```
git fetch origin
checkout <my_outdated_branch>
git rebase origin/<my_outdated_branch
```

### Making changes
If you've added a python dependency via pip, run `pip freeze > requirements.txt`. For commit messages, keep it in this format: short line briefly explaining changes, followed by an empty line, followed by list of changes in detail.
E.g.
```
Changed urls for Users app

- Added 3 urls for getting, posting, and updating users.
- Removed unnecessary url for putting.
```

