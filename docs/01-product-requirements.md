# ANDIKA - Product Requirements Document (PRD)

**Version**: 1.0  
**Date**: 2026-09-18  
**Status**: Draft

---

## 1. Executive Summary

ANDIKA is a modern typing-learning and typing-performance platform designed to help users progress from basic keyboard skills to high-speed, high-accuracy typing ability. The platform combines structured education, practice, testing, analytics, and competitive features into a cohesive experience.

**Tagline**: "Learn. Practice. Master Typing."

**Core Philosophy**: LEARN → PRACTICE → TEST → UNDERSTAND → IMPROVE → COMPETE → REPEAT

---

## 2. Product Identity

### 2.1 Product Name
- **Official Name**: ANDIKA
- **Previous Name**: TypeForge (obsolete - must not exist in final system)
- **Tagline**: "Learn. Practice. Master Typing."

### 2.2 Brand Colors

**Forest Green**:
- Primary: `#415239`
- Dark: `#34442F`
- Darkest: `#29372A`

**Ivory**:
- Light: `#FAF8F5`
- Medium: `#F4F0E7`

**Neutral**:
- `#E8E5DD`

**Text**:
- Primary: `#30302E`
- Secondary: `#696A64`

**Border**:
- `#D9D7CF`

### 2.3 Design Direction
- Warm ivory background
- Deep forest green accents
- Editorial whitespace
- Restrained interface
- Rounded controls
- Subtle borders
- Premium minimalism

---

## 3. Target Audience

### 3.1 Primary Users
- **Beginners**: Learning basic keyboard skills
- **Students**: Improving typing for academic work
- **Professionals**: Increasing productivity through faster typing
- **Developers**: Improving code typing speed and accuracy
- **Competitive Typists**: Participating in typing competitions
- **Accuracy-focused Users**: Reducing errors in typing
- **Speed-focused Users**: Increasing words per minute

### 3.2 Geographic Scope
- Initial languages: English, French, Kinyarwanda
- Future languages: Swahili, Spanish, Portuguese

---

## 4. Core Product Areas

1. Marketing website
2. Authentication
3. Onboarding
4. Dashboard
5. Learning system
6. Practice system
7. Typing tests
8. Typing results
9. "How You Typed" analysis
10. Analytics
11. Personalized improvement
12. Themes
13. Keyboard layouts
14. Achievements
15. Streaks
16. Leaderboards
17. Real-time competitions
18. Programming typing
19. Profile
20. Settings
21. Notifications
22. Administration
23. Security
24. Future monetization

---

## 5. Business Model

### 5.1 Initial Model
**Free-First**: Core functionality available without payment

**Free Features**:
- Learning courses
- Practice modes
- Typing tests
- Core analytics
- Themes
- Keyboard layouts
- Achievements
- Streaks
- Basic leaderboards
- Programming typing

### 5.2 Future Monetization
- ANDIKA PRO (individual premium)
- TEAMS (group subscriptions)
- SCHOOLS (educational institutions)
- ENTERPRISE (large organizations)

**Architecture Requirement**: Entitlement-based architecture, not scattered premium checks

---

## 6. Key Features

### 6.1 Learning System

**Curriculum Structure**:
1. Keyboard fundamentals
2. Home row
3. Top row
4. Bottom row
5. Numbers
6. Punctuation
7. Capitalization
8. Common words
9. Sentences
10. Paragraphs
11. Accuracy focus
12. Speed focus
13. Professional typing
14. Programming typing

**Hierarchy**: Course → Module → Lesson → Exercise → Assessment

**Lesson Features**:
- Learning objectives
- Instructions
- Keyboard visualization
- Typing exercises
- Accuracy requirements
- Speed targets
- Completion rules
- Progress tracking

**Tracked Metrics**:
- Attempts
- Completion status
- Accuracy
- WPM
- Errors
- Time spent

### 6.2 Practice System

**Practice Modes**:
- Weak keys focus
- Accuracy focus
- Speed focus
- Words practice
- Quotes practice
- Numbers practice
- Punctuation practice
- Custom text
- Mixed practice
- Programming practice

**Adaptive Practice**: System adapts to user's actual weaknesses over time

### 6.3 Typing Test System

**Time-based Tests**:
- 15 seconds
- 30 seconds
- 60 seconds
- 120 seconds
- Custom duration

