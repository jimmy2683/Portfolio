# 🚀 Space-Themed Portfolio with Interactive Astronaut Navigator

This portfolio website features a unique interactive astronaut that serves as an intuitive navigation system for your portfolio.

## 🌟 Features

- **Interactive Astronaut Navigator**: Click/tap the holographic markers around the astronaut to navigate between sections
- **3D Space Effects**: Immersive starfield background with shooting stars and nebula effects
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Dark/Light Mode**: Toggle between space and light themes
- **Project Showcases**: Interactive 3D cards for your projects with detailed modals
- **Optimized Performance**: Careful optimizations to ensure smooth animations even on mobile devices

## 📁 Required Project Images

For the portfolio to display your projects correctly, you need to add the following images to your `/public` folder:

1. `/public/vr-visit.jpg` - VR-VISIT project image
2. `/public/skibbrizz.jpg` - Skibbrizz social media app image
3. `/public/ainexus.jpg` - AINexus AI recommendation engine image
4. `/public/smart-traffic.jpg` - Smart Traffic app image
5. `/public/job-portal.jpg` - Job Portal System image
6. `/public/ddr-simulator.jpg` - DDR Simulator UI image
7. `/public/profile.jpg` - Your profile picture

### 🖼️ Image Fallbacks

Don't worry if you don't have all images ready! The site includes intelligent fallbacks that will generate color gradients with the project's first letter if an image is missing.

### 📏 Recommended Image Dimensions

- Project images: 800×600px or 1200×800px (16:9 ratio)
- Profile image: 500×500px (square/rounded)

## 🛠️ Development

This project is built with:
- Next.js
- Three.js for 3D effects
- TailwindCSS for styling

## 🚀 Getting Started

1. Make sure you have Node.js installed
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:3000 in your browser

## 📱 Mobile Optimization

The site automatically detects mobile devices and:
- Simplifies the 3D effects to maintain performance
- Adjusts the astronaut navigator for better mobile interaction
- Provides a mobile menu for navigation
