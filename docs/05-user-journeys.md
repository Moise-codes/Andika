# ANDIKA - User Journeys

**Version**: 1.0  
**Date**: 2026-09-18  
**Status**: Draft

---

## 1. Introduction

This document defines the user journeys for ANDIKA, mapping the end-to-end experiences users will have with the platform.

---

## 2. Primary User Journeys

### 2.1 New User Onboarding Journey

**Persona**: Beginner Student (Alex)

**Trigger**: User discovers ANDIKA through search or referral

**Steps**:
1. User lands on marketing website
2. User reads hero section and value proposition
3. User tries interactive typing demo
4. User clicks "Get Started Free" CTA
5. User is presented with signup options (email/password or Google OAuth)
6. User selects Google OAuth
7. User authorizes with Google account
8. User is redirected to onboarding flow
9. User selects experience level: "Beginner"
10. User selects primary goal: "Both speed and accuracy"
11. User selects keyboard layout: "QWERTY"
12. User selects language: "English"
13. User selects theme: "Forest"
14. User selects sound: "Mechanical"
15. User completes onboarding and is redirected to dashboard
16. User sees welcome message and recommended first lesson
17. User clicks "Start Lesson" to begin learning journey

**Success Criteria**:
- User completes signup in < 2 minutes
- User completes onboarding in < 3 minutes
- User starts first lesson within 5 minutes of landing on site
- User understands how to navigate the interface

**Pain Points to Address**:
- Signup friction
- Onboarding fatigue
- Unclear next steps after signup

---

### 2.2 Learning Journey

**Persona**: Beginner Student (Alex)

**Trigger**: User wants to learn proper typing technique

**Steps**:
1. User navigates to Learn section
2. User views available courses
3. User clicks on "Typing Fundamentals" course
4. User sees course modules and lessons
5. User clicks on "Home Row" lesson
6. User reads lesson objectives and instructions
7. User sees keyboard visualization highlighting home row keys
8. User starts typing exercise
9. System provides real-time feedback on correct/incorrect keystrokes
10. User completes exercise
11. System shows results (WPM, accuracy, errors)
12. User meets accuracy requirement (85%)
13. User meets speed target (20 WPM)
14. Lesson is marked complete
15. User sees progress bar update
16. Next lesson is unlocked
17. User continues to next lesson or returns to course overview

**Success Criteria**:
- User completes lesson with clear understanding of progress
- User receives actionable feedback on errors
- User feels motivated to continue
- Lesson completion takes appropriate time (5-10 minutes)

**Pain Points to Address**:
- Unclear lesson objectives
- Lack of progress feedback
- Frustration from repeated failures

---

### 2.3 Practice Journey

**Persona**: Professional (Sarah)

**Trigger**: User wants to improve typing speed during lunch break

**Steps**:
1. User logs into dashboard
2. User sees "Start Practice" quick action
3. User clicks "Start Practice"
4. User selects practice mode: "Accuracy Focus"
5. User selects duration: "5 minutes"
6. User selects content: "Custom text" (pastes work document)
7. User starts practice session
8. System tracks typing in real-time
9. User completes session
10. System shows immediate results
11. User reviews "How You Typed" analysis
12. User sees weak keys identified (e.g., "A", "S", "D")
13. System recommends: "Practice weak keys for 3 minutes"
14. User accepts recommendation
15. User completes weak keys practice
16. User returns to dashboard
17. User sees updated stats and streak maintained

**Success Criteria**:
- Practice session starts in < 30 seconds
- User receives actionable insights
- User feels productive after session
- Session fits within available time (lunch break)

**Pain Points to Address**:
- Time-consuming setup
- Lack of personalized recommendations
- Unclear if practice is effective

---

### 2.4 Typing Test Journey

**Persona**: Competitive Typist (Jordan)

**Trigger**: User wants to benchmark current performance