**Word-based Tests**:
- 10 words
- 25 words
- 50 words
- 100 words
- Custom count

**Content Modes**:
- Plain text
- Quotes
- Custom text
- Numbers
- Punctuation
- Capitalization
- Programming code

**Test UI Requirements**:
- Timer display
- Real-time WPM
- Real-time accuracy
- Progress indicator
- Caret visualization
- Typing content display
- Restart functionality
- Completion handling
- Result generation

### 6.4 Typing Engine

**Performance Targets**:
- Must remain responsive at 100 WPM
- Must remain responsive at 150 WPM
- Must remain responsive at 200 WPM

**Tracked Metrics**:
- Expected character
- Actual character
- Correct characters
- Incorrect characters
- Backspaces
- Elapsed time
- Character timing
- Key timing
- Key transitions
- Errors
- Completed characters
- Remaining characters
- Raw WPM
- Net WPM
- Accuracy
- Consistency

**Architecture Requirement**:
- Browser handles real-time typing locally
- No network requests per keystroke
- Server validates official results

### 6.5 "How You Typed" Analysis

**Core Metrics Display**:
- WPM
- Raw WPM
- Accuracy
- Consistency
- Total characters
- Correct characters
- Incorrect characters
- Backspaces
- Duration
- Error count

**Advanced Analysis**:
- Speed over time graph
- Accuracy over time graph
- Error distribution
- Weak keys identification
- Slow keys identification
- Slow transitions identification
- Repeated mistakes
- Difficult punctuation
- Difficult words
- Consistency scoring
- Personalized recommendations

**Example Recommendation**: "You slowed down during T → H transitions. Practice this transition."

**Requirement**: Recommendations must be based on real user data

### 6.6 Analytics

**Dashboard Metrics**:
- Current WPM
- Average WPM
- Best WPM
- Accuracy
- Consistency
- Practice time
- Tests completed
- Current streak
- Daily goal progress

**Analytics Views**:
- WPM progression
- Accuracy progression
- Consistency trends
- Practice time accumulation
- Error patterns
- Weak keys
- Key transition analysis

**Time Ranges**:
- 7 days
- 30 days
- 90 days
- 365 days
- All time

**Performance Requirement**: Avoid transferring unnecessarily large datasets to client

### 6.7 Personalized Improvement

**Initial Approach**: Deterministic rules (not ML for marketing)

**Inputs**:
- Key error rate
- Key frequency
- Transition error rate
- Average key latency
- Current accuracy
- Current WPM
- Recent session data
- Historical performance
- Lesson performance

**Outputs**:
- Recommended lesson
- Recommended practice mode
- Weak keys list
- Recommended difficulty
- Recommended duration

**Architecture Requirement**: Design interface to allow future ML replacement/augmentation

### 6.8 Themes

**Initial Themes**:
1. Forest (default)
2. Ivory
3. Midnight
4. OLED
5. Minimal
6. Classic
7. High Contrast

**Architecture**: Centralized CSS variables

### 6.9 Keyboard Layouts

**Supported Layouts**:
- QWERTY
- AZERTY
- QWERTZ
- Dvorak
- Colemak

**Requirement**: Keyboard visualization must adapt to selected layout

### 6.10 Sound & Caret Settings

**Sound Options**:
- Off
- Mechanical
- Soft
- Typewriter
- Minimal

**Sound Controls**:
- Volume adjustment

**Caret Styles**:
- Block
- Line
- Underline

**Caret Behavior**:
- Blink
- Static
- Smooth

**Accessibility**: Respect reduced-motion preferences

### 6.11 Programming Typing

**Supported Languages**:
- Python
- Java
- JavaScript
- TypeScript
- Go
- SQL
- HTML
- CSS

**Content Architecture**: Structured data, not hardcoded in React components

**Content Licensing**: Use original or appropriately licensed content

### 6.12 Achievements

**Categories**:
- Speed
- Accuracy
- Learning
- Practice
- Streak
- Competition
- Milestones

**Example Achievements**:
- First Test
- 1,000 Characters
- 7 Day Streak
- 100 WPM
- 99% Accuracy
- Course Completed

**Architecture**: Data-driven achievement rules

### 6.13 Streaks

**Tracked Metrics**:
- Current streak
- Longest streak
- Daily activity
- Weekly activity

