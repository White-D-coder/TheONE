# Engineer OS: Skill Progress Engine

## Purpose
To map the user's technical and soft skill growth over time using evidence-based scoring rather than intuition.

## Skill Model
Each skill (e.g., "React", "System Design", "Technical Writing") has:
- **Base Score (0-100)**: Derived from complexity and volume of evidence.
- **Confidence Level**: How recently have you used this?
- **Consistency**: Frequency of practice.
- **External Validation**: Have others approved this? (PR merges, certifications).

## Categories
1. **Technical Core**: DSA, Architecture, OS, DB.
2. **Languages/Stacks**: JS/TS, Rust, Go, Python.
3. **Advanced**: AI, Cloud, Performance.
4. **Soft Skills**: Public Speaking, Technical Explanation, Negotiation.

## Logic: Skill Decay
If a skill isn't touched for 30 days, its "Confidence Score" begins to drop (2% per week). This triggers a "Refresher Drill" in the Routine Engine.

## AI Coach Insight
The Engine provides automated feedback:
- "You are over-indexing on Python but haven't touched System Design in 2 weeks."
- "Your 'React' score is high, but you lack 'Testing' evidence."
- "Next Best Action: Implement a Unit Test suite for Project X."
