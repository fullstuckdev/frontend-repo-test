
# Modern Next.js Dashboard Application

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-6.1.6-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.0-orange)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.1-blue)

A modern, secure, and scalable dashboard application built with Next.js 13+, TypeScript, Material-UI, and Firebase. Features clean architecture, beautiful UI design, and comprehensive user management.

## ✨ Features

- 🔐 Secure Authentication (Firebase)
- 👥 User Management Dashboard
- 🎨 Modern Glass-morphic UI Design
- 🏗️ Clean Architecture Pattern
- 🔄 Redux State Management
- 📱 Responsive Design
- 🌙 Dynamic Theming
- 🔍 Type-Safe Development

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Add your Firebase configuration to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Architecture

The project follows a clean architecture pattern with clear separation of concerns:

```
src/
├── app/           # Next.js 13+ App Router
├── components/    # Reusable UI components
├── core/         # Core utilities and services
├── data/         # Data layer implementations
├── domain/       # Business logic and interfaces
├── presentation/ # Presenters and ViewModels
├── ui/           # UI components and styles
└── types/        # TypeScript type definitions
```

## 🎨 UI Components

The application features a modern glass-morphic design with:

- Animated backgrounds
- Frosted glass effects
- Smooth transitions
- Responsive layouts
- Interactive elements

## 🔒 Authentication

Secure authentication is implemented using Firebase Auth with features like:

- Email/Password authentication
- Session management
- Protected routes
- User profile management

## 👥 User Management

Comprehensive user management dashboard includes:

- User listing with sorting and filtering
- User profile editing
- Role management
- Account status control
- Secure user deletion

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 13+
- **Language**: TypeScript
- **UI Library**: Material-UI
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: Tailwind CSS
- **Architecture**: Clean Architecture

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the component library
- Firebase for authentication and database services
- The Next.js team for the amazing framework

---

Made with ❤️ by Taufik Mulyawan
