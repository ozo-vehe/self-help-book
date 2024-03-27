# SELF HELP BOOK
Welcome to the Self-Help Book – your personal guide to personal growth, empowerment, and positive change! In this unique approach to self-improvement, this project aims to provide you with valuable advice and practical tips to enhance various aspects of your life. Whether you're seeking guidance in relationships, career development, or financial planning, the Self-Help Book is here to offer insights and strategies to support your journey.

## OUTLINE
- [How it works](#how-it-works)
- [Making requests](#making-requests)
- [Setup instructions](#setup-instructions)
- [Additional notes](#additional-notes)


## How It Works
Think of this project as your virtual self-help companion. You can make requests for advice on specific challenges or areas where you're seeking improvement. For instance, if you're finding it challenging to stay motivated during difficult times, simply express your request, and the Self-Help Book will provide you with practical and motivational suggestions to help you navigate those tough moments.

## Making Requests

To get started, articulate your current concerns or goals, and the Self-Help Book will respond with tailored advice to assist you on your personal growth journey. Whether it's relationship advice, career tips, or financial planning insights, this project is designed to be a supportive resource for your ongoing development.

Let's embark on this journey of self-discovery and improvement together! Feel free to make your first request and let the Self-Help Book guide you towards a more empowered and fulfilled life.

## Setup Instructions
Welcome to Self Help App! Follow these steps to set up your environment variables using a `.env` file for your React Native Expo app.

### Step 1: Clone the Repository
```bash
https://github.com/hngx-org/self-help-book.git
cd your-project
```
### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create `.env` File
Create a `.env` file in the root of your project. This file will store your sensitive information such as API keys, secrets, etc.
```plaintext
EXPO_PUBLIC_API_KEY="your_api_key"
EXPO_PUBLIC_API_URL='https://api.openai.com/v1/engines/text-davinci-002/completions'
```
> Replace `your_api_key` with an API Key gotten from the [OpenAI](https://openai.com/) official website after sign up or login.

### Step 4: Add `.env` to `.gitignore`
Add your `.env` file to your `.gitignore` to ensure that sensitive information is not committed to version control.
```plaintext
# .gitignore
.env
```

### Step 5: Running Your App

```bash
npx expo start
```

Your React Native Expo app should now be running with the environment variables configured from your `.env` file.

## Additional Notes
- Make sure to keep your `.env` file secure and do not share it publicly.
- If you make changes to your `.env` file, you might need to restart your development server for the changes to take effect.
- Consult the [React Native Environment Variables documentation](https://reactnative.dev/docs/environment-variables) or [Environment variables in Expo](https://docs.expo.dev/guides/environment-variables/) for more details.

Happy coding!
```
