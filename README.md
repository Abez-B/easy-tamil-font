# Ezhuthurukal

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A minimal, community-driven Tamil font showcase and indexing platform. Browse, preview, and download Tamil fonts with ease.

## 🎯 Purpose

ezhuthurukal is designed to:
- **Discover** Tamil fonts in one centralized location
- **Preview** fonts with live text rendering
- **Download** fonts for educational and research use
- **Contribute** to a community-driven font library

## 🚀 Features

- **Font Gallery**: Browse Tamil fonts in a clean, minimal interface
- **Live Preview**: Type custom text to preview fonts in real-time
- **Font Metadata**: View author, license, source, and variant information
- **Search & Filter**: Find fonts by name, category, or tags
- **Copy Rendered Text**: Copy text displayed in selected fonts
- **Community Contributions**: Easy GitHub PR workflow for adding fonts

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ezhuthurukal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and go to: `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🌐 Deployment to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Add deploy scripts to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages"
   - Select the `gh-pages` branch
   - Your site will be available at `https://<username>.github.io/ezhuthurukal`

## 📁 Project Structure

```
ezhuthurukal/
├── public/
│   ├── fonts/              # Font files (.ttf, .otf)
│   │   ├── tau-barathi/
│   │   ├── tau-kabilar/
│   │   └── ...
│   └── meta/
│       └── fonts.json      # Font metadata
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── FontCard.jsx
│   │   ├── FontPreview.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── FontDetail.jsx
│   │   ├── License.jsx
│   │   └── ...
│   ├── data/
│   │   └── fonts.json      # Font data
│   ├── utils/              # Utility functions
│   ├── App.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to add new fonts.

### Quick Contribution Guide

1. Fork the repository
2. Add font files to `public/fonts/font-name/`
3. Update `public/meta/fonts.json` with font metadata
4. Submit a pull request

## 📄 Font License

All fonts on this site are **exclusively for educational and research purposes**.

- **Source**: Tamil Virtual Academy
- **License**: Free for educational and research use
- **Commercial Use**: Contact font creators directly

See [FONTS_LICENSE.md](FONTS_LICENSE.md) for full details.

## 🎨 Design

- **Style**: Minimal monochrome design
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📞 Contact

- **Tamil Virtual Academy**: [tamilvu@yahoo.com](mailto:tamilvu@yahoo.com)
- **Project Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- **Font Source**: Tamil Virtual Academy (Government of Tamil Nadu)
- **Framework**: React, Vite, Tailwind CSS
- **Icons**: Lucide React

## 📜 Licensing

This repository uses a **Dual-License** model:

1. **Source Code (MIT License):** The web application code, UI components, and logic are open source under the [MIT License](LICENSE).
2. **Font Files (Educational Use):** The Tamil fonts hosted in the `public/fonts/` directory are provided by the Tamil Virtual Academy and are strictly for educational and research purposes. See [FONTS_LICENSE.md](FONTS_LICENSE.md) for detailed font usage guidelines.

---

Built with ❤️ for the Tamil community
