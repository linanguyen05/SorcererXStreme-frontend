# HuyenHocAI Frontend

Frontend application cho HuyenHocAI - ứng dụng huyền thuật AI, được xây dựng với Next.js 14 và TypeScript.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **UI Components:** Custom components with Lucide icons
- **HTTP Client:** Fetch API with custom API client layer

## Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── page.tsx                 # Homepage (redirect logic)
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── complete-profile/
│   ├── dashboard/               # Main dashboard
│   ├── chat/                    # AI chat interface
│   ├── tarot/                   # Tarot reading
│   ├── astrology/               # Astrology analysis
│   ├── fortune/                 # Fortune telling
│   ├── numerology/              # Numerology analysis
│   ├── profile/                 # User profile
│   └── vip/                     # VIP features
│
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   │   └── Sidebar.tsx
│   ├── ui/                      # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   ├── tarot/                   # Tarot-specific components
│   ├── astrology/               # Astrology components
│   ├── fortune/                 # Fortune components
│   └── vip/                     # VIP components
│
├── lib/                          # Utilities and helpers
│   ├── api-client.ts            # Backend API client
│   ├── store.ts                 # Zustand state management
│   ├── utils.ts                 # General utilities
│   ├── user-context.ts          # User context helpers
│   └── breakup-utils.ts         # Breakup feature utilities
│
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Features

- User authentication (register/login)
- User profile management
- AI-powered chat assistant
- Tarot card readings with 3D animations
- Astrology analysis
- Fortune telling
- Numerology calculations
- VIP membership features
- Breakup recovery tracking
- Responsive design
- Dark theme with cosmic aesthetics

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Running backend server (see backend/README.md)

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run development server:
```bash
npm run dev
```

Application will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## API Integration

Frontend communicates with backend through `lib/api-client.ts` which provides:

- `authApi` - Authentication endpoints
- `profileApi` - Profile management
- `chatApi` - Chat functionality
- `tarotApi` - Tarot readings
- `astrologyApi` - Astrology analysis
- `fortuneApi` - Fortune telling
- `numerologyApi` - Numerology analysis

All API calls include JWT token in Authorization header when user is authenticated.

## State Management

The application uses Zustand for state management with three main stores:

1. **useAuthStore** - Authentication state
   - User information
   - Login/logout
   - Profile completion

2. **useChatStore** - Chat state
   - Messages history
   - Loading state

3. **useProfileStore** - Profile state
   - Partner information
   - Breakup tracking

## Routing

- `/` - Homepage (auto-redirects based on auth state)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/complete-profile` - Profile completion
- `/dashboard` - Main dashboard
- `/chat` - AI chat
- `/tarot` - Tarot reading
- `/astrology` - Astrology analysis
- `/fortune` - Fortune telling
- `/numerology` - Numerology analysis
- `/profile` - User profile
- `/vip` - VIP features

## Styling

The application uses:
- Tailwind CSS for utility-first styling
- Custom CSS for cosmic theme and animations
- Framer Motion for smooth transitions and animations
- Custom gradient backgrounds
- Animated particles and star effects

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## AWS Deployment Ready

This frontend is ready to be deployed on:
- AWS Amplify
- AWS S3 + CloudFront
- AWS EC2 (with Node.js)
- AWS ECS (containerized)
- Vercel (recommended for Next.js)

Update `NEXT_PUBLIC_API_URL` to point to your deployed backend API.

## Development Notes

- All pages use 'use client' directive for client-side rendering
- Authentication is checked on page load
- Token is stored in both localStorage (Zustand persist) and cookies
- Backend API calls use Bearer token authentication
- Error handling with react-hot-toast for user notifications

## Link deploy by AWS Amplify
https://main.d30n5a8g6cs88k.amplifyapp.com/
