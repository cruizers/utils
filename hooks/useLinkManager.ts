import { useState, useCallback } from "react";

export interface ExtractedLink {
  id: string;
  url: string;
  text: string;
  isValid: boolean;
}

export function useLinkManager() {
  const [inputText, setInputText] = useState("");
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);

  const extractLinks = useCallback((text: string) => {
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const matches = Array.from(text.matchAll(urlRegex));

    const links: ExtractedLink[] = matches.map((match, index) => ({
      id: `link-${index}-${Date.now()}`,
      url: match[0],
      text: match[0],
      isValid: true,
    }));

    setExtractedLinks(links);
    return links;
  }, []);

  const openLink = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const openAllLinks = useCallback(() => {
    extractedLinks.forEach((link) => {
      if (link.isValid) {
        window.open(link.url, "_blank", "noopener,noreferrer");
      }
    });
  }, [extractedLinks]);

  const removeLink = useCallback((id: string) => {
    setExtractedLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setInputText("");
    setExtractedLinks([]);
  }, []);

  const handleTextChange = useCallback(
    (text: string) => {
      setInputText(text);
      if (text.trim()) {
        extractLinks(text);
      } else {
        setExtractedLinks([]);
      }
    },
    [extractLinks]
  );

  return {
    inputText,
    extractedLinks,
    handleTextChange,
    openLink,
    openAllLinks,
    removeLink,
    clearAll,
    extractLinks,
  };
}
