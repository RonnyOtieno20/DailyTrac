# DailyTrac - Your Personal Habit & Lifestyle Companion

DailyTrac is a comprehensive, AI-enhanced daily logging application designed to help you track your habits, monitor your lifestyle, and gain valuable insights into your daily routines. Built with a modern tech stack, it provides a seamless and intuitive interface for managing your personal data.

![DailyTrac Dashboard](https://placehold.co/800x450.png?text=DailyTrac+App+Screenshot)
*<p align="center">A placeholder image showing the main dashboard.</p>*

## Key Features

- **Comprehensive Daily Log:** Log everything from your sleep schedule and exercise details to your nutrition, study sessions, mood, and energy levels on a dedicated daily view.
- **Interactive Calendar:** Easily navigate to any date to view or add logs.
- **Activity Heatmap:** A GitHub-style activity grid that visually represents your daily task completion, helping you track consistency at a glance.
- **AI-Powered Summaries:** Leverage the power of AI to generate concise summaries of your daily, weekly, and monthly progress. These summaries help identify trends, celebrate achievements, and pinpoint areas for improvement.
- **Key Statistics:** Go beyond qualitative summaries with hard numbers. Track key metrics for sleep, exercise, hydration, and nutrition over weekly and monthly periods.
- **Focused Habit Tracking:** A dedicated page to review your exercise history in detail.
- **Responsive & Modern UI:** A clean, collapsible sidebar and a responsive layout ensure a great experience on any device.
- **Light & Dark Mode:** Switch between themes to suit your preference.

## Technology Stack

This project is built with a modern, robust, and scalable technology stack:

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Storage:** Local Storage (for simplicity and client-side persistence)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/).
    ```
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

### Running the Application

1.  **Start the Genkit AI flows:**
    Open a terminal and run the Genkit development server. This must be running for the AI summary features to work.
    ```sh
    npm run genkit:watch
    ```

2.  **Start the Next.js development server:**
    In a second terminal, run the Next.js app.
    ```sh
    npm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
