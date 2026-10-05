# ANDIKA - Non-functional Requirements Document (NFRD)

**Version**: 1.0  
**Date**: 2026-09-18  
**Status**: Draft

---

## 1. Introduction

This document defines the non-functional requirements for ANDIKA, specifying how the system must behave rather than what it must do.

---

## 2. Performance Requirements

### 2.1 Response Time
- **NFR-PER-001**: API response time for 95th percentile: < 200ms
- **NFR-PER-002**: API response time for 99th percentile: < 500ms
- **NFR-PER-003**: WebSocket message latency: < 50ms
- **NFR-PER-004**: Database query time for 95th percentile: < 100ms
- **NFR-PER-005**: Page load time (LCP): < 2.5s
- **NFR-PER-006**: Time to First Byte (TTFB): < 600ms

### 2.2 Typing Performance
- **NFR-PER-007**: Typing engine must remain responsive at 100 WPM
- **NFR-PER-008**: Typing engine must remain responsive at 150 WPM
- **NFR-PER-009**: Typing engine must remain responsive at 200 WPM
- **NFR-PER-010**: Keystroke processing latency: < 16ms (60fps)
- **NFR-PER-011**: No network requests per keystroke during typing

### 2.3 Throughput
- **NFR-PER-012**: System shall support 1,000 concurrent users
- **NFR-PER-013**: System shall support 100 concurrent typing competitions
- **NFR-PER-014**: System shall support 10,000 API requests per minute
- **NFR-PER-015**: System shall support 1,000 concurrent WebSocket connections

### 2.4 Resource Utilization
- **NFR-PER-016**: Frontend initial JavaScript bundle: < 200KB gzipped
- **NFR-PER-017**: Frontend total page weight: < 500KB gzipped
- **NFR-PER-018**: Backend memory per instance: < 512MB baseline
- **NFR-PER-019**: Database connection pool: 20 connections per instance

---

## 3. Scalability Requirements

### 3.1 Horizontal Scaling
- **NFR-SCL-001**: System shall support horizontal scaling of backend instances
- **NFR-SCL-002**: System shall support horizontal scaling of frontend instances
- **NFR-SCL-003**: System shall support database read replicas
- **NFR-SCL-004**: System shall support WebSocket scaling via Redis when needed

### 3.2 Vertical Scaling
- **NFR-SCL-005**: System shall support vertical scaling of database instances
- **NFR-SCL-006**: System shall support vertical scaling of backend instances

### 3.3 Load Handling
- **NFR-SCL-007**: System shall handle 10x traffic spike without degradation
- **NFR-SCL-008**: System shall implement auto-scaling based on CPU utilization
- **NFR-SCL-009**: System shall implement auto-scaling based on memory utilization

---

## 4. Availability Requirements

### 4.1 Uptime
- **NFR-AVL-001**: System uptime target: 99.5% monthly
- **NFR-AVL-002**: Maximum planned downtime: 4 hours per month
- **NFR-AVL-003**: Maximum unplanned downtime: 2 hours per month

### 4.2 Recovery
- **NFR-AVL-004**: Recovery Time Objective (RTO): 1 hour
- **NFR-AVL-005**: Recovery Point Objective (RPO): 15 minutes
- **NFR-AVL-006**: Database backups: Daily
- **NFR-AVL-007**: Backup retention: 30 days

### 4.3 Redundancy
- **NFR-AVL-008**: System shall deploy backend across multiple availability zones
- **NFR-AVL-009**: System shall implement database failover
- **NFR-AVL-010**: System shall implement load balancer health checks

---

## 5. Security Requirements

### 5.1 Authentication
- **NFR-SEC-001**: Passwords shall be hashed using bcrypt with minimum 12 rounds
- **NFR-SEC-002**: Session tokens shall expire after 7 days
- **NFR-SEC-003**: Refresh tokens shall expire after 30 days
- **NFR-SEC-004**: System shall implement multi-factor authentication for admin accounts
- **NFR-SEC-005**: System shall implement rate limiting on authentication endpoints

### 5.2 Authorization
- **NFR-SEC-006**: System shall implement Row Level Security (RLS) on PostgreSQL
- **NFR-SEC-007**: System shall validate authorization on every protected request
- **NFR-SEC-008**: System shall use principle of least privilege for database access
- **NFR-SEC-009**: System shall implement service account separation for backend

