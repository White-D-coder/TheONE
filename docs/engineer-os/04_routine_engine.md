# Engineer OS: Dynamic Routine Engine

## Purpose
The Routine Engine translates Role Weights and Modes into a concrete calendar of blocks. It ensures that the most important work gets the best time slots.

## Non-Negotiables (The Baseline)
Regardless of the mode, these habits must persist to prevent "Zero Days":
1. **Sleep Baseline**: Minimum 7 hours.
2. **Deep Work**: Minimum 90 minutes.
3. **Core Learning**: 30 minutes of intentional study.
4. **Output Baseline**: At least one public or private commit/log.

## Routine Generation Logic
### 1. The Power Block
The first 3-4 hours of the day are dedicated to the highest-weight role.
- If **Engineer**: DSA/System Design.
- If **Builder**: Feature implementation.

### 2. Adaptive Buffers
The engine leaves 20% of the day as "Flex Time" for unplanned events (college meetings, bugs, etc.).

### 3. Fallback Routines
When the user reports "High Stress" or "Low Energy", the engine switches to a Fallback Plan:
- 20 min Coding
- 10 min Reading
- 10 min Planning
- Total: 40 mins (Saves the streak, prevents collapse).

## UI Features
- **Block Visualizer**: A sleek, vertical timeline showing the day's commitments.
- **Mode Toggle**: Quickly switch between Normal, Sprint, and Exam modes.
- **Progress Ring**: Real-time visual of block completion.
