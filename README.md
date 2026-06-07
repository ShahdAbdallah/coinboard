CoinBoard

A cryptocurrency dashboard built with React, TypeScript, Material UI, Recharts, and the CoinGecko API.

Run Locally

npm install
npm run dev

API & Caching

This project uses the CoinGecko Public API.

To reduce API requests and avoid rate limits, localStorage caching with TTL is implemented:

* Global data: 5 minutes
* Markets list: 3 minutes
* Coin detail: 3 minutes
* Price chart: 10 minutes

Agentic Workflow

Tools used: ChatGPT

What I delegated: Implementation guidance, React/MUI assistance, API integration support, generating code examples, and helping break larger tasks into smaller subtasks.

What I overrode / corrected: Dashboard layout adjustments, spacing and sizing fixes, routing behavior, responsiveness improvements, and UI refinements to better match the provided design and requirements.

What I kept manual: Project organization, testing, validation, final implementation decisions, and integrating all parts of the project into the final solution.

Since this was my first React/frontend project, I used ChatGPT as a learning and coding assistant. It was the easiest way for me to understand the framework, learn the implementation process, and work through the project step by step while gradually refining the final result.

What I Would Do Differently With More Time

* Add unit tests for custom hooks
* Implement request cancellation for stale requests
* Improve Portfolio functionality
* Further refine UI details and polish