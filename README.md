# TalentCrew AI - Intelligent Interview Platform

TalentCrew AI is an enterprise-grade AI-powered interview platform that conducts automated voice interviews with candidates and provides comprehensive scorecards for recruiters. The platform uses real-time WebSocket communication, voice-to-text conversion, and AI-driven conversation management to create a seamless interview experience.

---

## Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Data Flow](#-data-flow)
- [Core Features](#-core-features)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [WebSocket Communication](#-websocket-communication)
- [Authentication Flow](#-authentication-flow)
- [Interview Flow](#-interview-flow)
- [Tab-Switch Detection](#-tab-switch-detection)
- [API Integration](#-api-integration)
- [Setup & Installation](#-setup--installation)
- [Development Guide](#-development-guide)
- [Production Deployment](#-production-deployment)
- [Future Enhancements](#-future-enhancements)

---

## Overview

TalentCrew AI is a modern React application built with Vite that enables:
- **Automated AI-powered interviews** with real-time voice interaction
- **Intelligent candidate assessment** with multi-dimensional scoring
- **Recruiter dashboard** for managing and evaluating candidates
- **Real-time communication** via WebSocket (Centrifugo)
- **Security features** including tab-switch detection and interview termination
- **Comprehensive analytics** with visual scorecards and evidence tracking

### Key Use Cases
1. **For Candidates**: Participate in AI-conducted interviews via voice, receive immediate feedback
2. **For Recruiters**: Create job postings, review candidate scorecards, make hiring decisions
3. **For Organizations**: Scale interview process, standardize evaluations, reduce time-to-hire

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Landing    │  │  Interview   │  │  Recruiter   │          │
│  │     Page     │  │     Page     │  │  Dashboard   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                 ┌──────────┴──────────┐                         │
│                 │                     │                          │
│          ┌──────▼──────┐      ┌──────▼──────┐                  │
│          │   HTTP API   │      │  WebSocket  │                  │
│          │   Requests   │      │  (Centrifugo)│                 │
│          └──────┬──────┘      └──────┬──────┘                  │
└─────────────────┼──────────────────────┼──────────────────────┘
                  │                      │
                  │                      │
┌─────────────────▼──────────────────────▼──────────────────────┐
│                    Backend (Django RF)                          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   REST API   │  │  WebSocket   │  │   AI Engine  │         │
│  │   Endpoints  │  │   Channels   │  │  (OpenAI)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │            PostgreSQL Database                    │          │
│  └──────────────────────────────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **Candidate Journey**
   ```
   Landing Page → Interview Config → Warning Modal → Interview Page
       ↓              ↓                    ↓                ↓
   Browse Jobs   Enter Details    Accept Rules    Voice Interview
                                                          ↓
                                                   Results Page
   ```

2. **Recruiter Journey**
   ```
   Auth Page → Dashboard → Candidate List → Scorecard View
       ↓           ↓             ↓                ↓
   Login     View Stats    Filter/Sort    Detailed Evaluation
       ↓                                         ↓
   Create Jobs                          Make Hiring Decision
   ```

---

## Technology Stack

### Core Technologies
- **React 19.2.0** - UI library with latest features
- **Vite 7.3.1** - Fast build tool and dev server
- **React Router DOM 7.13.0** - Client-side routing
- **Tailwind CSS 4.1.18** - Utility-first CSS framework

### Communication & Real-time
- **Centrifuge 5.5.3** - Real-time WebSocket client
- **Native WebSocket API** - Audio streaming
- **Web Audio API** - Audio playback and processing

### Development Tools
- **ESLint 9.39.1** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.24** - CSS vendor prefixing

### UI & Icons
- **Lucide React 0.564.0** - Modern icon library
- **Custom SVG components** - Charts and visualizations

### Browser APIs Used
- **MediaDevices API** - Microphone access
- **Page Visibility API** - Tab-switch detection
- **Local Storage API** - Authentication persistence
- **Audio Context API** - Audio processing

---

## Project Structure

### Complete File Tree

```
TalentCrew-ai/
├── public/
│   └── audio-processor.js          # Audio worklet processor
│
├── src/
│   ├── assets/                     # Static assets (images, fonts)
│   │
│   ├── components/                 # React components
│   │   ├── ui/                     # Reusable UI primitives
│   │   │   ├── Badge.jsx           # Status badges (success, warning, danger)
│   │   │   ├── Button.jsx          # Multi-variant button component
│   │   │   ├── Card.jsx            # Container card component
│   │   │   └── Input.jsx           # Text input with multiline support
│   │   │
│   │   ├── interview/              # Interview-specific components
│   │   │   ├── ChatBubble.jsx      # Message bubble (AI/User)
│   │   │   ├── ChatContainer.jsx   # Scrollable message list
│   │   │   ├── InputController.jsx # Voice input controller
│   │   │   ├── InterviewHeader.jsx # Header with timer and progress
│   │   │   ├── ProgressStepper.jsx # Interview stage indicator
│   │   │   ├── RoleCalibrationForm.jsx # Pre-interview form
│   │   │   ├── ThankYouScreen.jsx  # Post-interview screen
│   │   │   └── Timer.jsx           # Elapsed time display
│   │   │
│   │   ├── dashboard/              # Recruiter dashboard components
│   │   │   ├── CandidateRow.jsx    # Table row for candidate
│   │   │   ├── CandidateTable.jsx  # Candidate list table
│   │   │   ├── EvidenceCard.jsx    # Interview evidence snippet
│   │   │   ├── ScoreChart.jsx      # Skills radar chart
│   │   │   ├── ScorecardView.jsx   # Full scorecard view
│   │   │   └── Sidebar.jsx         # Dashboard navigation
│   │   │
│   │   ├── ConfigurationView.jsx   # Job configuration component
│   │   ├── ProtectedRoute.jsx      # Auth-protected route wrapper
│   │   └── ScorecardView.jsx       # Legacy scorecard component
│   │
│   ├── context/                    # React context providers
│   │   └── AuthContext.jsx         # Authentication context & hooks
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useInterviewLogic.js    # Interview state machine
│   │   └── useSpeechToText.js      # Voice-to-text integration
│   │
│   ├── lib/                        # Utility libraries
│   │   ├── api.js                  # HTTP API client
│   │   ├── centrifuge.js           # Centrifugo WebSocket client
│   │   ├── interviewWs.js          # Interview WebSocket handler
│   │   └── playTts.js              # Text-to-speech audio player
│   │
│   ├── pages/                      # Top-level page components
│   │   ├── CandidateScorecard.jsx  # Detailed candidate view
│   │   ├── InterviewConfiguration.jsx # Job creation page
│   │   ├── InterviewPage.jsx       # Main interview interface
│   │   ├── LandingPage.jsx         # Public homepage
│   │   ├── RecruiterAuth.jsx       # Login/signup page
│   │   ├── RecruiterDashboard.jsx  # Recruiter main dashboard
│   │   └── ResultsPage.jsx         # Post-interview results
│   │
│   ├── utils/                      # Utility functions
│   │   └── audioAnalysis.js        # Audio processing utilities
│   │
│   ├── App.css                     # Global styles
│   ├── App.jsx                     # Root app component with routing
│   ├── index.css                   # Tailwind directives
│   └── main.jsx                    # React entry point
│
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── PROJECT_STRUCTURE.md            # Project documentation
├── README.md                       # This file
├── tailwind.config.js              # Tailwind CSS configuration
└── vite.config.js                  # Vite build configuration
```

### Directory Responsibilities

#### `/components/ui/`
**Purpose**: Reusable, atomic UI components following atomic design principles
- **Badge**: Status indicators with variants (success, warning, danger, info)
- **Button**: Primary interaction component with multiple variants
- **Card**: Container component for grouping related content
- **Input**: Form input with support for text/textarea modes

#### `/components/interview/`
**Purpose**: Interview-specific, composed components
- **ChatBubble**: Individual message display with role-based styling
- **ChatContainer**: List view for conversation history
- **InputController**: Manages voice input and WebSocket connection
- **InterviewHeader**: Top navigation with logo, timer, and stepper
- **ProgressStepper**: Visual indicator of interview stages
- **RoleCalibrationForm**: Pre-interview candidate information form
- **ThankYouScreen**: Post-interview completion screen
- **Timer**: Real-time elapsed time display

#### `/components/dashboard/`
**Purpose**: Recruiter-facing components for candidate management
- **CandidateRow**: Individual candidate in table view
- **CandidateTable**: Sortable, filterable candidate list
- **EvidenceCard**: Interview response excerpts with sentiment
- **ScoreChart**: SVG-based radar chart for skill visualization
- **ScorecardView**: Comprehensive candidate evaluation view
- **Sidebar**: Navigation and stats for recruiter dashboard

#### `/hooks/`
**Purpose**: Custom React hooks for business logic separation
- **useInterviewLogic**: Manages interview state machine, stages, and messages
- **useSpeechToText**: Handles voice recognition and WebSocket audio streaming

#### `/lib/`
**Purpose**: External service integration and API clients
- **api.js**: RESTful API client with error handling
- **centrifuge.js**: Centrifugo real-time messaging client
- **interviewWs.js**: Interview-specific WebSocket handler
- **playTts.js**: Audio playback and queueing system

#### `/pages/`
**Purpose**: Top-level route components
- **CandidateScorecard**: Detailed candidate evaluation page
- **InterviewConfiguration**: Job posting creation interface
- **InterviewPage**: Main interview interface with voice interaction
- **LandingPage**: Public homepage with job listings
- **RecruiterAuth**: Authentication page for recruiters
- **RecruiterDashboard**: Main recruiter interface
- **ResultsPage**: Interview results and scorecard display

---

## Data Flow

### 1. Interview Session Flow

```
┌─────────────┐
│  Candidate  │
│   Submits   │
│    Form     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  POST /api/sessions/    │  ← Create session in backend
└──────────┬──────────────┘
           │
           ▼ Returns session_id + token
┌─────────────────────────┐
│   Show Warning Modal    │  ← Tab-switch warning
└──────────┬──────────────┘
           │
           ▼ User acknowledges
┌─────────────────────────┐
│  Enable Tab Detection   │  ← Start monitoring
│  Connect WebSocket      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Voice Interview       │  
│   AI ←→ Candidate       │  ← Real-time exchange
└──────────┬──────────────┘
           │
           ▼ Interview ends
┌─────────────────────────┐
│  POST /sessions/:id/end │  ← Generate scorecard
└──────────┬──────────────┘
           │
           ▼ Returns scorecard
┌─────────────────────────┐
│    Results Page         │  ← Display results
└─────────────────────────┘
```

### 2. WebSocket Message Flow

```
Candidate Browser                          Backend Server
─────────────────                          ──────────────
      │                                           │
      │  1. Connect WebSocket                     │
      ├──────────────────────────────────────────>│
      │     ws://backend/interview/:sessionId     │
      │                                           │
      │  2. Send audio chunks                     │
      ├──────────────────────────────────────────>│
      │     { type: "audio", data: <base64> }     │
      │                                           │
      │                          3. Process audio │
      │                          4. Call OpenAI   │
      │                          5. Generate TTS  │
      │                                           │
      │  6. Receive AI response                   │
      │<──────────────────────────────────────────┤
      │     { type: "text_message", message }     │
      │                                           │
      │  7. Receive TTS audio                     │
      │<──────────────────────────────────────────┤
      │     { type: "tts_audio", audio: <base64>} │
      │                                           │
      │  8. User finished speaking                │
      ├──────────────────────────────────────────>│
      │     { type: "user_finished_speaking" }    │
      │                                           │
```

### 3. Authentication Flow

```
┌──────────────┐
│  User visits │
│  /recruiter  │
└──────┬───────┘
       │
       ▼
  ┌─────────────┐
  │ Protected?  │
  └──────┬──────┘
         │
    ┌────┴────┐
    │ Yes     │ No
    ▼         ▼
┌─────────┐  ┌──────────┐
│ Redirect│  │  Allow   │
│ to Auth │  │  Access  │
└─────────┘  └──────────┘
    │
    ▼
┌─────────────┐
│ Login Form  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ POST /api/auth  │
└──────┬──────────┘
       │
       ▼
┌──────────────────┐
│ Save to Context  │
│ & LocalStorage   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Redirect to      │
│ Dashboard        │
└──────────────────┘
```

---

## Core Features

### 1. AI-Powered Voice Interviews
- **Real-time voice interaction** using Web Audio API
- **Automatic speech-to-text** conversion
- **AI-generated responses** via OpenAI integration
- **Text-to-speech** for AI responses
- **Multi-stage interview process** (Intro → Technical → Communication → Wrap-up)

### 2. Tab-Switch Detection & Security
- **Warning modal** before interview starts
- **Multiple detection methods**:
  - Page Visibility API (tab switching)
  - Window blur events (window switching)
  - Keyboard shortcut detection (Alt+Tab, Cmd+Tab, etc.)
- **Immediate termination** on violation
- **Alert notification** to candidate
- **Session logging** for audit trail

### 3. Comprehensive Candidate Scoring
- **Multi-dimensional scoring**:
  - Technical skills (0-10)
  - Communication skills (0-10)
  - Overall score (0-10)
- **Evidence-based evaluation**:
  - Strengths with supporting quotes
  - Risks with specific examples
  - Context-aware assessment
- **AI-generated recommendations**:
  - Hiring verdict (Hire/No Hire/Human Review)
  - Follow-up questions
  - Detailed feedback

### 4. Recruiter Dashboard
- **Candidate management**:
  - Searchable candidate list
  - Status filtering (Completed, Under Review, etc.)
  - Sortable columns
- **Visual analytics**:
  - Skills radar chart
  - Score distribution
  - Interview statistics
- **Bulk actions**:
  - Download scorecards
  - Export to CSV
  - Batch status updates

### 5. Job Configuration
- **Create job postings** with required skills
- **Configure interview questions** per role
- **Set evaluation criteria**
- **Generate interview links** for candidates

---

## Component Architecture

### Design Principles
1. **Atomic Design**: Components broken into atoms → molecules → organisms
2. **Single Responsibility**: Each component has one clear purpose
3. **Composition over Inheritance**: Build complex UIs from simple parts
4. **Props Drilling Avoidance**: Use Context for shared state
5. **Controlled Components**: Parent components manage state

</ Example: Button Component Architecture

```jsx
// Atom: Basic button with variants
<Button variant="primary" size="lg" onClick={handler}>
  Click Me
</Button>

// Molecule: Button with icon
<Button variant="danger" icon={<TrashIcon />}>
  Delete
</Button>

// Organism: Action group
<div className="flex gap-2">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Submit</Button>
</div>
```

### State Management Patterns

#### 1. Local State (useState)
```jsx
// Component-specific state
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
```

#### 2. Context State (useContext)
```jsx
// Shared across component tree
const { user, login, logout } = useAuth();
```

#### 3. Ref State (useRef)
```jsx
// Mutable values that don't trigger re-renders
const socketRef = useRef(null);
const tabSwitchDetectedRef = useRef(false);
```

#### 4. Custom Hooks
```jsx
// Encapsulated business logic
const { 
  currentStage, 
  messages, 
  startInterviewWithData 
} = useInterviewLogic();
```

---

## State Management

### Interview State Machine

```
┌─────────┐
│  IDLE   │ ← Initial state
└────┬────┘
     │ Form submitted
     ▼
┌──────────────┐
│ AI_THINKING  │ ← Processing initial question
└────┬─────────┘
     │ TTS audio received
     ▼
┌──────────────┐
│ AI_SPEAKING  │ ← Playing AI response
└────┬─────────┘
     │ Audio ended
     ▼
┌────────────────┐
│ USER_SPEAKING  │ ← Candidate's turn
└────┬───────────┘
     │ "Done Speaking" clicked
     ▼
┌──────────────┐
│ AI_THINKING  │ ← Loop continues...
└──────────────┘
```

### State Variables in InterviewPage

```jsx
// Session management
const [sessionId, setSessionId] = useState(null);
const [token, setToken] = useState(null);
const [candidateData, setCandidateData] = useState(null);

// UI state
const [showForm, setShowForm] = useState(true);
const [showWarningModal, setShowWarningModal] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Interview state
const [interviewState, setInterviewState] = useState('idle');
const [interviewStarted, setInterviewStarted] = useState(false);
const [isCompleted, setIsCompleted] = useState(false);
const [isEvaluating, setIsEvaluating] = useState(false);

// WebSocket reference
const socketRef = useRef(null);
const tabSwitchDetectedRef = useRef(false);
```

---

## WebSocket Communication

### Connection Setup

```javascript
// 1. Create session and get token
const { session_id, token } = await createTestSession();

// 2. Connect to Centrifugo
const centrifuge = new Centrifuge(WS_URL, { token });

// 3. Subscribe to interview channel
const sub = centrifuge.newSubscription(`interviews:interview:${sessionId}`);

// 4. Handle incoming messages
sub.on('publication', (ctx) => {
  const { type, data } = ctx.data;
  
  if (type === 'text_message') {
    displayMessage(data.message);
  } else if (type === 'tts_audio_complete') {
    playAudio(data.audio_base64);
  }
});

// 5. Connect
centrifuge.connect();
```

### Audio Streaming

```javascript
// Capture microphone
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// Setup audio context
const audioContext = new AudioContext({ sampleRate: 16000 });
const source = audioContext.createMediaStreamSource(stream);

// Create worklet for processing
await audioContext.audioWorklet.addModule('/audio-processor.js');
const worklet = new AudioWorkletNode(audioContext, 'audio-processor');

// Send audio chunks via WebSocket
worklet.port.onmessage = (event) => {
  const { audio } = event.data;
  const base64 = arrayBufferToBase64(audio);
  
  websocket.send(JSON.stringify({
    type: 'audio_chunk',
    audio: base64
  }));
};
```

---

## Authentication Flow

### AuthContext Structure

```jsx
const AuthContext = createContext({
  user: null,              // Current user object
  loading: false,          // Auth check in progress
  login: () => {},         // Login function
  logout: () => {},        // Logout function
  signup: () => {}         // Signup function
});
```

### Protected Route Implementation

```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/recruiter/auth" replace />;
  }
  
  return children;
}
```

### Usage Example

```jsx
<Route
  path="/recruiter"
  element={
    <ProtectedRoute>
      <RecruiterDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🎤 Interview Flow

### Interview Stages

1. **Intro** (0-2 minutes)
   - Welcome candidate
   - Explain process
   - Confirm role understanding

2. **Role Calibration** (2-5 minutes)
   - Discuss job responsibilities
   - Assess role comprehension
   - Gauge interest level

3. **Technical Assessment** (5-12 minutes)
   - Problem-solving questions
   - Technical skill evaluation
   - Scenario-based queries

4. **Communication eval** (12-18 minutes)
   - Soft skills assessment
   - Team collaboration scenarios
   - Conflict resolution

5. **Wrap-up** (18-20 minutes)
   - Candidate questions
   - Next steps explanation
   - Closing remarks

### Message Exchange Pattern

```javascript
// User speaks → AI processes → AI responds

// 1. User finishes speaking
handleDoneSpeaking() {
  setInterviewState('ai-thinking');
  websocket.send({ type: 'user_finished_speaking' });
}

// 2. Backend processes audio → calls OpenAI → generates response

// 3. Frontend receives text message
onTextMessage(message) {
  setMessages(prev => [...prev, { role: 'ai', content: message }]);
}

// 4. Frontend receives TTS audio
onTtsAudio(audioBase64) {
  playAudio(audioBase64);
  setInterviewState('ai-speaking');
}

// 5. Audio finishes playing
onAudioEnded() {
  setInterviewState('user-speaking');
}
```

---

## Tab-Switch Detection

### Detection Methods

#### 1. Page Visibility API
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    terminateInterview('Tab switched');
  }
});
```

#### 2. Window Blur Event
```javascript
window.addEventListener('blur', () => {
  if (!tabSwitchDetectedRef.current) {
    terminateInterview('Window lost focus');
  }
});
```

#### 3. Keyboard Shortcut Detection
```javascript
window.addEventListener('keydown', (e) => {
  const isTabSwitch = (
    (e.altKey && e.key === 'Tab') ||      // Alt+Tab (Windows)
    (e.metaKey && e.key === 'Tab') ||     // Cmd+Tab (Mac)
    (e.ctrlKey && e.key === 'Tab') ||     // Ctrl+Tab (Browser tabs)
    (e.metaKey && e.key === '`') ||       // Cmd+` (Mac app switch)
    (e.key === 'Meta' || e.key === 'Win') // Windows key
  );
  
  if (isTabSwitch) {
    e.preventDefault();
    terminateInterview('Tab switch shortcut detected');
  }
});
```

### Warning Modal

- Displayed **after form submission** and **before interview starts**
- Blocks interview start until acknowledged
- Lists all prohibited actions:
  - No switching browser tabs
  - No switching applications
  - No minimizing window
  - No keyboard shortcuts
- Requires explicit acknowledgment to proceed

### Termination Flow

```javascript
function terminateInterview(reason) {
  // 1. Set flag to prevent duplicate terminations
  tabSwitchDetectedRef.current = true;
  
  // 2. Alert user
  alert('Interview Terminated: ' + reason);
  
  // 3. Close WebSocket
  if (socketRef.current) {
    socketRef.current.close();
  }
  
  // 4. Call end interview API
  endInterview();
  
  // 5. Navigate to results (with termination flag)
  navigate('/results', { state: { terminated: true } });
}
```

---

## API Integration

### Base Configuration

```javascript
// Environment-based API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### API Methods

#### Job Management
```javascript
// Create job
api.createJob({
  title: 'Senior Frontend Developer',
  description: '...',
  department: 'Engineering',
  location: 'Remote',
  required_skills: ['React', 'TypeScript', 'Node.js']
});

// Get all jobs
api.getJobs();

// Get single job
api.getJob(jobId);

// Update job
api.updateJob(jobId, updatedData);

// Delete job
api.deleteJob(jobId);
```

#### Interview Session Management
```javascript
// Create session
api.createSession({
  job_id: 'uuid',
  candidate_name: 'John Doe',
  candidate_email: 'john@example.com'
});

// Get session details
api.getSession(sessionId);

// Get session connection (for WebSocket)
api.getSessionConnection(sessionId);
// Returns: { token, channel, ws_url, candidate_name, job_title }

// End session
api.endSession(sessionId);
// Returns: { is_completed, overall_score, scorecard }
```

#### Candidate Management
```javascript
// Get all candidates
api.getCandidates(jobId);

// Get candidate scorecard
api.getCandidateScorecard(candidateId);

// Update candidate status
api.updateCandidateStatus(candidateId, status);
```

### Error Handling

```javascript
try {
  const data = await api.createJob(jobData);
  // Success
} catch (error) {
  if (error.message.includes('Network error')) {
    // Backend is down
    showErrorToast('Cannot connect to server');
  } else if (error.message.includes('HTTP 401')) {
    // Unauthorized
    redirectToLogin();
  } else {
    // Other errors
    showErrorToast(error.message);
  }
}
```

---

## Setup & Installation

### Prerequisites

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher (or yarn/pnpm)
- **Modern browser**: Chrome 90+, Firefox 88+, Safari 14+

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/talentcrew-ai.git
cd talentcrew-ai

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Configure environment variables
# Edit .env and set:
# VITE_API_URL=http://localhost:8000
# VITE_CENTRIFUGO_WS_URL=ws://localhost:8001/connection/websocket
# VITE_INTERVIEW_TOKEN_URL=http://localhost:8000/interviews/token

# 5. Start development server
npm run dev

# Application will be available at http://localhost:5173
```

### Environment Variables

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000

# Centrifugo WebSocket URL
VITE_CENTRIFUGO_WS_URL=ws://localhost:8001/connection/websocket

# Token generation endpoint
VITE_INTERVIEW_TOKEN_URL=http://localhost:8000/interviews/token
```

### Backend Setup (Required)

The frontend requires a running backend. See backend repository for setup:

```bash
# Backend requirements:
# - Django 4.2+
# - PostgreSQL 14+
# - Centrifugo 4.x
# - OpenAI API key
```

---

## Development Guide

### Available Scripts

```bash
# Start development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Lint and fix
npm run lint --fix
```

### Project Configuration Files

#### vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000' // Proxy API requests
    }
  }
});
```

#### tailwind.config.js
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  }
};
```

### Code Style Guidelines

1. **Component Structure**
   ```jsx
   // Imports
   import { useState } from 'react';
   
   // Component
   export default function MyComponent({ prop1, prop2 }) {
     // Hooks
     const [state, setState] = useState(null);
     
     // Event handlers
     const handleClick = () => {};
     
     // Effects
     useEffect(() => {}, []);
     
     // Render
     return <div>...</div>;
   }
   ```

2. **Naming Conventions**
   - Components: PascalCase (`InterviewPage.jsx`)
   - Hooks: camelCase with "use" prefix (`useInterviewLogic.js`)
   - Utilities: camelCase (`audioAnalysis.js`)
   - Constants: SCREAMING_SNAKE_CASE

3. **File Organization**
   - One component per file
   - Related components in same directory
   - Shared utilities in `/lib/`
   - Page components in `/pages/`

### Adding New Features

#### 1. Add a new page
```bash
# Create page component
touch src/pages/NewPage.jsx

# Add route in App.jsx
<Route path="/new-page" element={<NewPage />} />
```

#### 2. Add a new component
```bash
# Create component
touch src/components/NewComponent.jsx

# Import and use
import NewComponent from './components/NewComponent';
```

#### 3. Add a new API endpoint
```javascript
// In src/lib/api.js
export const api = {
  // ... existing methods
  
  newEndpoint: async (data) => {
    return await fetchWithErrorHandling(
      `${API_BASE_URL}/new-endpoint/`,
      { method: 'POST', body: JSON.stringify(data) }
    );
  }
};
```

---

## Production Deployment

### Build Process

```bash
# 1. Install dependencies
npm ci

# 2. Run linter
npm run lint

# 3. Build production bundle
npm run build

# Output will be in /dist directory
```

### Deployment Checklist

- [ ] Configure production environment variables
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS on backend
- [ ] Enable compression (gzip/brotli)
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Create backup strategy

### Environment-Specific Configuration

#### Production (.env.production)
```bash
VITE_API_URL=https://api.talentcrew.com
VITE_CENTRIFUGO_WS_URL=wss://ws.talentcrew.com/connection/websocket
VITE_INTERVIEW_TOKEN_URL=https://api.talentcrew.com/interviews/token
```

#### Staging (.env.staging)
```bash
VITE_API_URL=https://staging-api.talentcrew.com
VITE_CENTRIFUGO_WS_URL=wss://staging-ws.talentcrew.com/connection/websocket
```

### Deployment Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# Add in Netlify dashboard
```

#### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization

1. **Code Splitting**
   ```javascript
   // Lazy load pages
   const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
   ```

2. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Add responsive images

3. **Bundle Analysis**
   ```bash
   npm run build -- --mode analyze
   ```

4. **Caching Strategy**
   ```javascript
   // Service worker for offline support
   // PWA manifest for mobile
   ```

---
