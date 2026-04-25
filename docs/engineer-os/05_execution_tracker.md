# Engineer OS: Daily Execution Tracker

## Purpose
A high-fidelity logging system that captures what *actually* happened, as opposed to what was planned.

## What is Tracked?
- **Work Blocks**: Start time, end time, and Focus Score (1-10).
- **Deep Work**: Total uninterrupted minutes.
- **Technical Metrics**:
  - GitHub Commits (fetched via API or logged).
  - LeetCode/Codeforces solves.
- **Distraction Incidents**: Manual or automated logs of "Drift" (scrolling, random YT).
- **Evidence Created**: Any link, file, or screenshot generated during the day.

## Focus Mode UI
When a user starts a block, the OS enters **Focus Mode**:
- Fullscreen countdown.
- Essential tasks only.
- "Distraction Button": A quick way to log if they get sidetracked without breaking the timer.

## End-of-Day Ritual
The tracker prompts for a "Daily Recap":
1. "What was the biggest win?"
2. "What was the biggest leak?"
3. "What is the priority for tomorrow?"
4. (AI) "Score this day: A, B, C, or F."
