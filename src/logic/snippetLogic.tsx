import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { axiosInstance } from "./authContext";
import { useAuth } from "./authContext"; 

export interface Snippet {
  _id: string;
  title: string;
  content: string;
  category?: string;
  pinned?: boolean;
  owner?: {
    _id: string;
    username: string;
  };
  ownerUsername?: String
  isPublic?: boolean;
  collaborators?: string[];
}



interface SnippetContextType {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, "_id" | "pinned">) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  editSnippet: (updated: Snippet) => Promise<void>;
  togglePinSnippet: (id: string) => Promise<void>;
  togglePublicSnippet: (d: string) => Promise<void>;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { user, loading } = useAuth();

useEffect(() => {
  const fetchSnippets = async () => {
    if (loading) return; 

    try {
      const res = await axiosInstance.get("http://localhost:5000/api/snippets", {
        headers: getAuthHeader(),
      });
      setSnippets(res.data);
    } catch (err) {
      console.error("Failed to fetch snippets:", err);
    }
  };

  fetchSnippets();
}, [user, loading]);


  const addSnippet = async (snippet: Omit<Snippet, "_id" | "pinned">) => {
    try {
      const response = await axiosInstance.post<Snippet>(
        "http://localhost:5000/api/snippets",
        snippet,
        { headers: getAuthHeader() }
      );
      setSnippets((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Failed to add snippet:", err);
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      await axiosInstance.delete(`http://localhost:5000/api/snippets/${id}`, {
        headers: getAuthHeader(),
      });
      setSnippets((prev) => prev.filter((snippet) => snippet._id !== id));
    } catch (err) {
      console.error("Failed to delete snippet:", err);
    }
  };

  const editSnippet = async (updated: Snippet) => {
    try {
      const res = await axiosInstance.put(
        `http://localhost:5000/api/snippets/${updated._id}`,
        updated,
        { headers: getAuthHeader() }
      );
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
      const res = await axiosInstance.put(
        `http://localhost:5000/api/snippets/${id}`,
        updated,
        { headers: getAuthHeader() }
      );
      setSnippets((prev) =>
        prev.map((s) => (s._id === id ? res.data : s))
      );
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };


  const togglePublicSnippet = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/snippets/${id}/toggle-public`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to toggle visibility");

      const data = await res.json();

      setSnippets((prev) =>
        prev.map((snip) =>
          snip._id === id ? { ...snip, isPublic: data.isPublic } : snip
        )
      );
    } catch (err) {
      console.error("Error toggling public/private:", err);
    }
  };

  return (
    <SnippetContext.Provider
      value={{ snippets, addSnippet, deleteSnippet, editSnippet, togglePinSnippet, togglePublicSnippet }}
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
