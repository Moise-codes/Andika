// Word generator for typing tests - Monkeytype-style random word generation

const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "been", "being", "has", "had", "did", "does",
  "should", "would", "could", "may", "might", "must", "shall", "will", "can", "need",
  "great", "small", "large", "long", "short", "high", "low", "good", "bad", "right",
  "wrong", "true", "false", "real", "same", "different", "important", "simple", "complex", "basic",
  "create", "make", "build", "write", "read", "learn", "teach", "study", "work", "play",
  "start", "stop", "begin", "end", "finish", "complete", "continue", "pause", "resume", "change",
  "world", "life", "time", "day", "year", "month", "week", "hour", "minute", "second",
  "thing", "something", "nothing", "everything", "anything", "someone", "anyone", "everyone", "noone", "nobody",
  "here", "there", "where", "when", "why", "how", "what", "which", "who", "whom",
  "always", "never", "sometimes", "often", "usually", "rarely", "seldom", "already", "yet", "still",
  "very", "too", "quite", "rather", "somewhat", "almost", "nearly", "hardly", "barely", "scarcely",
  "fast", "slow", "quick", "rapid", "swift", "speed", "velocity", "pace", "rate", "tempo",
  "code", "program", "function", "variable", "constant", "array", "object", "string", "number", "boolean",
  "class", "method", "property", "value", "type", "interface", "module", "package", "library", "framework",
  "react", "javascript", "typescript", "python", "java", "ruby", "go", "rust", "swift", "kotlin",
  "database", "server", "client", "api", "rest", "graphql", "http", "https", "json", "xml",
  "design", "develop", "deploy", "test", "debug", "fix", "improve", "optimize", "refactor", "maintain",
  "system", "network", "security", "authentication", "authorization", "encryption", "decryption", "hash", "token", "key",
  "user", "admin", "guest", "member", "owner", "creator", "editor", "viewer", "follower", "subscriber",
  "data", "information", "content", "media", "image", "video", "audio", "text", "document", "file",
  "computer", "laptop", "desktop", "mobile", "tablet", "phone", "device", "hardware", "software", "application",
  "internet", "web", "browser", "chrome", "firefox", "safari", "edge", "opera", "search", "engine",
  "google", "facebook", "twitter", "instagram", "linkedin", "youtube", "tiktok", "snapchat", "whatsapp", "telegram",
  "email", "message", "chat", "call", "video", "audio", "voice", "text", "image", "file",
  "cloud", "storage", "backup", "sync", "share", "upload", "download", "stream", "buffer", "cache",
  "memory", "disk", "drive", "folder", "directory", "path", "url", "link", "domain", "host",
  "port", "protocol", "socket", "connection", "request", "response", "header", "body", "status", "code",
  "error", "warning", "info", "debug", "log", "trace", "console", "terminal", "shell", "command",
  "script", "batch", "task", "job", "process", "thread", "worker", "service", "daemon", "server",
  "frontend", "backend", "fullstack", "devops", "testing", "quality", "assurance", "release", "version", "update",
  "feature", "bug", "issue", "ticket", "story", "epic", "sprint", "iteration", "milestone", "goal",
  "team", "group", "organization", "company", "startup", "enterprise", "business", "product", "service", "solution",
  "customer", "client", "partner", "vendor", "supplier", "provider", "market", "industry", "sector", "field",
  "innovation", "technology", "science", "research", "development", "engineering", "design", "art", "creative", "craft",
  "skill", "talent", "ability", "capacity", "capability", "competence", "expertise", "knowledge", "experience", "wisdom",
  "practice", "training", "learning", "education", "study", "course", "lesson", "tutorial", "guide", "manual",
  "book", "article", "blog", "post", "comment", "review", "rating", "feedback", "suggestion", "recommendation",
  "idea", "concept", "thought", "opinion", "view", "perspective", "approach", "method", "technique", "strategy",
  "plan", "schedule", "timeline", "deadline", "milestone", "deliverable", "outcome", "result", "impact", "value",
  "success", "failure", "achievement", "accomplishment", "victory", "defeat", "win", "loss", "gain", "profit",
  "money", "cost", "price", "budget", "fund", "investment", "capital", "revenue", "income", "expense",
  "growth", "scale", "expand", "increase", "decrease", "reduce", "improve", "enhance", "optimize", "maximize",
  "minimize", "simplify", "clarify", "explain", "describe", "define", "specify", "detail", "outline", "summarize",
  "analyze", "evaluate", "assess", "measure", "track", "monitor", "report", "present", "demonstrate", "show",
  "prove", "verify", "validate", "confirm", "check", "test", "inspect", "audit", "review", "examine",
  "solve", "resolve", "fix", "address", "handle", "manage", "control", "govern", "regulate", "supervise",
  "lead", "guide", "direct", "manage", "organize", "coordinate", "facilitate", "support", "assist", "help",
  "collaborate", "cooperate", "partner", "teamwork", "communication", "discussion", "meeting", "conference", "workshop", "seminar",
  "presentation", "speech", "talk", "lecture", "class", "session", "event", "occasion", "opportunity", "chance",
  "problem", "challenge", "obstacle", "barrier", "difficulty", "issue", "concern", "matter", "topic", "subject",
  "question", "answer", "response", "reply", "solution", "result", "outcome", "conclusion", "decision", "choice",
  "option", "alternative", "possibility", "opportunity", "potential", "prospect", "future", "past", "present", "history",
  "background", "context", "environment", "situation", "condition", "state", "status", "phase", "stage", "step",
  "level", "degree", "extent", "amount", "quantity", "number", "count", "total", "sum", "average",
  "minimum", "maximum", "range", "limit", "boundary", "edge", "margin", "padding", "space", "gap",
  "structure", "organization", "arrangement", "order", "sequence", "pattern", "format", "layout", "design", "style",
  "theme", "color", "size", "shape", "form", "appearance", "look", "feel", "experience", "interaction",
  "interface", "user", "experience", "design", "usability", "accessibility", "performance", "speed", "efficiency", "quality",
  "reliability", "availability", "scalability", "maintainability", "security", "privacy", "safety", "compliance", "regulation", "standard",
  "best", "practice", "pattern", "principle", "rule", "guideline", "policy", "procedure", "process", "workflow",
  "automation", "tool", "utility", "helper", "assistant", "agent", "bot", "robot", "machine", "algorithm",
  "intelligence", "artificial", "learning", "machine", "deep", "neural", "network", "model", "training", "dataset",
  "prediction", "classification", "regression", "clustering", "analysis", "mining", "processing", "transformation", "normalization", "standardization",
  "feature", "selection", "extraction", "engineering", "dimensionality", "reduction", "optimization", "tuning", "hyperparameter", "parameter",
  "loss", "function", "metric", "accuracy", "precision", "recall", "f1", "score", "evaluation", "validation",
  "cross", "validation", "split", "train", "test", "dev", "set", "sample", "batch", "epoch",
  "iteration", "step", "learning", "rate", "momentum", "decay", "regularization", "dropout", "batch", "normalization",
  "activation", "function", "relu", "sigmoid", "tanh", "softmax", "linear", "convolution", "pooling", "flatten",
  "dense", "layer", "hidden", "output", "input", "weight", "bias", "gradient", "backpropagation", "forward",
  "propagation", "chain", "rule", "derivative", "partial", "gradient", "descent", "stochastic", "batch", "mini",
  "adam", "rmsprop", "sgd", "optimizer", "solver", "minimizer", "maximizer", "objective", "constraint", "penalty",
  "regularization", "l1", "l2", "elastic", "net", "ridge", "lasso", "early", "stopping", "checkpoint",
  "model", "save", "load", "export", "import", "deploy", "serve", "predict", "inference", "production",
  "monitoring", "logging", "debugging", "profiling", "performance", "latency", "throughput", "concurrency", "parallelism", "distributed",
  "system", "architecture", "microservices", "monolith", "serverless", "function", "lambda", "container", "docker", "kubernetes",
  "orchestration", "deployment", "pipeline", "continuous", "integration", "delivery", "version", "control", "git", "repository",
  "branch", "merge", "pull", "request", "commit", "push", "fetch", "clone", "fork", "star",
  "watch", "issue", "tracker", "project", "management", "agile", "scrum", "kanban", "lean", "waterfall",
  "sprint", "planning", "daily", "standup", "retrospective", "review", "demo", "backlog", "story", "point",
  "velocity", "burndown", "burnup", "chart", "graph", "diagram", "flowchart", "wireframe", "mockup", "prototype",
  "sketch", "design", "system", "component", "module", "package", "library", "framework", "platform", "ecosystem",
  "community", "contribution", "open", "source", "license", "mit", "apache", "gpl", "bsd", "proprietary",
  "commercial", "enterprise", "business", "startup", "unicorn", "ipo", "acquisition", "merger", "partnership", "collaboration",
  "investment", "funding", "venture", "capital", "angel", "investor", "pitch", "deck", "term", "sheet",
  "valuation", "equity", "stock", "option", "grant", "vesting", "cliff", "salary", "compensation", "benefit",
  "perk", "culture", "values", "mission", "vision", "goal", "objective", "strategy", "tactic", "execution",
  "leadership", "management", "hierarchy", "organization", "structure", "role", "responsibility", "accountability", "authority", "power",
  "influence", "impact", "legacy", "heritage", "tradition", "history", "future", "vision", "dream", "ambition",
  "passion", "purpose", "meaning", "fulfillment", "satisfaction", "happiness", "joy", "peace", "balance", "harmony",
  "health", "wellness", "fitness", "exercise", "diet", "nutrition", "sleep", "rest", "recovery", "energy",
  "focus", "concentration", "attention", "mindfulness", "meditation", "awareness", "presence", "mindset", "attitude", "behavior",
  "habit", "routine", "discipline", "consistency", "persistence", "resilience", "adaptability", "flexibility", "agility", "speed",
  "quality", "excellence", "mastery", "expertise", "skill", "talent", "gift", "ability", "capacity", "potential",
  "growth", "development", "progress", "improvement", "evolution", "transformation", "change", "adaptation", "learning", "education",
  "knowledge", "wisdom", "insight", "understanding", "comprehension", "grasp", "mastery", "competence", "proficiency", "expertise",
];

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SYMBOLS = ["@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]", "|", "\\", ":", ";", "\"", "'", "<", ">", ",", ".", "?", "/"];
const PUNCTUATION = [",", ".", "!", "?", ";", ":", "-", "(", ")", "[", "]", "{", "}", "\"", "'"];

