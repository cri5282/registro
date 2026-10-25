import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTheme } from "./ThemeProvider";

/** Campo nudo che compare con la pressione lunga sul logo. Niente etichette, niente indizi. */
export default function SecretPrompt({ onClose }: { onClose: () => void }) {
  const { matchWord, trigger } = useTheme();
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    const hit = matchWord(value);
    if (hit) {
      inputRef.current?.blur();
      trigger(hit);
      return;
    }
    setWrong(true);
    window.setTimeout(onClose, 420);
  }

  return (
    <div className="secret-prompt-backdrop" onPointerDown={onClose}>
      <form
        className={`secret-prompt${wrong ? " is-wrong" : ""}`}
        onSubmit={submit}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
          }}
          aria-label="Parola"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
        />
      </form>
    </div>
  );
}