### 5.3 Data Protection
- **NFR-SEC-010**: All API communication shall use HTTPS/TLS 1.3
- **NFR-SEC-011**: WebSocket communication shall use WSS
- **NFR-SEC-012**: Sensitive data shall be encrypted at rest
- **NFR-SEC-013**: System shall implement CORS policies
- **NFR-SEC-014**: System shall implement security headers (Helmet, CSP, HSTS)

### 5.4 Input Validation
- **NFR-SEC-015**: System shall validate all user input
- **NFR-SEC-016**: System shall sanitize user-generated content
- **NFR-SEC-017**: System shall implement parameterized queries
- **NFR-SEC-018**: System shall implement request size limits

### 5.5 Threat Protection
- **NFR-SEC-019**: System shall protect against XSS attacks
- **NFR-SEC-020**: System shall protect against CSRF attacks
- **NFR-SEC-021**: System shall protect against SQL injection
- **NFR-SEC-022**: System shall protect against IDOR
- **NFR-SEC-023**: System shall protect against brute force attacks
- **NFR-SEC-024**: System shall protect against replay attacks

### 5.6 Secret Management
- **NFR-SEC-025**: Secrets shall be stored in AWS Secrets Manager
- **NFR-SEC-026**: Secrets shall never be committed to version control
- **NFR-SEC-027**: System shall rotate secrets quarterly
- **NFR-SEC-028**: Frontend shall only use Supabase publishable keys

---

## 6. Reliability Requirements

### 6.1 Error Handling
- **NFR-REL-001**: System shall implement graceful error handling
- **NFR-REL-002**: System shall log all errors with sufficient context
- **NFR-REL-003**: System shall not expose stack traces to users
- **NFR-REL-004**: System shall implement circuit breakers for external dependencies

### 6.2 Data Integrity
- **NFR-REL-005**: System shall implement database constraints
- **NFR-REL-006**: System shall implement foreign key constraints
- **NFR-REL-007**: System shall implement unique constraints
- **NFR-REL-008**: System shall implement data validation at database level

### 6.3 Transaction Management
- **NFR-REL-009**: System shall use database transactions for multi-step operations
- **NFR-REL-010**: System shall implement retry logic for transient failures
- **NFR-REL-011**: System shall implement idempotent operations

---

## 7. Usability Requirements

### 7.1 User Interface
- **NFR-USA-001**: System shall provide consistent UI patterns
- **NFR-USA-002**: System shall provide clear error messages
- **NFR-USA-003**: System shall provide loading indicators for async operations
- **NFR-USA-004**: System shall provide confirmation for destructive actions
- **NFR-USA-005**: System shall support keyboard navigation

### 7.2 Learnability
- **NFR-USA-006**: System shall provide onboarding for new users
- **NFR-USA-007**: System shall provide tooltips for complex features
- **NFR-USA-008**: System shall provide contextual help

### 7.3 Efficiency
- **NFR-USA-009**: Common tasks shall be accessible in ≤ 3 clicks
- **NFR-USA-010**: System shall provide keyboard shortcuts for power users
- **NFR-USA-011**: System shall provide command palette (Cmd+K)

---

## 8. Accessibility Requirements

### 8.1 WCAG Compliance
- **NFR-ACC-001**: System shall comply with WCAG 2.1 Level AA
- **NFR-ACC-002**: System shall support screen readers
- **NFR-ACC-003**: System shall support keyboard navigation
- **NFR-ACC-004**: System shall provide visible focus indicators

### 8.2 Visual Accessibility
- **NFR-ACC-005**: System shall respect reduced-motion preferences
- **NFR-ACC-006**: System shall provide high contrast theme
- **NFR-ACC-007**: System shall not rely solely on color for information
- **NFR-ACC-008**: System shall support text scaling up to 200%

### 8.3 Semantic HTML
- **NFR-ACC-009**: System shall use semantic HTML elements
- **NFR-ACC-010**: System shall provide ARIA labels where needed
- **NFR-ACC-011**: System shall announce dynamic content changes

---

## 9. Maintainability Requirements

### 9.1 Code Quality
- **NFR-MAI-001**: Code shall pass ESLint with no errors
- **NFR-MAI-002**: Code shall pass Prettier formatting
- **NFR-MAI-003**: TypeScript shall have strict mode enabled
- **NFR-MAI-004**: Code coverage target: 80% for critical paths

