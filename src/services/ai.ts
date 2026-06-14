export type AiErrorKind =
    | "no_key" | "insufficient_quota" | "rate_limit" | "auth" | "network" | "unknown";

export class AiError extends Error {
    kind: AiErrorKind;
    constructor(kind: AiErrorKind, message: string) {
        super(message);
        this.kind = kind;
        this.name = "AiError";
    }
}

const PROMPTS = {
    explain: "Explain what this code does, step by step, in clear plain language.",
    summarize: "Summarize this code in 2-3 sentences.",
    improve: "Suggest concrete improvements to this code.",
};

export async function explainCode(opts: {
    apiKey: string;
    code: string;
    language: string;
    action: "explain" | "summarize" | "improve";
}): Promise<string> {
    let res: Response;
    try {
        res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${opts.apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a senior engineer reviewing code." },
                    {
                        role: "user",
                        content: `${PROMPTS[opts.action]}\n\n\`\`\`${opts.language}\n${opts.code}\n\`\`\``,
                    },
                ],
            }),
        });
    } catch {
        throw new AiError("network", "Network error. Check your connection.");
    }

    if (!res.ok) {
        let code = "";
        let message = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            code = body?.error?.code ?? body?.error?.type ?? "";
            message = body?.error?.message ?? message;
        } catch {

        }

        if (res.status === 401) throw new AiError("auth", "Invalid API key. Update it in Settings.");
        if (code === "insufficient_quota")
            throw new AiError("insufficient_quota", "Your OpenAI account is out of credits.");
        if (res.status === 429) throw new AiError("rate_limit", "Rate limit reached. Try again shortly.");
        throw new AiError("unknown", message);
    }

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (!text) throw new AiError("unknown", "Empty response from AI.");
    return text;
}