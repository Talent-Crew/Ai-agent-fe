# TalentCrew - AI-Powered Interview Platform

An enterprise-grade frontend application for conducting AI-powered interviews and managing candidate evaluations.

## 🏗️ Project Architecture

### Component Structure

```
/src
  /components
    /ui                    # Reusable UI primitives
      ├── Button.jsx       # Flexible button with variants
      ├── Input.jsx        # Text input with multiline support
      ├── Badge.jsx        # Status and tag badges
      └── Card.jsx         # Container component
    
    /interview             # Candidate interview interface
      ├── InterviewHeader.jsx    # Header with logo, timer, stepper
      ├── ProgressStepper.jsx    # Visual stage indicator
      ├── Timer.jsx              # Interview elapsed time
      ├── ChatBubble.jsx         # Message bubble (AI/User)
      ├── ChatContainer.jsx      # Scrollable message list
      └── InputController.jsx    # Message input with voice toggle
    
    /dashboard             # Recruiter analytics interface
      ├── Sidebar.jsx            # Navigation sidebar
      ├── CandidateRow.jsx       # Table row component
      ├── CandidateTable.jsx     # Candidate list table
      ├── EvidenceCard.jsx       # Interview evidence snippet
      ├── ScoreChart.jsx         # Skills radar chart (SVG)
      └── ScorecardView.jsx      # Detailed candidate scorecard
  
  /hooks                   # Custom React hooks
    ├── useInterviewLogic.js   # Interview flow state machine
    └── useSpeechToText.js     # Voice input (placeholder)
  
  /pages                   # Top-level page components
    ├── InterviewPage.jsx      # Candidate interview view
    └── RecruiterDashboard.jsx # Recruiter evaluation view
  
  App.jsx                  # Main app with routing
  main.jsx                 # React entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (600, 700) - CTAs, active states
- **Neutral**: Slate (50-900) - Text, backgrounds, borders
- **Success**: Green (100, 500, 800) - Positive indicators
- **Warning**: Yellow (100, 500) - Caution states
- **Danger**: Red (100, 600) - Negative indicators
- **Accent**: Emerald/Orange - Evidence badges

### Component Variants

#### Button
- `primary` - Main actions (indigo)
- `secondary` - Secondary actions (slate)
- `outline` - Tertiary actions (bordered)
- `danger` - Destructive actions (red)
- `success` - Confirmations (green)

#### Badge
- `default`, `success`, `warning`, `danger`, `info`
- `strength`, `risk` - Evidence-specific

## 🔄 Interview Flow

### State Machine Stages
1. **Intro** - Introduction and role interest
2. **Role Calibration** - Understanding of position
3. **Technical** - Problem-solving and skills
4. **Communication** - Soft skills evaluation
5. **Wrap-up** - Questions and final thoughts

### Dynamic Adaptation
- AI responses adapt based on candidate input
- Automatic stage progression after ~3 exchanges
- Real-time "thinking" state simulation
- Conversation history maintained throughout

## 📊 Recruiter Dashboard Features

### Candidate Evaluation
- **Match Score** - 0-100% compatibility rating
- **Skills Radar Chart** - Visual skill breakdown
- **Evidence Snippets** - Quoted responses with context
- **Status Tracking** - Completed, Review, Declined

### Evidence Classification
- **Strength** - Positive indicators with relevance score
- **Risk** - Potential concerns flagged
- **Categories** - Technical, Communication, Experience

### Hiring Actions
- Move to next round
- Request follow-up interview
- Decline candidate
- AI-powered recommendations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
The application runs entirely client-side with mock data. For production:
1. Replace mock data with API calls
2. Implement authentication
3. Connect to AI backend service
4. Add speech-to-text integration

## 🎯 Key Features

### Candidate Interview Interface
✅ Stage-based interview progression  
✅ Real-time AI response simulation  
✅ Thinking state with loading animation  
✅ Elapsed time tracking  
✅ Voice-to-text toggle (UI ready)  
✅ Responsive chat interface  

### Recruiter Dashboard
✅ Candidate table with sorting  
✅ Match score visualization  
✅ Skills radar chart (SVG-based)  
✅ Evidence card grid  
✅ AI hiring recommendations  
✅ Multi-action verdict system  

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Heroicons (SVG-based)
- **Charts**: Custom SVG implementation

## 📝 Usage Examples

### Using UI Components

```jsx
import Button from './components/ui/Button';
import Badge from './components/ui/Badge';

<Button variant="primary" size="lg" onClick={handleClick}>
  Submit
</Button>

<Badge variant="success">Hired</Badge>
```

### Custom Hooks

```jsx
import useInterviewLogic from './hooks/useInterviewLogic';

const { currentStage, messages, handleCandidateResponse } = useInterviewLogic();
```

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Real AI model integration (OpenAI, Anthropic)
- [ ] Speech-to-text implementation
- [ ] Video recording capability
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG AAA)
- [ ] Role-based access control
- [ ] Interview template builder
- [ ] Export reports (PDF)

## 📄 License

MIT License - Built for TalentCrew Platform

## 🤝 Contributing

This is a demonstration project. For production deployment:
1. Implement proper authentication
2. Add error boundaries
3. Set up monitoring/analytics
4. Add comprehensive tests
5. Optimize bundle size
6. Configure CI/CD pipeline

---

**Built with ❤️ using React + Tailwind CSS**
