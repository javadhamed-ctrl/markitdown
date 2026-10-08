# MarkItDown Opencode Plugin

[![npm](https://img.shields.io/npm/v/markitdown-opencode-plugin.svg)](https://www.npmjs.com/package/markitdown-opencode-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Why This Fork Exists

This fork of **microsoft/markitdown** adds a first-class **opencode plugin** that enables **automatic file-to-Markdown conversion** within the opencode AI coding agent.

### The Problem

When working with AI coding agents like opencode, you often need to:
- Read PDF documentation, specifications, or reports
- Analyze Word documents (requirements, contracts, specs)
- Process Excel spreadsheets (data, configs, exports)
- Review PowerPoint presentations
- Extract text from images, audio, or video files

**But opencode can only natively read text files.** Non-text files appear as binary garbage or fail to read entirely.

### The Solution

This plugin **automatically converts any supported file to Markdown** before opencode reads or edits it:

```
User: "Read the spec.pdf"
         │
         ▼
┌────────────────────────┐
│ markitdown-opencode    │  ← Plugin intercepts the read
│ plugin                 │
└────────────────────────┘
         │
         ▼
   markitdown spec.pdf -o spec.md
         │
         ▼
┌────────────────────────┐
│ opencode reads         │  ← Clean, structured Markdown
│ spec.md instead        │
└────────────────────────┘
```

### Key Features

✅ **Zero configuration** - Works out of the box  
✅ **Automatic** - No manual conversion needed  
✅ **Transparent** - Original files untouched, `.md` files created alongside  
✅ **Comprehensive** - Supports 25+ file formats  
✅ **Fast** - Uses markitdown's optimized converters  

## 📦 Supported Formats

| Category | Extensions |
|----------|------------|
| Documents | `.pdf`, `.docx`, `.doc`, `.epub` |
| Spreadsheets | `.xlsx`, `.xls` |
| Presentations | `.pptx`, `.ppt` |
| Web | `.html`, `.htm` |
| Data | `.csv`, `.json`, `.xml`, `.zip` |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp` |
| Audio | `.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg` |
| Video | `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm` |

## 🚀 Installation

### In Your opencode Project

Add to your `opencode.json`:

```json
{
  "plugin": [
    "./.opencode/plugin/auto-markitdown.ts"
  ]
}
```

Or install from npm (when published):

```json
{
  "plugin": [
    "markitdown-opencode-plugin"
  ]
}
```

### Prerequisites

1. **markitdown** installed: `pip install 'markitdown[all]'`
2. **opencode** with plugin support
3. **Node.js/Bun** for TypeScript plugin execution

## 💡 Usage

Just use opencode normally - conversion happens automatically:

```bash
# These all work transparently:
read specification.pdf
read requirements.docx
read data.xlsx
read presentation.pptx
read image.png
read audio.mp3
read video.mp4
```

The plugin:
1. Detects the file extension
2. Runs `markitdown file.ext -o file.md`
3. Reads `file.md` instead
4. You get clean, structured Markdown

## 🔧 How It Works

The plugin hooks into opencode's tool execution pipeline:

```typescript
"tool.execute.before": async (input, output) => {
  // Intercept read/edit tools
  if (tool === "read" || tool === "edit") {
    // Convert supported files to .md
    const mdPath = await convertToMarkdown(filePath)
    if (mdPath) output.args.filePath = mdPath
  }
}
```

## 📁 Project Structure

```
markitdown-fork/
├── packages/
│   ├── markitdown/                    # Core markitdown (unchanged)
│   ├── markitdown-mcp/                # MCP server (unchanged)
│   ├── markitdown-ocr/                # OCR plugin (unchanged)
│   ├── markitdown-sample-plugin/      # Sample plugin (unchanged)
│   └── markitdown-opencode-plugin/    # ← NEW: Opencode plugin
│       ├── src/
│       │   └── auto-markitdown.ts     # Main plugin entry
│       ├── package.json
│       └── README.md
├── README.md                          # ← Updated with fork info
└── ...
```

## 🤝 Contributing

This fork maintains compatibility with upstream microsoft/markitdown. PRs welcome for:
- Additional file format support
- Performance improvements
- Bug fixes

## 📄 License

MIT License - Same as upstream markitdown.

## 🙏 Credits

- **Upstream**: [microsoft/markitdown](https://github.com/microsoft/markitdown) - The amazing conversion engine
- **Opencode**: [opencode-ai/opencode](https://github.com/opencode-ai/opencode) - The AI coding agent
- **Author**: Javad Hamed (@javadhamed-ctrl)

---

**Built with AI-assisted coding on opencode platform** using `opencode/nemotron-3-ultra-free` model.