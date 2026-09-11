# SkillSwap

**A platform for proving skills through real-world challenges.**

## Problem

AI is disproportionately squeezing entry-level tech talent out of the job market:

- A Federal Reserve Bank of St. Louis study found AI increased youth unemployment by **1.68 percentage points** — nearly a third of the total rise in youth unemployment since generative AI emerged.
- A Stanford University / ADP study found a **13–16% relative employment decline** for early-career workers (ages 22–25) in AI-exposed occupations such as software development.
- An IDC survey found **66% of enterprises are scaling back entry-level hiring** as senior staff increasingly use AI for tasks once assigned to juniors.

As a result, many talented students and new graduates struggle to prove they're job-ready, despite having the skills.

## Solution

SkillSwap replaces self-reported resumes with **verified skill profiles**, built through real-world challenges and expert evaluation — giving employers a faster, more reliable signal than a CV.

## How it works — three sides

| Role | What they can do |
|---|---|
| **Learner / Candidate** | Browse challenges, submit real solutions, build a verified skill profile to share with employers |
| **Mentor** | Create and review challenges, evaluate candidate submissions, verify results or request revisions |
| **Company** | Post internships and job openings, browse candidates by verified skill, hire faster with proof of real work |


## Architecture

The backend follows **Onion Architecture** in C#/.NET, separating concerns into distinct layers:

```
SkillSwap.Domain          # Core entities & business rules
SkillSwap.Application     # Use cases / application logic
SkillSwap.Infrastructure  # Data access, external services
backend/                  # API host
frontend/                 # Client application
```

Containerized with Docker for consistent local development and deployment.

## Tech Stack

- **Backend:** C#, .NET, Onion Architecture
- **Deployment:** Docker, Railway
- **Team:** 2 developers (Seljan Khasiyeva — platform/full-stack engineering; Zarifa Musayeva — evaluation & scoring logic)

## Team

- **Seljan Khasiyeva** — Data & AI student. Built the platform's backend and frontend end-to-end, from the candidate/mentor/company dashboards to the challenge submission flow.
- **Zarifa Musayeva** — Data & AI student. Contributed to platform development, focused on the evaluation/scoring logic behind the skill-verification approach.
