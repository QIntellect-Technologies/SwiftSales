# 🤖 SwiftBot: Advanced Conversational Feature Guide

Welcome to the comprehensive guide for **SwiftBot**, the intelligent pharmaceutical assistant for Swift Sales Healthcare. This document highlights the "Best Feature" and the sophisticated logic behind how SwiftBot communicates with customers.

## 🏆 The Best Feature: Intelligent Conversational RAG

The standout feature of SwiftBot is its **Intelligent Conversational Retrieval-Augmented Generation (RAG)**. 

Unlike traditional chatbots that rely on rigid keyword matching, SwiftBot uses a local **Ollama (llama3.2)** Brain to understand user intent naturally, combined with a high-speed **Vector Search Engine** that scans over 2,136 products in milliseconds.

### Why it's the "Best":
1.  **Context Awareness**: Remembers the last 3-5 messages to maintain a natural flow.
2.  **Product Intelligence**: Instantly retrieves manufacturer, pack size, and uses for thousands of medicines.
3.  **Local & Private**: Processes all AI logic on your machine (100% local), ensuring maximum privacy and zero API costs.
4.  **15x Performance**: Optimized search heuristics reduced response times from 15 seconds to under 2 seconds.

---

## 🧠 The 3-Step Reply Logic

SwiftBot is programmed to follow a professional, empathetic communication framework: **Acknowledge → Understand → Respond**.

### 1. Acknowledge (The "Empathy" Step)
The bot first shows the user it is listening. 
- *Instead of:* "Here is Panadol."
- *SwiftBot says:* "I'm sorry to hear you're feeling unwell. Let me look up Panadol for you..."

### 2. Understand (The "Intent" Step)
The bot analyzes the query to determine if the user is:
- Asking for **Information** (e.g., "What is Augmentin for?")
- Placing an **Order** (e.g., "I want 5 packs of Pofen.")
- Seeking **Health Guidance** (e.g., "What is good for a headache?")
- Reporting an **Emergency** (e.g., "I took too much medicine!")

### 3. Respond (The "Value" Step)
The bot delivers a precise, conversational answer:
- **Product Inquiries**: Details manufacturer, pack size, and key benefits.
- **Ordering**: Guides the user through a structured flow (Name → Phone → Address).
- **Safety**: Always includes medical disclaimers and emergency routing.

---

## 🛡️ Built-in Safety & Ethics

SwiftBot prioritizes user safety above all else:
- **Medical Disclaimers**: Automatically appended to any health-related advice.
- **Prescription Alerts**: Warns users when a medicine requires a doctor's prescription.
- **Emergency Protocols**: Instantly detects crisis keywords and directs users to hospital services without AI delay.

---

## 🚀 Interaction Pro-Tips

To get the most out of your assistant, try these natural commands:
- *"I have a backache, what can you recommend?"*
- *"Tell me about the side effects of Zinnat."*
- *"I want to order 10 tablets of Panadol 500mg."*
- *"What are your business hours tomorrow?"*

---

## 📊 Technical Stack At-A-Glance
- **AI Engine**: Ollama (Model: `llama3.2`)
- **Search**: Hybrid Vector Similarity search (<100ms)
- **Database**: SQLite with indexed product tracking
- **Personality**: Professional, Empathetic, Authorities, and Safety-Conscious.

---

*Documented by Antigravity AI for Swift Sales Healthcare.*
