import { useState, useEffect, useCallback } from "react";

export function useKeyboardNav({
  filteredCount,
  searchInputRef,
  onOpenDetail,
  onCloseDetail,
  onClearSearch,
  setViewMode,
  detailOpen,
}) {
  const [focusedIndex, setFocusedIndex] = useState(null);

  // Reset focused index when the filtered list changes
  useEffect(() => {
    setFocusedIndex(null);
  }, [filteredCount]);

  const handleKeyDown = useCallback(
    (e) => {
      const searchFocused =
        searchInputRef.current &&
        document.activeElement === searchInputRef.current;

      // --- Slash: focus search input ---
      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // --- Escape: context-dependent dismiss ---
      if (e.key === "Escape") {
        if (detailOpen) {
          onCloseDetail();
        } else if (searchFocused) {
          searchInputRef.current.blur();
          onClearSearch();
        } else {
          setFocusedIndex(null);
        }
        return;
      }

      // When the search input is focused, don't intercept navigation or
      // view-mode shortcuts — let the user type freely.
      if (searchFocused) return;

      // --- j / ArrowDown: next card ---
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredCount === 0) return;
        setFocusedIndex((prev) =>
          prev === null ? 0 : (prev + 1) % filteredCount
        );
        return;
      }

      // --- k / ArrowUp: previous card ---
      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredCount === 0) return;
        setFocusedIndex((prev) =>
          prev === null
            ? filteredCount - 1
            : (prev - 1 + filteredCount) % filteredCount
        );
        return;
      }

      // --- Enter: open detail for focused card ---
      if (e.key === "Enter") {
        if (focusedIndex !== null) {
          onOpenDetail(focusedIndex);
        }
        return;
      }

      // --- g: grid view ---
      if (e.key === "g") {
        setViewMode("grid");
        return;
      }

      // --- l: list view ---
      if (e.key === "l") {
        setViewMode("list");
        return;
      }
    },
    [
      filteredCount,
      focusedIndex,
      searchInputRef,
      onOpenDetail,
      onCloseDetail,
      onClearSearch,
      setViewMode,
      detailOpen,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { focusedIndex };
}