### 9.2 Documentation
- **NFR-MAI-005**: All public APIs shall be documented
- **NFR-MAI-006**: Complex functions shall have JSDoc comments
- **NFR-MAI-007**: Architecture decisions shall be documented (ADRs)
- **NFR-MAI-008**: README shall include setup instructions

### 9.3 Code Organization
- **NFR-MAI-009**: Frontend shall follow Next.js App Router conventions
- **NFR-MAI-010**: Backend shall follow NestJS module conventions
- **NFR-MAI-011**: Components shall be reusable and composable
- **NFR-MAI-012**: Business logic shall be separated from presentation

---

## 10. Portability Requirements

### 10.1 Platform Support
- **NFR-POR-001**: Frontend shall support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-POR-002**: Frontend shall support mobile browsers (iOS Safari, Chrome Mobile)
- **NFR-POR-003**: Backend shall run on Linux (Ubuntu 22.04 LTS)
- **NFR-POR-004**: Backend shall be containerized (Docker)

### 10.2 Deployment
- **NFR-POR-005**: Frontend shall be deployable to Vercel
- **NFR-POR-006**: Backend shall be deployable to AWS ECS/Fargate
- **NFR-POR-007**: Database shall be hosted on Supabase
- **NFR-POR-008**: System shall support environment-based configuration

---

## 11. Interoperability Requirements

### 11.1 API Standards
- **NFR-INT-001**: API shall follow RESTful conventions
- **NFR-INT-002**: API shall use JSON for data exchange
- **NFR-INT-003**: API shall use standard HTTP status codes
- **NFR-INT-004**: API shall be versioned (/api/v1)

### 11.2 External Integrations
- **NFR-INT-005**: System shall integrate with Supabase Auth
- **NFR-INT-006**: System shall integrate with Supabase PostgreSQL
- **NFR-INT-007**: System shall support Google OAuth
- **NFR-INT-008**: System shall use OpenAPI specification for API documentation

### 11.3 Data Formats
- **NFR-INT-009**: System shall use ISO 8601 for dates
- **NFR-INT-010**: System shall use UTC for timestamps
- **NFR-INT-011**: System shall use RFC 3339 for datetime

---

## 12. Testability Requirements

### 12.1 Testing Coverage
- **NFR-TST-001**: Unit test coverage: ≥ 70%
- **NFR-TST-002**: Integration test coverage: ≥ 50%
- **NFR-TST-003**: E2E test coverage: Critical user paths
- **NFR-TST-004**: Security test coverage: All authentication/authorization flows

### 12.2 Testing Tools
- **NFR-TST-005**: Frontend unit tests: Jest + React Testing Library
- **NFR-TST-006**: Backend unit tests: Jest
- **NFR-TST-007**: E2E tests: Playwright
- **NFR-TST-008**: API tests: Supertest

### 12.3 Test Automation
- **NFR-TST-009**: Tests shall run in CI/CD pipeline
- **NFR-TST-010**: Tests shall complete within 10 minutes
- **NFR-TST-011**: Tests shall be deterministic
- **NFR-TST-012**: Tests shall be isolated

---

## 13. Compliance Requirements

### 13.1 Data Privacy
- **NFR-CMP-001**: System shall comply with GDPR
- **NFR-CMP-002**: System shall provide data export functionality
- **NFR-CMP-003**: System shall provide data deletion functionality
- **NFR-CMP-004**: System shall obtain consent for data collection

### 13.2 Data Retention
- **NFR-CMP-005**: User data retention: 2 years after account deletion
- **NFR-CMP-006**: Typing session data retention: 1 year
- **NFR-CMP-007**: Analytics data retention: 2 years
- **NFR-CMP-008**: Audit log retention: 5 years

### 13.3 Age Requirements
- **NFR-CMP-009**: System shall require users to be 13+ years old
- **NFR-CMP-010**: System shall verify age during registration

---

## 14. Observability Requirements

### 14.1 Logging
- **NFR-OBS-001**: System shall implement structured logging (JSON)
- **NFR-OBS-002**: Logs shall include correlation IDs
- **NFR-OBS-003**: Logs shall include timestamp and severity
- **NFR-OBS-004**: Logs shall not include sensitive data (passwords, tokens)

