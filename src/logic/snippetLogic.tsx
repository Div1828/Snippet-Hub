import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface Snippet {
  id: string;
  title: string;
  content: string;
  category?: string;
  pinned?: boolean; 
}

interface SnippetContextType {
  snippets: Snippet[];
  addSnippet: (snippet: Snippet) => void;
  deleteSnippet: (id: string) => void;
  editSnippet: (updated: Snippet) => void;
  togglePinSnippet: (id: string) => void;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

export const SnippetProvider = ({ children }: { children: ReactNode }) => {
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = localStorage.getItem("snippets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("snippets", JSON.stringify(snippets));
  }, [snippets]);

  const addSnippet = (snippet: Snippet) => {
    setSnippets(prev => [...prev, { ...snippet, pinned: false }]);
  };

  const deleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(snippet => snippet.id !== id));
  };

  const editSnippet = (updated: Snippet) => {
    setSnippets(prev =>
      prev.map(snippet => (snippet.id === updated.id ? updated : snippet))
    );
  };

  const togglePinSnippet = (id: string) => {
    setSnippets(prev =>
      prev.map(snippet =>
        snippet.id === id ? { ...snippet, pinned: !snippet.pinned } : snippet
      )
    );
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
