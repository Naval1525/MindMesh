# 🧠 MindMesh - Advanced Mind Mapping & Architecture Diagram Tool

A powerful, AI-enhanced mind mapping and architecture diagram tool built with React, TypeScript, and React Flow. Create beautiful visual networks, collaborate with AI insights, and design professional diagrams.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Mind Mapping** - Create, connect, and organize your thoughts visually
- **Multiple Node Types** - Notes, Tasks, Goals, Ideas, Routines, and more
- **Real-time Collaboration** - AI-powered analysis and insights
- **Architecture Diagrams** - Professional shapes for system design
- **Undo/Redo** - Full history management with keyboard shortcuts
- **Search & Filter** - Find nodes quickly across your workspace

### 🤖 AI Integration
- **Smart Analysis** - Select nodes and get AI-powered insights
- **Gemini Flash Model** - Powered by Google's latest AI
- **Relationship Discovery** - AI identifies connections between concepts
- **Content Summarization** - Automatic analysis of selected content

### 🎨 Visual Design
- **Dark/Light Themes** - Beautiful, modern interface
- **Custom Styling** - Color-coded nodes and themes
- **Responsive Design** - Works on desktop and tablet
- **Smooth Animations** - Framer Motion powered interactions

### 📊 Architecture Mode
- **Professional Shapes** - Rectangles, circles, diamonds, servers, databases, clouds
- **Connector Styles** - Multiple arrow and line styles
- **Export Options** - PNG and SVG export capabilities
- **Layout Helpers** - Auto-arrangement and alignment tools

### ⌨️ Keyboard Shortcuts
- `Cmd/Ctrl + N` - Add new node
- `Cmd/Ctrl + F` - Search nodes
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo
- `Cmd/Ctrl + E` - Export
- `Cmd/Ctrl + G` - Group selected nodes
- `Cmd/Ctrl + I` - AI analyze selected
- `Delete/Backspace` - Delete selected nodes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindmesh.git
   cd mindmesh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── nodes/          # Custom node types
│   ├── FloatingToolbar.tsx
│   ├── MindMeshCanvas.tsx
│   └── NodeTypePanel.tsx
├── contexts/           # React contexts
│   ├── DataContext.tsx
│   └── ThemeContext.tsx
├── utils/              # Utility functions
│   └── gemini.ts       # AI integration
└── main.tsx           # App entry point
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Adding New Node Types
1. Create a new component in `src/components/nodes/`
2. Register it in `src/components/nodes/index.ts`
3. Add it to the node types list in `NodeTypePanel.tsx`

### Customizing AI Integration
- Modify `src/utils/gemini.ts` for different AI models
- Update prompts in `MindMeshCanvas.tsx`
- Add new AI features in the analysis functions

## 🎯 Usage Guide

### Creating Your First Mind Map
1. **Add Nodes** - Click the "+" button or press `Cmd/Ctrl + N`
2. **Connect Ideas** - Drag from one node's handle to another
3. **Organize** - Drag nodes to arrange your thoughts
4. **Style** - Use the color picker to categorize nodes
5. **Analyze** - Select nodes and use AI analysis (`Cmd/Ctrl + I`)

### Architecture Diagrams
1. **Switch to Diagram Mode** - Use the shape nodes from the panel
2. **Choose Shapes** - Rectangles, circles, diamonds, servers, etc.
3. **Connect Components** - Use the connection handles
4. **Export** - Save as PNG or SVG for presentations

### AI Features
1. **Select Nodes** - Click multiple nodes to select them
2. **AI Analysis** - Press `Cmd/Ctrl + I` for insights
3. **Review Results** - AI creates a new note with analysis
4. **Explore Further** - Use insights to expand your map

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY` - Your Gemini API key for AI features
- `VITE_APP_TITLE` - Custom app title (optional)

### Customization
- **Themes** - Modify `src/contexts/ThemeContext.tsx`
- **Node Styles** - Update CSS classes in node components
- **AI Prompts** - Customize prompts in `MindMeshCanvas.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) - For the amazing node-based editor
- [Framer Motion](https://www.framer.com/motion/) - For smooth animations
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful styling
- [Google Gemini](https://ai.google.dev/) - For AI-powered insights
- [Lucide Icons](https://lucide.dev/) - For beautiful icons

## 🐛 Troubleshooting

### Common Issues

**AI Analysis Not Working**
- Check your Gemini API key in environment variables
- Ensure you have selected nodes before analysis
- Check browser console for error messages

**Nodes Not Moving**
- Make sure you're dragging from the node body, not handles
- Check if nodes are locked (should be editable by default)

**Import/Export Issues**
- Ensure JSON format is correct
- Check file permissions for export

**Performance Issues**
- Limit the number of nodes (recommended: < 1000)
- Use grouping for large diagrams
- Close unused browser tabs

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/yourusername/mindmesh/issues)
- **Discussions** - [GitHub Discussions](https://github.com/yourusername/mindmesh/discussions)
- **Email** - your.email@example.com

---

**Made with ❤️ for the mind mapping community**