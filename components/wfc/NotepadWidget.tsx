"use client";

import { useState } from "react";
import Widget from "./Widget";

type NotepadWidgetProps = {
  onClose: () => void;
};

export default function NotepadWidget({ onClose }: NotepadWidgetProps) {
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false);
  };

  const handleAlignLeft = () => {
    document.execCommand('justifyLeft', false);
  };

  const handleAlignCenter = () => {
    document.execCommand('justifyCenter', false);
  };

  const handleAlignRight = () => {
    document.execCommand('justifyRight', false);
  };

  const handleAlignJustify = () => {
    document.execCommand('justifyFull', false);
  };

  const handleBulletList = () => {
    document.execCommand('insertUnorderedList', false);
  };

  const handleNumberList = () => {
    document.execCommand('insertOrderedList', false);
  };

  const handleUndo = () => {
    document.execCommand('undo', false);
  };

  const handleRedo = () => {
    document.execCommand('redo', false);
  };

  const handleCopy = () => {
    document.execCommand('copy', false);
  };

  const handlePaste = () => {
    document.execCommand('paste', false);
  };

  return (
    <Widget 
      title="Notepad" 
      onClose={onClose}
      defaultPosition={{ x: 300, y: 150 }}
      width="700px"
      height="600px"
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="p-3 bg-white border-b-2 border-amber-200 space-y-2">
          {/* Row 1: Font Settings */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-amber-900 text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-amber-900 text-sm"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
            </select>

            <select
              className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-amber-900 text-sm"
            >
              <option>Paragraph</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
          </div>

          {/* Row 2: Formatting */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={handleBold}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Bold"
            >
              <span className="font-bold text-amber-900">B</span>
            </button>
            <button
              onClick={handleItalic}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Italic"
            >
              <span className="italic text-amber-900">I</span>
            </button>
            <button
              onClick={handleUnderline}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Underline"
            >
              <span className="underline text-amber-900">U</span>
            </button>

            <div className="w-px h-6 bg-amber-200 mx-1" />

            <button
              onClick={handleAlignLeft}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Align Left"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/>
              </svg>
            </button>
            <button
              onClick={handleAlignCenter}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Align Center"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v2H3V3zm3 4h12v2H6V7zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z"/>
              </svg>
            </button>
            <button
              onClick={handleAlignRight}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Align Right"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z"/>
              </svg>
            </button>
            <button
              onClick={handleAlignJustify}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Justify"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
              </svg>
            </button>

            <div className="w-px h-6 bg-amber-200 mx-1" />

            <button
              onClick={handleBulletList}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Bullet List"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
              </svg>
            </button>
            <button
              onClick={handleNumberList}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Numbered List"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
              </svg>
            </button>

            <div className="w-px h-6 bg-amber-200 mx-1" />

            <button
              onClick={handleUndo}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Undo"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
              </svg>
            </button>
            <button
              onClick={handleRedo}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Redo"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
              </svg>
            </button>

            <div className="w-px h-6 bg-amber-200 mx-1" />

            <button
              onClick={handleCopy}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Copy"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
            <button
              onClick={handlePaste}
              className="p-2 hover:bg-amber-100 rounded transition"
              title="Paste"
            >
              <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Editor */}
        <div
          contentEditable
          className="flex-1 p-6 bg-white focus:outline-none overflow-auto text-amber-900"
          style={{ fontFamily, fontSize: `${fontSize}px` }}
          suppressContentEditableWarning
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
        >
          <p className="text-amber-400">Start typing...</p>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs text-amber-700">
          <div>Words: {content.split(/\s+/).filter(w => w.length > 0).length}</div>
          <div>Characters: {content.length}</div>
        </div>
      </div>
    </Widget>
  );
}

