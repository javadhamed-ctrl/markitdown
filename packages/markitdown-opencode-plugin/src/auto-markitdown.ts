import type { Plugin } from "@opencode-ai/plugin"
import { $ } from "bun"

/**
 * MarkItDown Opencode Plugin
 * 
 * This plugin automatically converts supported file formats to Markdown
 * before they are read or edited in opencode.
 * 
 * Supported formats: PDF, DOCX, XLSX, PPTX, HTML, CSV, JSON, XML, ZIP, EPUB,
 * Images (JPG, PNG, GIF, BMP, TIFF, WebP), Audio (MP3, WAV, M4A, FLAC, OGG),
 * Video (MP4, MOV, AVI, MKV, WebM), and YouTube URLs.
 * 
 * When a user reads or edits a supported file, this plugin:
 * 1. Runs markitdown to convert the file to .md
 * 2. Redirects the tool to read/edit the .md file instead
 * 3. Provides clean, structured Markdown content for LLM consumption
 */

const CONVERTIBLE_EXTENSIONS = [
  ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt",
  ".html", ".htm", ".csv", ".json", ".xml", ".zip", ".epub",
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp",
  ".mp3", ".wav", ".m4a", ".flac", ".ogg",
  ".mp4", ".mov", ".avi", ".mkv", ".webm"
]

async function convertToMarkdown(filePath: string): Promise<string | null> {
  const ext = filePath.toLowerCase().substring(filePath.lastIndexOf("."))
  if (!CONVERTIBLE_EXTENSIONS.includes(ext)) return null

  const mdPath = filePath.replace(ext, ".md")
  
  try {
    await $`markitdown ${filePath} -o ${mdPath}`.quiet()
    return mdPath
  } catch (error) {
    console.error(`[markitdown-opencode] Failed to convert ${filePath}:`, error)
    return null
  }
}

export default (async ({ client, project, directory, $ }) => {
  return {
    "tool.execute.before": async (input, output) => {
      const tool = input.tool
      const args = output.args

      // Handle read tool - convert file to markdown before reading
      if (tool === "read" && args.filePath) {
        const mdPath = await convertToMarkdown(args.filePath)
        if (mdPath) {
          output.args.filePath = mdPath
        }
      }

      // Handle edit tool - convert file to markdown before editing
      if (tool === "edit" && args.filePath) {
        const mdPath = await convertToMarkdown(args.filePath)
        if (mdPath) {
          output.args.filePath = mdPath
        }
      }
    }
  }
}) satisfies Plugin