**Time Handling**:
- Account for user timezone
- Calendar boundaries
- Missed days
- Server time validation

**Requirement**: Do not rely entirely on client clock

### 6.14 Leaderboards

**Leaderboard Types**:
- Global
- Country
- Weekly
- Monthly
- All-time

**Display Data**:
- Rank
- Username
- WPM
- Accuracy
- Country (when user chooses to expose)

**Security Requirement**: Leaderboard data must come from validated server-side results. Users cannot directly modify ranking data.

### 6.15 Real-time Competitions

**Supported Modes**:
- Public races
- Private rooms
- Friend challenges
- Real-time battles

**Competition Lifecycle**:
1. Create
2. Join
3. Ready
4. Countdown
5. Start
6. Typing
7. Finish
8. Validate
9. Results
10. Disconnect
11. Reconnect

**Technology**: WebSockets

**Performance Requirement**: Do not send unnecessary raw keystroke traffic to every client

### 6.16 Profile

**Profile Data**:
- Avatar
- Username
- Joined date
- Best WPM
- Average WPM
- Accuracy
- Total tests
- Practice time
- Achievements
- Streak

**Privacy Controls**:
- Public profile toggle
- Leaderboard visibility
- Country visibility
- Statistics visibility

---

## 7. Technical Stack

### 7.1 Frontend
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Phosphor Icons
- **Animation**: Motion (Framer Motion)
- **Fonts**: next/font

### 7.2 Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma or Drizzle (choose one)
- **Authentication**: Supabase Auth
- **Real-time**: WebSockets

### 7.3 Deployment
- **Frontend**: Vercel (initial)
- **Backend**: AWS ECS/Fargate
- **Infrastructure**: ECR, ALB, WAF, CloudFront, CloudWatch, Secrets Manager, S3, SQS, Redis (as needed)

---

## 8. Success Metrics

### 8.1 User Engagement
- Daily active users
- Weekly active users
- Session duration
- Return rate

### 8.2 Learning Outcomes
- Average WPM improvement
- Average accuracy improvement
- Course completion rates
- Streak maintenance

### 8.3 Technical Performance
- Typing responsiveness at high WPM
- Page load times
- API response times
- WebSocket latency

---

## 9. Constraints & Assumptions

### 9.1 Constraints
- Initial launch as free-first product
- No artificial crippling of core features
- Must support multiple keyboard layouts
- Must support multiple languages
- Must be accessible (WCAG AA)
- Must be responsive across devices

### 9.2 Assumptions
- Users have physical keyboards for optimal typing experience
- Mobile users primarily use app for learning/analytics, not typing tests
- Initial user base is English-speaking with expansion planned

---

## 10. Future Considerations

### 10.1 Monetization
- Entitlement-based architecture required
- Premium features should be clearly differentiated
- No payment complexity in initial release

### 10.2 Scalability
- Design for horizontal scaling
- Avoid premature microservices
- Modular monolith initial architecture

### 10.3 ML Integration
- Design recommendation engine interface for future ML
- Do not introduce LLM unnecessarily
- Start with deterministic rules

---

## 11. Dependencies

### 11.1 External Services
- Supabase (Auth, Database)
- Vercel (Frontend hosting)
- AWS (Backend hosting)

### 11.2 Internal Dependencies
- Phase 1 architecture must be complete before implementation
- Database schema must be finalized
- API contract must be defined
- Security model must be approved

---

## 12. Risks

### 12.1 Technical Risks
- Typing performance at high WPM
- WebSocket scaling for competitions
- Database query performance for analytics
- Cross-browser compatibility for typing engine

### 12.2 Product Risks
- User retention after initial learning
- Competition with established typing platforms
- Content licensing for programming typing
- Localization quality

### 12.3 Security Risks
- Score manipulation
- Leaderboard manipulation
- Replay attacks
- WebSocket abuse

---

## 13. Open Questions

1. **ORM Selection**: Prisma vs Drizzle - to be decided in Phase 1
2. **Initial Content Volume**: How much typing content to launch with
3. **Competition Scaling**: At what user count to introduce Redis for WebSocket scaling
4. **Analytics Retention**: How long to retain detailed typing data

---

## 14. Approval

**Product Owner**: _______________  
**Engineering Lead**: _______________  
**Date**: _______________

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-18 | Cascade | Initial PRD based on Phase 1 specifications |
