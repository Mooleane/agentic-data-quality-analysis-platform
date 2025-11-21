# Agentic Data Quality Analysis Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-blue?style=flat&logo=react)](https://react.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat&logo=openai)](https://openai.com/api/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)

> Enterprise-grade AI-powered data quality analysis platform for automated dataset validation, issue detection, and intelligent recommendations using OpenAI integration.

## ��� Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

**Agentic Data Quality Analysis Platform** is a sophisticated Next.js application that provides comprehensive data quality analysis through automated statistical computation and AI-powered natural language insights. The platform enables business users and data analysts to upload datasets, identify quality issues, and receive actionable recommendations without requiring deep technical expertise.

### Problem Statement

Organizations struggle with:
- **Data Quality Blindness**: Lack of visibility into dataset quality before analysis
- **Manual Analysis**: Time-consuming manual data validation processes
- **Technical Complexity**: Existing solutions require advanced technical skills
- **Actionability Gap**: Quality metrics without context or recommendations

## Key Features

### Core Capabilities

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Multi-Format Upload** | CSV, JSON, Excel support with validation | Universal compatibility |
| **Real-time Analysis** | Client-side processing up to 50MB | Zero server latency |
| **AI Insights** | OpenAI GPT-4 powered natural language analysis | Business-friendly explanations |
| **Quality Scoring** | 0-100 scale across 4 dimensions | Standardized assessment |
| **Interactive Visualizations** | Radar charts, pie charts, data distributions | Visual comprehension |
| **Column Analysis** | Per-column statistics and issue detection | Granular diagnostics |
| **Trend Tracking** | Improvement/decline indicators | Progress monitoring |
| **Report Export** | Download quality reports as text files | Documentation & sharing |
| **Recent History** | Track last 10 analyses | Quick access |
| **Copy to Clipboard** | One-click insight copying | Workflow efficiency |

## Technical Architecture

### Technology Stack

```
Frontend Layer
├── React 19 + Next.js 14 (App Router)
├── JavaScript ES6+ (No TypeScript)
├── CSS3 Custom Properties + Grid/Flexbox
└── Chart.js + react-chartjs-2

Data Processing
├── Papa Parse (CSV/JSON parsing)
├── Client-side only processing
└── sessionStorage + localStorage

AI Integration
├── OpenAI API (GPT-4o-mini)
├── Server-side API routes
└── Real-time insight generation

Quality Assurance
├── Vitest (testing framework)
├── React Testing Library
└── ESLint (code quality)
```

## Prerequisites

- **Node.js**: 18.17.0 or higher
- **npm**: 9.0+ or **pnpm**: 8.0+
- **OpenAI API Key**: Required for AI features

## Installation

```bash
git clone https://github.com/Mooleane/agentic-data-quality-analysis-platform.git
cd agentic-data-quality-analysis-platform
npm install
```

## Configuration

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

## Usage

### Development

```bash
npm run dev
```

Navigate to `http://localhost:3000`

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm test -- --coverage
```

## Performance

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | ≥85 | 90+ |
| Lighthouse Accessibility | ≥90 | 95+ |
| First Contentful Paint | <1.5s | ~0.8s |
| Bundle Size | <500KB | ~320KB |

## Accessibility

✅ WCAG 2.1 Level AA Compliance
- Full keyboard navigation
- Screen reader support
- Color contrast ≥ 4.5:1
- Responsive design

## Project Structure

```
src/
├── app/
│   ├── layout.js
│   ├── page.jsx
│   ├── analysis/page.jsx
│   └── api/
│       ├── generateInsights/route.js
│       └── generateRecommendations/route.js
├── components/
│   ├── FileUpload.jsx
│   ├── ErrorBoundary.jsx
│   └── data/
│       ├── DataPreview.jsx
│       ├── QualityScore.jsx
│       ├── AIInsights.jsx
│       ├── DataVisualizations.jsx
│       └── ColumnDetails.jsx
├── lib/
│   ├── dataAnalysis.js
│   └── aiIntegration.js
└── styles/
    ├── globals.css
    ├── FileUpload.css
    ├── HomePage.css
    ├── AnalysisPage.css
    └── [component styles]
```

## Development

### Code Standards

```javascript
// Components: PascalCase
export default function DataPreview() { }

// Functions: camelCase
function analyzeDataQuality() { }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// CSS Classes: kebab-case
.quality-score-display { }
```

### Git Workflow

```bash
git checkout -b feature/your-feature
git commit -m "feat: description"
git push origin feature/your-feature
```

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Docker

```bash
docker build -t data-quality-platform .
docker run -p 3000:3000 data-quality-platform
```

### Traditional Server

```bash
npm run build
npm start
```

## API Documentation

### POST `/api/generateInsights`

Generates natural language insights about data quality.

**Request:**
```javascript
{
  "fileName": "customers.csv",
  "rowCount": 1000,
  "metrics": { completeness, consistency, accuracy, validity },
  "columnAnalysis": { ... }
}
```

**Response:**
```javascript
{
  "insights": "Your dataset has an overall quality score of 85/100..."
}
```

### POST `/api/generateRecommendations`

Generates actionable recommendations for data improvement.

**Response:**
```javascript
{
  "recommendations": [
    {
      "priority": "high",
      "action": "Address missing values in email column",
      "benefit": "Improve data completeness"
    }
  ]
}
```

## FAQ

**Q: What's the maximum file size?**
A: 50MB is the hard limit. Files larger than 10MB may take 5-10 seconds to process.

**Q: Is the OpenAI API key secure?**
A: Yes. API calls are made server-side through Next.js API routes. The key never reaches the browser.

**Q: Can I deploy this to my own server?**
A: Yes. Ensure Node.js 18+ is available.

## Security

- ✅ Client-side processing (no server storage)
- ✅ No database required
- ✅ Session-based temporary storage
- ✅ Environment variables for secrets

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- AI powered by [OpenAI](https://openai.com/)
- Charts by [Chart.js](https://www.chartjs.org/)
- CSV parsing by [Papa Parse](https://www.papaparse.com/)

---