### 14.2 Metrics
- **NFR-OBS-005**: System shall track request latency
- **NFR-OBS-006**: System shall track error rates
- **NFR-OBS-007**: System shall track active users
- **NFR-OBS-008**: System shall track database query performance

### 14.3 Monitoring
- **NFR-OBS-009**: System shall implement health checks (/health, /health/live, /health/ready)
- **NFR-OBS-010**: System shall monitor database connection pool
- **NFR-OBS-011**: System shall monitor WebSocket connections
- **NFR-OBS-012**: System shall alert on error rate > 5%

### 14.4 Tracing
- **NFR-OBS-013**: System shall implement distributed tracing
- **NFR-OBS-014**: System shall trace request lifecycle
- **NFR-OBS-015**: System shall trace database queries

---

## 15. Internationalization Requirements

### 15.1 Language Support
- **NFR-I18N-001**: System shall support English (en)
- **NFR-I18N-002**: System shall support French (fr)
- **NFR-I18N-003**: System shall support Kinyarwanda (rw)
- **NFR-I18N-004**: System shall use i18n library for translations

### 15.2 Localization
- **NFR-I18N-005**: System shall format dates according to locale
- **NFR-I18N-006**: System shall format numbers according to locale
- **NFR-I18N-007**: System shall support RTL languages (future)
- **NFR-I18N-008**: System shall not hardcode user-facing strings

---

## 16. Backup and Recovery Requirements

### 16.1 Backup Strategy
- **NFR-BKR-001**: Database backups: Daily automated
- **NFR-BKR-002**: Backup retention: 30 days
- **NFR-BKR-003**: Backups shall be stored in multiple regions
- **NFR-BKR-004**: Backup integrity shall be verified weekly

### 16.2 Disaster Recovery
- **NFR-BKR-005**: System shall have documented disaster recovery plan
- **NFR-BKR-006**: Disaster recovery plan shall be tested quarterly
- **NFR-BKR-007**: System shall support point-in-time recovery
- **NFR-BKR-008**: RTO for critical systems: 1 hour

---

## 17. Capacity Requirements

### 17.1 Storage
- **NFR-CAP-001**: Initial storage allocation: 100GB
- **NFR-CAP-002**: Storage growth projection: 10GB per month
- **NFR-CAP-003**: System shall support storage scaling
- **NFR-CAP-004**: System shall implement data archival for old data

### 17.2 Bandwidth
- **NFR-CAP-005**: Initial bandwidth allocation: 1TB/month
- **NFR-CAP-006**: System shall implement CDN for static assets
- **NFR-CAP-007**: System shall implement image optimization

---

## 18. Configuration Management

### 18.1 Environment Variables
- **NFR-CFG-001**: System shall use environment variables for configuration
- **NFR-CFG-002**: System shall provide .env.example file
- **NFR-CFG-003**: System shall validate required environment variables on startup
- **NFR-CFG-004**: System shall not commit .env files to version control

### 18.2 Feature Flags
- **NFR-CFG-005**: System shall support feature flags
- **NFR-CFG-006**: Feature flags shall be configurable without deployment
- **NFR-CFG-007**: System shall document all feature flags

---

## 19. Version Control Requirements

### 19.1 Git Workflow
- **NFR-VCS-001**: System shall use Git for version control
- **NFR-VCS-002**: System shall use feature branch workflow
- **NFR-VCS-003**: Pull requests shall require approval
- **NFR-VCS-004**: Pull requests shall pass CI/CD checks

### 19.2 Release Management
- **NFR-VCS-005**: System shall use semantic versioning
- **NFR-VCS-006**: System shall tag releases
- **NFR-VCS-007**: System shall maintain changelog

---

## 20. Cost Requirements

### 20.1 Cost Optimization
- **NFR-CST-001**: System shall implement auto-scaling to reduce costs
- **NFR-CST-002**: System shall use spot instances where appropriate
- **NFR-CST-003**: System shall implement resource cleanup
- **NFR-CST-004**: System shall monitor costs monthly

### 20.2 Budget Targets
- **NFR-CST-005**: Monthly infrastructure budget: $500 (initial)
- **NFR-CST-006**: Cost per active user target: <$0.50/month
- **NFR-CST-007**: System shall alert on budget exceeded

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-18 | Cascade | Initial NFRD based on Phase 1 specifications |
