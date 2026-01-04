"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

interface ApiResponse {
  image?: string;
  error?: string;
  details?: unknown;
}

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Allow string, object, or null for errors
  const [error, setError] = useState<string | ApiResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const generateImage = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCopied(false);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        // keep full error object so we can debug in UI
        throw data;
      }

      if (!data.image) {
        throw { error: "No image was generated. Try again." };
      }

      setImageUrl(data.image);
    } catch (err: any) {
      setError(err);
      console.error("Image generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!imageUrl) return;

    try {
      await navigator.clipboard.writeText(imageUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      setError("Failed to copy image URL");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 pt-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          AI Image Generator
        </motion.h1>

        <form onSubmit={generateImage} className="mb-8">
          <div className="flex flex-col space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError(null);
                }}
                placeholder="Describe the image you want..."
                className="w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                disabled={isLoading}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`py-3 px-6 rounded-lg font-medium transition-colors ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              }`}
            >
              {isLoading ? "Generating..." : "Generate Image"}
            </motion.button>
          </div>
        </form>

        {/* Improved readable error output */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-8"
          >
            <p className="font-bold mb-1">Error:</p>
            <pre className="text-sm whitespace-pre-wrap">
              {typeof error === "string"
                ? error
                : JSON.stringify(error, null, 2)}
            </pre>
          </motion.div>
        )}

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <img
              src={imageUrl}
              alt="Generated image"
              className="w-full rounded-lg shadow-2xl border border-gray-700"
            />

            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              title={isCopied ? "Copied!" : "Copy image URL"}
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
