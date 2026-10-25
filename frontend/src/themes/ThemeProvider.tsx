import {
  Component,
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { asset, DEFAULT_COPY, THEMES, type ThemeCopy } from "./registry";
import { FLAVOR } from "./flavor";
import { createMatcher, isTypingTarget } from "./secretWords";
import { playThemeSound } from "./sound";
import { isThemeId, SECRET_WORDS, type ThemeId } from "./words";
import SecretPrompt from "./SecretPrompt";
import ThemeExtras from "./ThemeExtras";

const STORAGE_KEY = "registro.theme";

interface ThemeContextValue {
  theme: ThemeId;
  copy: ThemeCopy;
  trigger: (id: ThemeId) => void;
  /** Apre il campo segreto (pressione lunga sul logo). */
  openPrompt: () => void;
  matchWord: (text: string) => ThemeId | null;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): ThemeId {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isThemeId(value) ? value : "default";
  } catch {
    return "default";
  }
}

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  if (id === "default") delete root.dataset.theme;
  else root.dataset.theme = id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEMES[id].themeColor);
  try {
    if (id === "default") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Senza storage il tema dura fino al prossimo ricaricamento.
  }
}

function warmUp(id: ThemeId) {
  void THEMES[id].font?.();
  for (const path of THEMES[id].assets) new Image().src = asset(path);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(readStored);
  const [show, setShow] = useState<{ id: ThemeId; key: number } | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const matcher = useMemo(() => createMatcher(SECRET_WORDS), []);
  const showCount = useRef(0);

  useEffect(() => {
    applyTheme(theme);
    void THEMES[theme].font?.();
    // Solo al primo montaggio: dopo ci pensa commit().
  }, []);

  const commit = useCallback((id: ThemeId) => {
    applyTheme(id);
    setTheme(id);
  }, []);

  const trigger = useCallback(
    (id: ThemeId) => {
      setPromptOpen(false);
      warmUp(id);
      if (prefersReducedMotion()) {
        const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
        if (doc.startViewTransition) doc.startViewTransition(() => commit(id));
        else commit(id);
        return;
      }
      playThemeSound(id);
      showCount.current += 1;
      setShow({ id, key: showCount.current });
    },
    [commit],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      if (isTypingTarget(event.target)) return;
      const hit = matcher.push(event.key);
      if (hit) trigger(hit);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [matcher, trigger]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      copy: { ...DEFAULT_COPY, ...THEMES[theme].copy, ...FLAVOR[theme] },
      trigger,
      openPrompt: () => setPromptOpen(true),
      matchWord: (text) => matcher.match(text),
    }),
    [theme, trigger, matcher],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <ThemeExtras theme={theme} />
      {promptOpen ? <SecretPrompt onClose={() => setPromptOpen(false)} /> : null}
      {show ? (
        <ThemeCurtain
          key={show.key}
          id={show.id}
          onCovered={() => commit(show.id)}
          onDone={() => setShow(null)}
        />
      ) : null}
    </ThemeContext.Provider>
  );
}

class CurtainBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function ThemeCurtain({ id, onCovered, onDone }: { id: ThemeId; onCovered: () => void; onDone: () => void }) {
  const covered = useRef(false);
  const done = useRef(false);
  const Animation = THEMES[id].Animation;

  const cover = useCallback(() => {
    if (covered.current) return;
    covered.current = true;
    onCovered();
  }, [onCovered]);

  const finish = useCallback(() => {
    if (done.current) return;
    cover();
    done.current = true;
    onDone();
  }, [cover, onDone]);

  useEffect(() => {
    // Rete di sicurezza: nessuna animazione deve bloccare l'app.
    const timer = window.setTimeout(finish, 9000);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  return (
    <div className={`theme-curtain theme-curtain-${id}`} onClick={finish} aria-hidden="true">
      <CurtainBoundary onFail={finish}>
        <Suspense fallback={null}>
          <Animation onCovered={cover} onDone={finish} />
        </Suspense>
      </CurtainBoundary>
    </div>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme deve essere usato dentro ThemeProvider");
  return context;
}

/** Saluto del tema con il nome, o null per usare quello normale. */
export function themedGreeting(copy: ThemeCopy, name: string): string | null {
  return copy.greeting ? copy.greeting.replace("{name}", name) : null;
}
