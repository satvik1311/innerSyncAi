const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateAIInsight = async () => {
  // 🧠 Hard fallback insights (dashboard kabhi empty nahi hoga)
  const fallbackInsights = [
    {
      title: "Focus Pattern Detected",
      desc: "You frequently work on AI and system design topics—consider organizing them into a single knowledge cluster.",
    },
    {
      title: "Productivity Tip",
      desc: "Regularly summarizing your notes can help convert ideas into actionable plans.",
    },
  ];

  try {
    const prompt = `
You are an assistant for a personal knowledge dashboard.

User interests include:
AI architecture, React performance, project planning, and feature brainstorming.

Give exactly 2 short insights.
Each insight must be one sentence.
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    console.log("Gemini raw:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // 🔴 Gemini silent → fallback
    if (!text || text.trim().length === 0) {
      return fallbackInsights;
    }

    const lines = text
      .split("\n")
      .filter((l) => l.trim() !== "")
      .slice(0, 2);

    // 🔴 Weird format → fallback
    if (lines.length === 0) {
      return fallbackInsights;
    }

    return lines.map((line, i) => ({
      title: `Insight ${i + 1}`,
      desc: line.trim(),
    }));
  } catch (err) {
    console.error("Gemini error:", err);
    return fallbackInsights;
  }
};