**Steps**:
1. User navigates to Test section
2. User selects test type: "Time-based"
3. User selects duration: "60 seconds"
4. User selects content mode: "Plain text"
5. User enables punctuation
6. User starts test
7. Timer counts down from 60
8. User types with full focus
9. Real-time WPM displayed
10. Real-time accuracy displayed
11. Timer reaches 0
12. Test auto-completes
13. System calculates provisional results
14. System sends results to server for validation
15. Server validates result integrity
16. Validated results displayed
17. User sees: WPM: 105, Accuracy: 97%, Consistency: 92%
18. User clicks "View Analysis"
19. User sees speed over time graph
20. User sees accuracy over time graph
21. User sees weak keys: "Q", "Z", "X"
22. User sees slow transitions: "T → H", "N → G"
23. User sees recommendation: "Practice T-H transition"
24. User saves result to history
25. User checks leaderboard position
26. User sees rank improved from #15 to #12
27. User feels motivated to continue

**Success Criteria**:
- Test starts instantly
- Real-time feedback is accurate
- Results are validated quickly (< 2 seconds)
- Analysis provides actionable insights
- Leaderboard position updates correctly

**Pain Points to Address**:
- Delay between test completion and results
- Unclear if results are official/validated
- Lack of detailed analysis
- Leaderboard not updating

---

### 2.5 Programming Typing Journey

**Persona**: Developer (Marcus)

**Trigger**: User wants to improve code typing speed

**Steps**:
1. User navigates to Programming section
2. User selects language: "TypeScript"
3. User selects difficulty: "Intermediate"
4. System loads TypeScript code snippet
5. User starts typing code
6. System highlights syntax correctly
7. User types with proper syntax highlighting
8. User completes code snippet
9. System shows results
10. User sees: WPM: 75, Accuracy: 94%
11. User reviews errors: Missing semicolon, wrong bracket
12. System identifies weak special characters: "{", "}", ";"
13. User selects another TypeScript snippet
14. User continues practice
15. After 3 sessions, user views programming analytics
16. User sees improvement in special character accuracy
17. User feels more confident typing code

**Success Criteria**:
- Code snippets are realistic and relevant
- Syntax highlighting is accurate
- Errors are identified clearly
- Progress is tracked specifically for programming

**Pain Points to Address**:
- Code snippets too simple/complex
- Syntax highlighting incorrect
- Generic typing feedback not relevant to code

---

### 2.6 Competition Journey

**Persona**: Competitive Typist (Jordan)

**Trigger**: User wants to compete against others

**Steps**:
1. User navigates to Competition section
2. User sees available public races
3. User sees "Race starting in 2 minutes" with 3/4 participants
4. User clicks "Join Race"
5. User is added to race lobby
6. User sees other participants
7. User clicks "Ready"
8. User waits for all participants to ready up
9. Countdown begins: 3, 2, 1
10. Race starts simultaneously for all
11. User sees real-time progress of all participants
12. User types competitively
13. User finishes in 1st place
14. System validates result
15. Results screen shows all participants
16. User sees: 1st place, WPM: 108, Accuracy: 96%
17. User receives notification: "Achievement Unlocked: Race Winner"
18. User clicks "View Analysis"
19. User reviews performance
20. User clicks "Find Another Race"
21. User continues competing

**Success Criteria**:
- Race starts simultaneously for all participants
- Real-time progress updates smoothly
- Results are validated and accurate
- Achievements are awarded correctly
- Low latency WebSocket communication

**Pain Points to Address**:
- Desynchronization between participants
- Lag in real-time updates
- Invalid results from cheaters
- Difficulty finding races

---

### 2.7 Analytics Review Journey

**Persona**: Professional (Sarah)

**Trigger**: User wants to track progress over time

**Steps**:
1. User navigates to Analytics section
2. User sees dashboard with overview metrics
3. User selects time range: "30 days"
4. User views WPM progression chart
5. User sees upward trend from 55 to 62 WPM
6. User views accuracy progression chart
7. User sees consistent 90%+ accuracy
8. User views consistency chart
9. User sees consistency improving from 85% to 91%
10. User views practice time accumulation
11. User sees total: 12 hours this month
12. User views weak keys analysis
13. User sees "P", "Y", "B" as weak keys
14. User clicks on weak keys to see detailed breakdown
15. User sees error rate for each weak key
16. User returns to dashboard
17. User sees recommended practice based on analytics
18. User feels motivated by visible progress

