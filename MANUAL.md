# 📘 Kinetix Roadmap User Manual & Feature Guide

Welcome to the **Kinetix Roadmap** User Manual! This guide provides comprehensive, step-by-step instructions on how to use every feature in Kinetix Roadmap, complete with visual screenshot references and workflow tips.

---

## 🚀 Featured Project: KeepNote Ecosystem

This deployment is pre-loaded with **KeepNote Ecosystem** (a Google Keep alternative note-taking platform).

### Team Structure:
- **Anurag** — Engineering Manager & Product Lead
- **Jitendra** — Senior Python Developer (FastAPI Architecture & Database Schema)
- **Nitin** — Python Developer (Push Notifications & Scheduled Reminders)
- **Ram** — Senior Frontend Developer (React Web Dashboard & TipTap Editor)
- **Akshay** — Frontend Developer (React Native iOS & Android App)
- **Dinesh** — Lead QA Engineer (PyTest, Cypress E2E & Load Testing)
- **Shyam** — DevOps Engineer (Docker, AWS ECS Infrastructure & CI/CD)

---

## 📑 Table of Contents
1. [Getting Started](#1-getting-started)
2. [Roadmap & Interactive Gantt Timeline](#2-roadmap--interactive-gantt-timeline)
3. [2x2 Priority Matrix & Kinetix RICE Scorecard](#3-2x2-priority-matrix--kinetix-rice-scorecard)
4. [Drag-and-Drop Kanban Board](#4-drag-and-drop-kanban-board)
5. [Dependency Graph Visualizer](#5-dependency-graph-visualizer)
6. [Strategic Goals Hub](#6-strategic-goals-hub)
7. [Ideas Portal & 1-Click Promotion](#7-ideas-portal--1-click-promotion)
8. [Resource Workload & Capacity Planning](#8-resource-workload--capacity-planning)
9. [Guided Interactive Onboarding Tour](#9-guided-interactive-onboarding-tour)
10. [Data Backup, Export & Import](#10-data-backup-export--import)

---

## 1. Getting Started

When you launch Kinetix Roadmap (`npm run dev` at `http://localhost:5173`), you are greeted with the main application header featuring:
- **Navigation Tabs**: Switch between Roadmap, Priority Matrix, Dependency Graph, Goals Hub, Ideas Portal, Workload, and Kanban Board.
- **Data Action Buttons**: Export JSON, Export CSV, and Import Data.
- **Help & Tour Button**: Launches the interactive step-by-step guided onboarding tour.

![Kinetix Roadmap Overview](./docs/images/gantt_roadmap.png)

---

## 2. Roadmap & Interactive Gantt Timeline

The **Kinetix Roadmap & Gantt** module is the core execution engine. It displays 8 core engineering milestones for the KeepNote project with **~60% overall progress completed**.

![Kinetix Gantt Roadmap Screen](./docs/images/gantt_roadmap.png)

### Core Interactions:

#### A. Drag-and-Drop Milestone Rescheduling
1. Click and hold any milestone box (*e.g., FastAPI Backend Architecture, React Native Mobile App*) in the Gantt chart.
2. Drag left or right to shift the start and due dates visually.
3. Release the mouse button — dates update automatically, and connected dependency arrows re-route in real-time.

#### B. Connecting Milestone Dependencies via Drag-and-Drop
1. Hover over any milestone box to reveal the **connection handles** on the right edge.
2. Click and drag a line from the handle of a prerequisite milestone (*e.g. FastAPI Backend*) to a target milestone (*e.g. React Native Mobile App*).
3. Release the line over the target milestone to establish a new dependency connection.

#### C. Filtering & Detail Drawer
- Use the **Filter Controls** at the top to filter by Goal, Status (*Completed, In Progress, Under Review, Not Started*), or Health.
- Click any milestone box to open the **Slide-Over Detail Drawer** to edit owner assignments (Jitendra, Ram, Nitin, Akshay, Dinesh, Shyam), impact scores, and sub-features.

---

## 3. 2x2 Priority Matrix & Kinetix RICE Scorecard

Prioritize features objectively using 2x2 Effort vs Impact quadrants and the RICE scorecard.

![Priority Matrix Screen](./docs/images/priority_matrix.png)

### A. 2x2 Effort vs. Impact Matrix
- **⚡ Quick Wins (High Impact, Low Effort)**: FastAPI Async REST endpoints, Docker Containerization.
- **🎯 Major Projects (High Impact, High Effort)**: React Native Mobile App, WebSockets Live Co-editing.
- **🌱 Fill-ins (Low Impact, Low Effort)**: Scheduled cron workers.
- **⚠️ Thankless Tasks (Low Impact, High Effort)**: Legacy data migrators.

### B. Kinetix RICE Prioritization Scorecard
View stacked feature rankings calculated automatically:

$$\text{RICE Score} = \frac{\text{Reach} \times \text{Impact} \times \text{Confidence}}{\text{Effort}}$$

![Kinetix RICE Scorecard](./docs/images/rice_scorecard.png)

---

## 4. Drag-and-Drop Kanban Board

Track daily task execution across KeepNote milestones with assigned team members.

![Kinetix Kanban Board Screen](./docs/images/kanban_board.png)

### How to Move Tasks:
1. Click and hold any task card in **Not Started**, **In Progress**, **Under Review**, or **Completed**.
2. Drag the card into a new column.
3. Cards dropped into **Completed** update progress to 100% automatically.

---

## 5. Dependency Graph Visualizer

Understand cross-team dependencies and critical paths between Python backend, mobile app, QA testing, and DevOps milestones.

![Kinetix Dependency Graph](./docs/images/dependency_graph.png)

---

## 6. Strategic Goals Hub

Track progress against KeepNote core objectives:
1. **Core Engine & Real-Time Sync Infrastructure** (80% Progress)
2. **Cross-Platform Mobile App (iOS & Android)** (55% Progress)
3. **Real-Time Push Notification & Reminder Engine** (100% Progress)
4. **Multi-Platform Workspace Note Sharing** (40% Progress)

![Kinetix Strategy Hub](./docs/images/strategy_hub.png)

---

## 7. Ideas Portal & 1-Click Promotion

Gather feature requests for KeepNote:
- **Whisper AI Voice Note Auto-Transcription** (185 Upvotes — *Promoted*)
- **End-to-End Encrypted Private Vault Notes** (142 Upvotes — *Approved*)
- **Location-Based Geo-Fenced Push Reminders** (98 Upvotes — *Under Review*)

![Kinetix Ideas Portal](./docs/images/ideas_portal.png)

---

## 8. Resource Workload & Capacity Planning

Monitor assigned capacity for **Anurag**, **Jitendra**, **Nitin**, **Ram**, **Akshay**, **Dinesh**, and **Shyam**.

![Resource Workload](./docs/images/workload.png)

---

## 9. Guided Interactive Onboarding Tour

Click **Help & Tour** in the top navigation bar to launch the spotlight tour with high-contrast unblurred target frames.

---

## 10. Data Backup, Export & Import

- **Export CSV**: Downloads `kinetix_milestones.csv`
- **Export JSON**: Downloads `kinetix_roadmap_export.json`
- **Import Data**: Upload JSON backup file to restore workspace state.

---

*Thank you for using **Kinetix Roadmap**! For updates and contributions, visit [github.com/anubioinfo/kinetix](https://github.com/anubioinfo/kinetix).*
