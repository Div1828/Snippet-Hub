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
  ownerUsername?: string;
  isPublic?: boolean;
  collaborators?: string[];
}

interface SnippetContextType {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, "_id" | "pinned">) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  editSnippet: (updated: Snippet) => Promise<void>;
  togglePinSnippet: (id: string) => Promise<void>;
  togglePublicSnippet: (id: string) => Promise<void>;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const { user, loading } = useAuth();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchSnippets = async () => {
      if (loading) return;

      try {
        const res = await axiosInstance.get<unknown>("/snippets", {
          headers: getAuthHeader(),
        });

        if (Array.isArray(res.data)) {
          setSnippets(res.data as Snippet[]);
        } else {
          console.error("Invalid response: expected an array of snippets.", res.data);
          setSnippets([]); // fallback to empty
        }
      } catch (err) {
        console.error("Failed to fetch snippets:", err);
        setSnippets([]); // ensure it's always an array
      }
    };

    fetchSnippets();
  }, [user, loading]);

  const addSnippet = async (snippet: Omit<Snippet, "_id" | "pinned">) => {
    try {
      const response = await axiosInstance.post<Snippet>(
        "/snippets",
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
      await axiosInstance.delete(`/snippets/${id}`, {
        headers: getAuthHeader(),
      });
      setSnippets((prev) => prev.filter((snippet) => snippet._id !== id));
    } catch (err) {
      console.error("Failed to delete snippet:", err);
    }
  };

  const editSnippet = async (updated: Snippet) => {
    try {
      const res = await axiosInstance.put<Snippet>(
        `/snippets/${updated._id}`,
        updated,
        { headers: getAuthHeader() }
      );
      setSnippets((prev) =>
        prev.map((s) => (s._id === res.data._id ? res.data : s))
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
      const res = await axiosInstance.put<Snippet>(
        `/snippets/${id}`,
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
      const res = await axiosInstance.patch<{ isPublic: boolean }>(
        `/snippets/${id}/toggle-public`,
        null,
        { headers: getAuthHeader() }
      );

      setSnippets((prev) =>
        prev.map((snip) =>
          snip._id === id ? { ...snip, isPublic: res.data.isPublic } : snip
        )
      );
    } catch (err) {
      console.error("Error toggling public/private:", err);
    }
  };

  return (
    <SnippetContext.Provider
      value={{
        snippets,
        addSnippet,
        deleteSnippet,
        editSnippet,
        togglePinSnippet,
        togglePublicSnippet,
      }}
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
