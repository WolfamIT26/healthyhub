import { useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, SearchInput } from '../../components';
import {
  getProductSearchSuggestions,
  normalizeSearchQuery,
  type ProductSearchSuggestion,
} from './search.utils';

export function ProductSearch({
  value,
  onValueChange,
  onSubmit,
  onClear,
  onNavigate,
  label = 'Tìm kiếm sản phẩm',
  placeholder = 'Tên sản phẩm, danh mục, thương hiệu…',
  buttonLabel = 'Tìm kiếm',
  showEmptyError = false,
  compact = false,
  className,
}: {
  value: string;
  onValueChange(value: string): void;
  onSubmit?(query: string): void;
  onClear?(): void;
  onNavigate?(): void;
  label?: string;
  placeholder?: string;
  buttonLabel?: string;
  showEmptyError?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const id = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [emptyError, setEmptyError] = useState(false);
  const suggestions = useMemo(() => getProductSearchSuggestions(value), [value]);

  function closeSuggestions() {
    setOpen(false);
    setActiveIndex(-1);
  }
  function submitQuery() {
    const normalized = normalizeSearchQuery(value);
    if (!normalized) {
      if (showEmptyError) setEmptyError(true);
      return;
    }
    setEmptyError(false);
    closeSuggestions();
    if (onSubmit) onSubmit(normalized);
    else navigate(`/products?search=${encodeURIComponent(normalized)}`);
    onNavigate?.();
  }
  function selectSuggestion(suggestion: ProductSearchSuggestion) {
    setEmptyError(false);
    closeSuggestions();
    if (suggestion.type === 'query' && onSubmit) {
      onValueChange(suggestion.label);
      onSubmit(suggestion.label);
      onNavigate?.();
      return;
    }
    navigate(suggestion.href);
    onNavigate?.();
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(suggestions.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeSuggestions();
    } else if (event.key === 'Enter' && open && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuery();
  }

  return (
    <form
      ref={rootRef}
      className={`relative min-w-0 ${className ?? ''}`}
      role="search"
      onSubmit={submit}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) closeSuggestions();
      }}
      noValidate
    >
      <label className="sr-only" htmlFor={`${id}-input`}>
        {label}
      </label>
      <div className={`flex min-w-0 ${compact ? 'gap-1' : 'flex-col gap-2 sm:flex-row'}`}>
        <SearchInput
          id={`${id}-input`}
          value={value}
          maxLength={100}
          placeholder={placeholder}
          className="min-w-0 flex-1"
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          aria-describedby={emptyError ? `${id}-error` : undefined}
          error={emptyError}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            onValueChange(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
            setEmptyError(false);
          }}
          onClear={() => {
            onValueChange('');
            onClear?.();
            setOpen(true);
            setActiveIndex(-1);
            setEmptyError(false);
          }}
        />
        <Button
          type="submit"
          size={compact ? 'sm' : 'md'}
          className={compact ? 'shrink-0 px-3' : undefined}
        >
          {buttonLabel}
        </Button>
      </div>
      {emptyError ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-error-dark" role="alert">
          Hãy nhập tên sản phẩm bạn muốn tìm.
        </p>
      ) : null}
      {open && suggestions.length ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(420px,70dvh)] overflow-y-auto rounded-card border border-neutral-200 bg-white p-2 text-neutral-950 shadow-overlay">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
            {normalizeSearchQuery(value) ? 'Gợi ý tìm kiếm' : 'Khám phá'}
          </p>
          <ul id={`${id}-listbox`} role="listbox" aria-label="Gợi ý sản phẩm">
            {suggestions.map((suggestion, index) => (
              <li
                id={`${id}-option-${index}`}
                key={suggestion.id}
                role="option"
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex ? 'rounded-control bg-primary-50' : 'rounded-control'
                }
              >
                <button
                  type="button"
                  tabIndex={-1}
                  className="flex min-h-14 w-full min-w-0 items-center gap-3 rounded-control px-3 py-2 text-left hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion.visual ? (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-50 text-xl"
                      aria-hidden="true"
                    >
                      {suggestion.visual}
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-600">
                      {suggestion.type === 'category'
                        ? 'Danh mục'
                        : suggestion.type === 'brand'
                          ? 'Thương hiệu'
                          : suggestion.type === 'dietary'
                            ? 'Đặc điểm'
                            : 'Tìm'}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{suggestion.label}</span>
                    <span className="block truncate text-xs text-neutral-500">
                      {suggestion.meta}
                    </span>
                  </span>
                  {suggestion.price ? (
                    <span className="shrink-0 text-sm font-bold text-primary-700">
                      {suggestion.price}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
