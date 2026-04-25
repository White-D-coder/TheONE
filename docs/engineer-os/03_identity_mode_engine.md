# Engineer OS: Identity & Mode Engine

## Purpose
The Identity & Mode Engine defines the user's current professional priority. Instead of a static "Profile", it treats the user as a dynamic mix of roles.

## Role Definition
Each role has a weight (0-100). The sum of weights determines the "Routine Gravity".

### Example Roles:
- **Student**: Prioritizes academics, exams, and conceptual learning.
- **Engineer**: Prioritizes DSA, system design, and technical mastery.
- **Builder**: Prioritizes shipping products, deployment, and user feedback.
- **Founder**: Prioritizes sales, networking, and product-market fit.
- **Candidate**: Prioritizes interview prep, resume tailoring, and applications.

## Mode System
Modes are global overrides for the routine engine.
- **EXAM MODE**: High student weight, minimal project work, preserves core coding habit (20 mins).
- **SPRINT MODE**: High builder weight, 12-hour work blocks, minimal social.
- **MAINTENANCE MODE**: Low intensity, preserves mental health, "Minimum Viable Progress" only.
- **JOB SEARCH MODE**: High candidate weight, focuses on Opportunity Discovery and Speaking Practice.

## Logic Flow
1. User sets **Target Goal** (e.g., "Land a Google Internship").
2. Engine suggests **Role Weights** (e.g., Engineer: 60, Candidate: 30, Communicator: 10).
3. Routine Engine generates a **Weekly Plan** based on these weights.
4. AI Reviewer evaluates progress against these specific weights.
