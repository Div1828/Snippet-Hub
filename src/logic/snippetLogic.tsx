import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

export interface Snippet {
  _id: string; 
  title: string;
  content: string;
  category?: string;
  pinned?: boolean;
}

interface SnippetContextType {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, "_id" | "pinned">) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  editSnippet: (updated: Snippet) => Promise<void>;
  togglePinSnippet: (id: string) => Promise<void>;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/snippets");
        setSnippets(res.data);
      } catch (err) {
        console.error("Failed to fetch snippets:", err);
      }
    };
    fetchSnippets();
  }, []);

  const addSnippet = async (snippet: Omit<Snippet, "_id" | "pinned">) => {
    try {
      const response = await axios.post<Snippet>("http://localhost:5000/api/snippets", snippet);
      setSnippets((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Failed to add snippet:", err);
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/snippets/${id}`);
      setSnippets((prev) => prev.filter((snippet) => snippet._id !== id));
    } catch (err) {
      console.error("Failed to delete snippet:", err);
    }
  };

  const editSnippet = async (updated: Snippet) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/snippets/${updated._id}`, updated);
      const updatedSnippet = res.data;
      setSnippets((prev) =>
        prev.map((s) => (s._id === updatedSnippet._id ? updatedSnippet : s))
      );
    } catch (err) {
      console.error("Failed to edit snippet:", err);
    }
  };

  const togglePinSnippet = async (id: string) => {
    try {
      const snippet = snippets.find((s) => s._id === id);
      if (!snippet) return;

      const updated = { ...snippet, pinned: !snippet.pinned };
      const res = await axios.put(`http://localhost:5000/api/snippets/${id}`, updated);
      setSnippets((prev) =>
        prev.map((s) => (s._id === id ? res.data : s))
      );
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  return (
    <SnippetContext.Provider
      value={{ snippets, addSnippet, deleteSnippet, editSnippet, togglePinSnippet }}
    >
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippets = () => {
  const context = useContext(SnippetContext);
  if (!context) {
    throw new Error("useSnippets must be used within a SnippetProvider");
  }
  return context;
};