**Success Criteria**:
- Charts load quickly
- Data is accurate and meaningful
- Insights are actionable
- User can drill down into specific metrics

**Pain Points to Address**:
- Charts take too long to load
- Data is overwhelming or unclear
- No clear actionable insights
- Cannot drill down into specific time periods

---

### 2.8 Settings Configuration Journey

**Persona**: Accessibility User (Sam)

**Trigger**: User needs to configure accessibility settings

**Steps**:
1. User navigates to Settings section
2. User sees settings categories
3. User clicks "Appearance"
4. User selects theme: "High Contrast"
5. User sees immediate preview
6. User clicks "Accessibility"
7. User enables "Reduced motion"
8. User enables "High contrast mode"
9. User clicks "Typing"
10. User selects caret style: "Block"
11. User selects caret behavior: "Static" (no blinking)
12. User clicks "Save"
13. System confirms settings saved
14. User navigates back to typing test
15. User sees high contrast theme applied
16. User sees static block caret
17. User confirms settings work as expected
18. User can now use ANDIKA comfortably

**Success Criteria**:
- Settings are easy to find
- Changes are applied immediately
- Settings persist across sessions
- Accessibility features work correctly

**Pain Points to Address**:
- Settings difficult to find
- Changes not applied immediately
- Settings don't persist
- Accessibility features incomplete

---

### 2.9 Profile Management Journey

**Persona**: Professional (Sarah)

**Trigger**: User wants to update profile and privacy settings

**Steps**:
1. User navigates to Profile section
2. User sees current profile information
3. User clicks "Edit Profile"
4. User updates username
5. User uploads new avatar
6. User saves changes
7. User navigates to "Privacy Settings"
8. User sees privacy controls
9. User toggles "Public profile" to ON
10. User toggles "Leaderboard visibility" to ON
11. User toggles "Country visibility" to OFF
12. User saves privacy settings
13. User navigates to public profile view
14. User confirms profile is public
15. User confirms country is not visible
16. User confirms leaderboard position is visible
17. User feels in control of privacy

**Success Criteria**:
- Profile updates are saved correctly
- Privacy settings are enforced immediately
- Public profile reflects privacy choices
- User feels in control of their data

**Pain Points to Address**:
- Privacy settings unclear
- Changes not reflected immediately
- Public profile doesn't respect privacy settings

---

### 2.10 Streak Maintenance Journey

**Persona**: Student (Liam)

**Trigger**: User wants to maintain daily streak

**Steps**:
1. User logs into dashboard
2. User sees streak: "5 days"
3. User sees daily goal: "10 minutes practice"
4. User sees progress: "0/10 minutes"
5. User clicks "Start Practice"
6. User completes 10-minute practice session
7. User returns to dashboard
8. User sees streak: "6 days"
9. User sees daily goal: "Completed ✓"
10. User receives notification: "Streak milestone: 1 week!"
11. User feels motivated to continue
12. User sets reminder for tomorrow
13. User commits practicing daily

**Success Criteria**:
- Streak is calculated correctly
- Daily goal is clear and achievable
- Streak milestones are celebrated
- Reminders help maintain consistency

**Pain Points to Address**:
- Streak calculation incorrect (timezone issues)
- Daily goal unclear or too difficult
- No celebration for milestones
- Easy to forget to practice

---

## 3. Edge Case Journeys

### 3.1 Session Expiry Journey

**Trigger**: User's session expires during typing test

**Steps**:
1. User is in middle of 60-second typing test
2. Session expires (7 days since login)
3. Test completes normally (client-side)
4. User sees results
5. User clicks "Save Result"
6. System detects expired session
7. System prompts user to re-login
8. User logs in again
7. System saves result to authenticated user's history
8. User continues normally

