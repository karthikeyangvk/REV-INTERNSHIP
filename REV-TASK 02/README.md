# AI Resume Validator

A full-stack web application that helps job seekers validate and optimize their resumes using AI. The app provides detailed analysis of resumes against job descriptions, offering insights on skills matching, experience alignment, formatting, and ATS compatibility.

## Features

- 🔐 Secure user authentication with Firebase
- 📄 Resume and job description upload (PDF/Text)
- 🤖 AI-powered resume analysis using Google Gemini 2.5 Flash
- 📊 Interactive dashboard with validation results
- 🎨 Responsive design with dark mode support
- 📱 Mobile-first approach

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **File Storage**: Firebase Storage
- **AI**: Google Gemini API
- **Data Visualization**: Chart.js
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication, Firestore, and Storage enabled
- Google Cloud Project with Gemini API enabled

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-validator.git
   cd resume-validator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Google Gemini API
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/src
  /app                  # App Router pages and layouts
  /components           # Reusable UI components
  /context              # React context providers
  /hooks                # Custom React hooks
  /lib                  # Utility functions and configurations
    /firebase           # Firebase configuration and services
    /gemini             # Google Gemini API integration
  /styles               # Global styles and Tailwind configuration
  /types                # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics Measurement ID | No |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API Key | Yes |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Google Gemini](https://ai.google/)
- [Tailwind CSS](https://tailwindcss.com/)
