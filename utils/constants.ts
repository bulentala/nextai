export const EXCLUDED_DIRS = [
  ".git",
  ".next",
  "node_modules",
  "fonts",
] as const;
export const EXCLUDED_FILES = [
  ".DS_Store",
  "favicon.ico",
  "package-lock.json",
  ".gitignore",
  "file.svg",
  "globe.svg",
  "next.svg",
  "vercel.svg",
  "window.svg",
  "README.md",
] as const;

export const API_ENDPOINTS = {
  BASE: "/api/codeBaseScan",
  ALL_FILES: "/api/codeBaseScan/allFiles",
} as const;