**Success Criteria**:
- Test is not interrupted by session expiry
- Result is saved after re-authentication
- User experience is seamless

**Pain Points to Address**:
- Test interrupted by session expiry
- Result lost after session expiry
- Confusing re-authentication flow

---

### 3.2 Network Failure Journey

**Trigger**: Network connection fails during competition

**Steps**:
1. User is in active competition
2. Network connection drops
3. WebSocket connection closes
4. System detects disconnection
5. System displays "Reconnecting..." message
6. User continues typing locally
7. Network reconnects after 5 seconds
8. System attempts to reconnect to competition
9. If reconnection successful: User rejoins competition with progress
10. If reconnection fails: User's result is submitted when connection restores
11. User sees final results

**Success Criteria**:
- User can continue typing during disconnection
- Reconnection is automatic
- Progress is not lost
- Graceful degradation

**Pain Points to Address**:
- Typing interrupted by network failure
- Progress lost during disconnection
- No indication of connection status

---

### 3.3 Error Recovery Journey

**Trigger**: User encounters error during lesson completion

**Steps**:
1. User completes lesson
2. System attempts to save progress
3. Database error occurs
4. System displays user-friendly error message
5. System offers "Retry" option
6. User clicks "Retry"
7. System successfully saves progress
8. User continues normally
9. If retry fails: System offers "Save locally" option
10. User accepts local save
11. System saves progress locally
12. System syncs when connection restored

**Success Criteria**:
- Error message is clear and actionable
- Retry option works
- Local save prevents data loss
- Sync happens automatically

**Pain Points to Address**:
- Cryptic error messages
- No recovery options
- Data loss on errors

---

## 4. Cross-Feature Journeys

### 4.1 Learning to Practice Journey

**Trigger**: User completes lesson and wants to practice specific skills

**Steps**:
1. User completes "Home Row" lesson
2. System shows lesson results
3. System identifies weak keys from lesson
4. System recommends: "Practice home row keys for 5 minutes"
5. User accepts recommendation
6. System launches practice session with home row focus
7. User completes practice
8. System shows improvement in weak keys
9. User returns to learning journey

**Success Criteria**:
- Recommendations are relevant to lesson performance
- Transition from learning to practice is seamless
- Practice is targeted to lesson weaknesses

**Pain Points to Address**:
- Generic recommendations not related to lesson
- Manual navigation required to find relevant practice
- No connection between learning and practice

---

### 4.2 Practice to Competition Journey

**Trigger**: User achieves personal best in practice and wants to compete

**Steps**:
1. User completes practice with personal best WPM
2. System celebrates achievement
3. System suggests: "Ready to compete? Join a race"
4. User clicks "Find Race"
5. System shows available competitions
6. User joins competition
7. User competes with confidence from practice success
8. User performs well in competition

**Success Criteria**:
- Celebration motivates user to compete
- Transition to competition is encouraged
- User feels prepared for competition

**Pain Points to Address**:
- No encouragement to compete after good practice
- Competition not easily discoverable
- User feels unprepared for competition

---

## 5. Journey Maps Summary

| Journey | Primary Persona | Duration | Frequency | Key Success Metric |
|--------|----------------|----------|-----------|-------------------|
| New User Onboarding | Beginner Student | 5 min | Once | Signup completion rate |
| Learning | Beginner Student | 10-15 min | Daily | Lesson completion rate |
| Practice | Professional | 5-10 min | 2-3x/week | Practice session completion |
| Typing Test | Competitive Typist | 1-2 min | Weekly | Test completion rate |
| Programming Typing | Developer | 10-15 min | Weekly | Code accuracy improvement |
| Competition | Competitive Typist | 2-3 min | Multiple/week | Competition participation |
| Analytics Review | Professional | 5 min | Weekly | Analytics engagement |
| Settings Configuration | Accessibility User | 3-5 min | Once/rarely | Settings save success |
| Profile Management | Professional | 5 min | Monthly | Profile update completion |
| Streak Maintenance | Student | 10 min | Daily | Streak retention rate |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-18 | Cascade | Initial User Journeys document |
