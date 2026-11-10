import { Prism } from "prism-react-renderer";
import type { PrismTheme } from "prism-react-renderer";

export type CodeLanguage =
  | "csharp"
  | "java"
  | "typescript"
  | "sql"
  | "bash"
  | "ini"
  | "yaml"
  | "json"
  | "plaintext";

Prism.languages.bash = {
  comment: /#.*/,
  string: {
    pattern: /"(?:\\.|[^"\\])*"|'[^']*'/,
    greedy: true,
  },
  variable: {
    pattern: /\$(?:\w+|\{[^}]+\})/,
    greedy: true,
  },
  keyword: {
    pattern:
      /\b(?:sudo|apt|apt-get|dnf|yum|systemctl|ufw|firewall-cmd|docker|docker-compose|curl|wget|ssh-keygen|ssh-copy-id|useradd|adduser|usermod|passwd|chmod|chown|mkdir|cp|mv|rm|echo|cat|grep|awk|sed|head|tail|ss|whoami|timedatectl|aa-status|lynis|dpkg-reconfigure|unattended-upgrades)\b/,
  },
  number: /\b\d+(?:\.\d+)?(?:\/\w+)?\b/,
  operator: /\|\||&&|[|&;<>]/,
  punctuation: /[()[\]{}]/,
};

Prism.languages.csharp = Prism.languages.extend("clike", {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
    },
  ],
  string: [
    {
      pattern: /"""[\s\S]*?"""/,
      greedy: true,
    },
    {
      pattern: /@\$?"(?:""|\\[\s\S]|[^"\\])*"/,
      greedy: true,
    },
    {
      pattern: /\$?"(?:\\.|[^"\\])*"/,
      greedy: true,
    },
  ],
  keyword:
    /\b(?:abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|object|operator|out|override|params|private|protected|public|readonly|record|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|var|virtual|void|volatile|while|with|yield|get|set|init|required|global|nameof|when)\b/,
  number:
    /\b0(?:x[\da-f]+|b[01]+)n?|\b\d+(?:\.\d*)?(?:e[+-]?\d+)?(?:[fFdDmM])?/i,
  boolean: /\b(?:true|false)\b/,
  null: /\bnull\b/,
  punctuation: /[{}[\];(),.:?]/,
});

Prism.languages.java = Prism.languages.extend("clike", {
  keyword:
    /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|var|record|sealed|permits|yield)\b/,
  boolean: /\b(?:true|false)\b/,
  null: /\bnull\b/,
  number:
    /\b0[xX][\da-fA-F]+[lL]?|\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?/,
  punctuation: /[{}[\];(),.:]/,
});

Prism.languages.ini = {
  comment: /[;#].*/,
  section: {
    pattern: /^\s*\[[^\]]+\]/m,
    greedy: true,
  },
  key: {
    pattern: /^\s*[^=\s][^=]*?(?=\s*=)/m,
    greedy: true,
  },
  directive: {
    pattern: /^\s*[A-Za-z][\w.]*/m,
    greedy: true,
  },
  string: {
    pattern: /"(?:\\.|[^"\\])*"|'[^']*'/,
    greedy: true,
  },
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /=/,
};

export const articleCodeTheme: PrismTheme = {
  plain: {
    color: "var(--syntax-plain)",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--syntax-comment)", fontStyle: "italic" },
    },
    {
      types: ["punctuation"],
      style: { color: "var(--syntax-punctuation)" },
    },
    {
      types: ["operator", "entity", "url"],
      style: { color: "var(--syntax-operator)" },
    },
    {
      types: ["keyword", "atrule", "directive", "section"],
      style: { color: "var(--syntax-keyword)" },
    },
    {
      types: ["string", "char", "attr-value", "inserted", "builtin"],
      style: { color: "var(--syntax-string)" },
    },
    {
      types: ["number", "boolean", "symbol"],
      style: { color: "var(--syntax-number)" },
    },
    {
      types: ["function", "class-name", "selector"],
      style: { color: "var(--syntax-function)" },
    },
    {
      types: ["key", "attr-name", "property"],
      style: { color: "var(--syntax-type)" },
    },
    {
      types: ["variable", "regex", "important"],
      style: { color: "var(--syntax-variable)" },
    },
    {
      types: ["constant", "null", "tag", "deleted"],
      style: { color: "var(--syntax-constant)" },
    },
  ],
};

const languageLabels: Record<string, string> = {
  csharp: "C#",
  java: "Java",
  typescript: "TypeScript",
  tsx: "TSX",
  ts: "TypeScript",
  sql: "SQL",
  bash: "Shell",
  ini: "Config",
  yaml: "YAML",
  json: "JSON",
  plaintext: "Text",
};

export function detectCodeLanguage(code: string): CodeLanguage {
  const trimmed = code.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {}
  }

  if (
    /\b(?:using\s+System|namespace\s+[\w.]+|public\s+(?:class|record|interface)|internal\s+class|DbContext|IDbConnection|QueryAsync<|QuerySingleAsync<|ExecuteAsync\(|\.Include\(|\.AsNoTracking\(|\.ToListAsync\(|\[Table\]|\[Key\])/.test(
      trimmed,
    )
  ) {
    return "csharp";
  }

  if (
    /\b(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+(?:TABLE|INDEX|FULLTEXT|KEYSPACE)|ALTER\s+TABLE|EXPLAIN|WITH\s+\w+\s+AS)\b/i.test(
      trimmed,
    )
  ) {
    return "sql";
  }

  if (
    /\.setConsistencyLevel|session\.execute|System\.out|@Override|import\s+java\.|public\s+(?:class|interface|enum)/.test(
      trimmed,
    )
  ) {
    return "java";
  }

  if (
    /\b(?:interface|class|function|const|let|var|import|export|async|await|return|new)\b|=>/.test(
      trimmed,
    )
  ) {
    return "typescript";
  }

  if (
    /^\s*(?:sudo|apt|apt-get|dnf|yum|systemctl|ufw|firewall-cmd|docker|curl|wget|ssh-keygen|ssh-copy-id|useradd|adduser|usermod|passwd|whoami|ss|timedatectl|aa-status|lynis|dpkg-reconfigure)\b/m.test(
      trimmed,
    ) ||
    /^\s*#\s*(?:Debian|RHEL)/m.test(trimmed)
  ) {
    return "bash";
  }

  if (
    /^[A-Za-z][\w.]*\s*=/m.test(trimmed) ||
    /^(?:PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|KbdInteractiveAuthentication|X11Forwarding|AllowUsers)\b/m.test(
      trimmed,
    )
  ) {
    return "ini";
  }

  if (
    /^\s*#.*\.ya?ml\b/m.test(trimmed) ||
    /^\s*[\w-]+:\s*$/m.test(trimmed) ||
    /\n\s{2,}[\w-]+:\s/.test(trimmed)
  ) {
    return "yaml";
  }

  return "plaintext";
}

export function resolveCodeLanguage(
  code: string,
  language?: string,
): CodeLanguage {
  if (language === "plaintext" || language === "text") {
    return "plaintext";
  }

  if (language && Prism.languages[language]) {
    return language as CodeLanguage;
  }

  return detectCodeLanguage(code);
}

export function getCodeLanguageLabel(language: string): string {
  return languageLabels[language] ?? language.toUpperCase();
}
