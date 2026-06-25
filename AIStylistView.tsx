import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Send, Bot, User, CornerDownLeft } from "lucide-react";
import { ChatMessage } from "../types";

interface AIStylistViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
}

const PRESETS = [
  "Draft a sleek, compact minimalist desk setup.",
  "Suggest headphones perfect for hybrid remote workspaces.",
  "Recommend a premium gift set for a pour-over coffee lover.",
  "Help me compare the backpack with the wool desk mat."
];

export default function AIStylistView({
  chatHistory,
  onSendMessage,
  isGenerating,
}: AIStylistViewProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePresetClick = (preset: string) => {
    if (isGenerating) return;
    onSendMessage(preset);
  };

  // Auto-scroll on new message receipts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isGenerating]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 h-[calc(100vh-6.5rem)] flex flex-col justify-between" id="ai-stylist-view">
      {/* Sidebar Header */}
      <div className="border-b border-neutral-100 pb-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-amber-400">
            <Sparkles className="h-5 w-5 fill-amber-400/20 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans text-base font-semibold text-neutral-900">Aura AI Shopping Concierge</h3>
            <p className="text-xs text-neutral-400">Your personal style guide, productivity workspace consultant, and gear specialist.</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 overflow-y-auto py-6 px-1 space-y-4 min-h-0">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 shadow-xs">
              <Bot className="h-7 w-7 text-neutral-800" />
            </div>
            <div className="max-w-md space-y-2">
              <h4 className="font-sans text-sm font-semibold text-neutral-800">Inquire with Aura AI Stylist</h4>
              <p className="text-xs text-neutral-400 leading-relaxed px-4">
                Ask about current inventory, compare product dimensions and materials, or explain your daily workflow to receive custom-curated aesthetic packages.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full pt-4">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-${idx}`}
                  onClick={() => handlePresetClick(p)}
                  className="rounded-xl border border-neutral-150 bg-white p-3.5 text-left text-xs font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-950 hover:shadow-md transition-all duration-200"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex space-x-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs shadow-xs ${
                    msg.role === "user"
                      ? "border-neutral-200 bg-neutral-50 text-neutral-700"
                      : "border-neutral-900 bg-neutral-900 text-white"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-neutral-900 text-white font-medium"
                      : "bg-white border border-neutral-100 text-neutral-700 shadow-sm whitespace-pre-wrap"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isGenerating && (
              <div className="flex space-x-3 max-w-[85%] mr-auto">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 text-white text-xs shadow-sm">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
                <div className="rounded-2xl px-4 py-3 border border-neutral-100 bg-white text-neutral-500 flex items-center space-x-1.5 shadow-sm">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input panel */}
      <div className="pt-4 border-t border-neutral-100 bg-white shrink-0">
        <div className="relative flex items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-1.5 focus-within:border-neutral-950 focus-within:ring-1 focus-within:ring-neutral-950 transition-all">
          <textarea
            id="ai-stylist-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about workspace styling, specs, or coffee setups..."
            className="flex-1 resize-none bg-transparent py-2.5 px-3.5 text-xs text-neutral-800 outline-none max-h-16"
            rows={1}
            disabled={isGenerating}
          />
          <button
            id="send-ai-msg-btn"
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
              !input.trim() || isGenerating
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md active:scale-95 cursor-pointer"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 font-medium px-1">
          <span className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500/10" />
            <span>Powered by Gemini 3.5 Flash</span>
          </span>
          <span className="flex items-center space-x-0.5">
            <span>Press Enter to send</span>
            <CornerDownLeft className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
