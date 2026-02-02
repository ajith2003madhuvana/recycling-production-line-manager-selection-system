Recycling Production Line Manager Selection System

A production-quality technical demo showcasing a structured, data-driven system for evaluating and ranking candidates for a Recycling Production Line Manager role.

Development Notes

This project was developed using AI-assisted tooling (Lovable) to accelerate initial scaffolding and UI iteration, enabling more focused time investment on system design, data modeling, and evaluation logic.

All core aspects of the project — including the database schema, AI evaluation prompts, ranking logic, and dashboard behavior — were manually reviewed, refined, and validated to ensure full alignment with the assignment requirements and clear technical ownership.

🎯 Project Overview

The system simulates a real-world hiring workflow for operational leadership roles in the recycling domain. It provides a transparent and explainable approach to candidate evaluation using structured scoring and visual insights.

Key Features

AI-based candidate evaluation (mocked for demonstration)

Top 10 leaderboard with sortable rankings

Skill heatmap for comparative score analysis

Detailed candidate profiles with score breakdowns

🛠 Tech Stack
Layer	Technology
Frontend	React 18 + Vite
UI Framework	Mantine
Icons	Tabler Icons
Data Generation	Faker.js
Database Design	MySQL-compatible SQL
Language	TypeScript
📁 Folder Structure
├── docs/
│   └── AI_EVALUATION_PROMPTS.md     # AI prompt templates with scoring rubrics
├── sql/
│   ├── 001_schema.sql               # Tables, triggers, views, procedures
│   └── 002_sample_queries.sql       # Sample analytical queries
├── src/
│   ├── components/
│   │   ├── Leaderboard.tsx          # Top 10 sortable leaderboard
│   │   ├── CandidateCard.tsx        # Candidate profile cards
│   │   └── SkillHeatmap.tsx         # Visual skill comparison
│   ├── data/
│   │   └── generateCandidates.ts    # Faker.js candidate generator
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript interfaces
│   └── App.tsx                      # Main application entry
└── README.md

🚀 How to Run
Prerequisites

Node.js 18+

npm (or compatible package manager)

Setup
npm install
npm run dev


The application runs locally at:

http://localhost:5173

Production Build
npm run build

📊 Data Generation
Candidate Generation (Faker.js)

The system generates 40 realistic candidate profiles, including:

Experience: 2–15 years

Skills: 4–8 per candidate, covering:

Operations (Lean Manufacturing, Safety)

Sustainability (ISO 14001, Environmental Compliance)

Leadership (Team Management, Mentoring)

Background summaries: Template-based, role-relevant narratives

This approach ensures consistency while maintaining realism.

🤖 Mock AI Evaluation Logic

AI evaluations are deterministic and explainable, based on:

Experience factor (scaled from years of experience)

Skill relevance matching

Minor controlled variance for realism

Example logic:

score = 4 + (experience_factor * 3) + skill_matches


Each candidate receives scores for:

Crisis Management

Sustainability Knowledge

Team Motivation

📈 Ranking System
Score Formula
total_score = crisis_management + sustainability + team_motivation


Each category scored from 1–10

Maximum possible score: 30

Ranking Rules

Sort by total_score (descending)

Tie-break using candidate_id (ascending)

Assign sequential ranks (Rank 1 = highest score)

Database Automation

The MySQL schema includes:

Triggers to auto-update rankings on evaluation changes

Stored procedure for rank recalculation

View for combined leaderboard access

🗄 Database Schema Overview
Tables
Table	Description
candidates	Candidate profile data
evaluations	AI-generated evaluation scores
rankings	Computed total scores and ranks
Design Highlights

Foreign key constraints with cascade deletes

Score validation using CHECK constraints

Indexed columns for efficient leaderboard queries

View for simplified dashboard consumption

🤖 AI Evaluation Prompts

Three structured prompts are used:

Crisis Management

Sustainability Knowledge

Team Motivation

Each prompt includes:

Clear evaluation criteria

Detailed 1–10 scoring rubric

Structured JSON output format

Full prompt definitions are available in:

docs/AI_EVALUATION_PROMPTS.md

🎨 UI Components
Leaderboard

Sortable columns

Visual rank indicators (🥇🥈🥉)

Color-coded score badges

Candidate Cards

Profile overview

Skill badges

Score visualizations

Contact metadata (demo)

Skill Heatmap

Gradient-based score visualization

Comparative insights across candidates

Hover-based detail exploration

📄 License

MIT License — created for demonstration and evaluation purposes