interface GenerateOptions {
  wordCount: number;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  includePunctuation?: boolean;
}

/**
 * Generate random words for typing test (Monkeytype-style)
 */
export function generateRandomWords(options: GenerateOptions): string {
  const { wordCount, includeNumbers = false, includeSymbols = false, includePunctuation = false } = options;
  
  const words: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    
    // Add numbers randomly (10% chance)
    if (includeNumbers && Math.random() < 0.1) {
      const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
      word = word + number;
    }
    
    // Add symbols randomly (5% chance)
    if (includeSymbols && Math.random() < 0.05) {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      word = word + symbol;
    }
    
    // Add punctuation randomly (15% chance, but not at the very end)
    if (includePunctuation && Math.random() < 0.15 && i < wordCount - 1) {
      const punct = PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
      word = word + punct;
    }
    
    words.push(word);
  }
  
  return words.join(" ");
}

/**
 * Generate random quotes
 */
const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Stay hungry, stay foolish.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "In the middle of difficulty lies opportunity.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "The mind is everything. What you think you become.",
  "Happiness is not something ready made. It comes from your own actions.",
];

export function generateRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/**
 * Generate code snippets
 */
const CODE_SNIPPETS = [
  "function calculateWPM(chars, time) { return Math.round((chars / 5) / (time / 60)); }",
  "const user = { name: 'John', age: 25, email: 'john@example.com' };",
  "if (isValid) { return true; } else { return false; }",
  "import React from 'react'; export default function App() { return <div>Hello</div>; }",
  "const arr = [1, 2, 3]; const doubled = arr.map(x => x * 2);",
  "async function fetchData() { const res = await fetch('/api'); return res.json(); }",
  "class Person { constructor(name) { this.name = name; } greet() { return `Hello ${this.name}`; } }",
  "try { doSomething(); } catch (error) { console.error(error); } finally { cleanup(); }",
  "const sum = (a, b) => a + b; const multiply = (a, b) => a * b;",
  "for (let i = 0; i < 10; i++) { console.log(i); }",
];

export function generateRandomCode(): string {
  return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
}
