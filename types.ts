export interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
  files?: FileItem[];
}

export interface FileContent {
  path: string;
  content: string;
}

export interface ApiError {
  error: string;
}
