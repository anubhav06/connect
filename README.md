# CONNECT
A job application portal where recruiters/applicants can connect using our video services. Also, get to see the analytics/insights of your conversation during the meeting.<br><br>
<img src="/.github/github1.png" height="350px">

## Installation

#### Installing `backend`
1. `cd backend`
2. Download [Python](https://www.python.org/downloads/) if you haven't
3. `pip install -r requirements.txt` to install the required libraries
4. `python manage.py migrate` to apply the migrations
5. `python manage.py runserver` to start the server

#### Installing `frontend`
1. `cd frontend`
2. Install [NodeJs](https://nodejs.org/en/download/) if you haven't
3. `npm install` to install the dependencies
4. `npm start` to start the server

#### Installing `twilio-meeting-server`
1. `cd twilio-meeting-server`
2. Install [NodeJs](https://nodejs.org/en/download/) if you haven't
3. `npm install` to install the dependencies
4. `npm start` to start the server

## Contributing
This is open to contribution, follow the installation section to get started with installation. <br>
Feel free to create an issue !

## Inspiration
Giving/Taking interviews is a hectic process. Every company uses different software for meeting. After that comes the closing screen, which makes us anxious as to how the interview went.
Here comes [Connect](https://connect-online.vercel.app/), the *unified job portal*, where you can conduct meetings from our services. Afterwards, you can also get *insights and analytics* about how your interview went, from our services.
<br>
<img src="/.github/github3.png" height="350px">

## What it does
It's a unified job portal. Recruiters/applicants can use the meeting service we provide as the one stop meeting software provider. The meeting service is no less than other software like MS Teams, Google Meet, Zoom, etc. It provides mute/unmute audio, open/close camera, screenshare, customized background and many more things.
After giving the interview, you can get analytics and insights of your conversation. Just upload the audio/video file, and our services will provide you with the insights.<br>
<img src="/.github/github2.png" height="350px">

## How we built it
The backend was built using Django. The meeting service was built using the Twilio API. The conversation analytics service was built using Symbl.ai

## Challenges we ran into
We ran into a lot of challenges:
1. Integrating React with Django in such a way that Django serves as the backend and react as the frontend.
2. Using AWS S3 buckets to store the media files and getting back a publicly accessible URL.
3. Working with Twilio video API ,generating tokens,  integrating it with our Django backend.
4. Working with Symbl.ai, generating tokens, fetching and using the data.

## Accomplishments that we're proud of
1. We were able to learn a lot of things.
2. Was able to make something (if not complete, but atleast a part)

## What we learned
1. Integrating React+Django
2. Working with AWS S3 buckets for file storages, boto3, accessing objects.
3. Working with Twilio video API, integrating it with our Django backend server.
4. Working with Symbl.ai, generating tokens, accessing and using its API

## What's next for Connect 
1.  Adding more advanced insights for conversations using Symbl.ai
2. Adding more features to video like chat
3. Improving the UI/UX, Design
4. Adding a section where recruiters can list open positions and applicants can apply for them


## Team 💪🏻

1. Anubhav Gupta [@anubhav06](https://github.com/anubhav06) <br>
2. Chetan Sengar [@0rgaan1c](https://github.com/0rgaan1c)


