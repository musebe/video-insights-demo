

# Stop Guessing, Start Growing: Cloudinary Video Analytics Demo

You can't grow a following if you don't know what keeps them watching. Stop flying blind. This project demonstrates how to use **Cloudinary Video Analytics** and **Next.js 16** to build a lightweight, professional dashboard that reveals exactly when viewers drop off, giving creators the insights to turn casual clicks into superfans.

## ✨ Features

* **Real-Time Engagement Tracking**: Uses the `cloudinary-video-analytics` library to track HTML5 video heartbeats.
* **Custom Metadata Tags**: Implements `customData` fields to categorize content and filter insights by series or title.
* **Programmatic Analytics API**: Securely fetches view data including watch time, device info, and geographic location via the Cloudinary Video Analytics API.
* **Creator Insights Dashboard**: Visualizes data using Recharts to show viewer retention and average watch rates.
* **Automated Growth Tips**: Logic-based recommendations that suggest content improvements based on viewer drop-off patterns.

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router)
* **Video Analytics**: [Cloudinary Video Analytics JS Library](https://www.npmjs.com/package/cloudinary-video-analytics)
* **Styling**: Tailwind CSS + shadcn/ui
* **Charts**: Recharts
* **Icons**: Lucide React

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have a Cloudinary account. You will need your **Cloud Name**, **API Key**, and **API Secret** from the [Cloudinary Console](https://console.cloudinary.com/console).

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

```

### 3. Installation

```bash
# Install dependencies
npm install

# Install Cloudinary Analytics Library
npm i cloudinary-video-analytics

# Add shadcn components
npx shadcn@latest add button card table progress badge

```

### 4. Running the Project

```bash
npm run dev

```

## 📈 How it Works

### Data Collection

The `VideoTracker` component connects to the HTML5 `<video>` tag. When a user plays the video, the library automatically collects metrics like **Plays**, **Unique Viewers**, and **Watch Time**.

### Manual Tracking & Custom Fields

We use `startManualTracking` to associate specific metadata with each view:

```javascript
cloudinaryAnalytics.startManualTracking({
  cloudName: 'demo-article-projects',
  publicId: 'your_video_id',
  customData: {
    customData1: "Stop-Guessing-Series",
    customData2: "Episode-01"
  }
});

```

### Data Retrieval

The dashboard calls a Next.js API route that authenticates using **Basic Authentication** (Base64 encoded API Key and Secret) to retrieve data from:
`https://api.cloudinary.com/v1_1/<cloud_name>/video/analytics/views`

## 📝 Analytics Metrics Explained

* **Watch Rate**: Percentage of total time videos have been watched in relation to total duration.
* **Play Rate**: Percentage of plays in relation to player loads; highlights discoverability issues.
* **Top Devices/OS**: Insights into user demographics to optimize video formats and sizes.
