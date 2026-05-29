"use client";

import { useRef, useState } from "react";

type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; inserted: number }
  | { status: "error"; message: string };

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setState({ status: "error", message: "Please select a CSV file." });
      return;
    }

    setState({ status: "loading" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as
        | { inserted: number }
        | { error: string };

      if (!res.ok || "error" in json) {
        setState({
          status: "error",
          message: "error" in json ? json.error : `HTTP ${res.status}`,
        });
        return;
      }
      setState({ status: "success", inserted: json.inserted });
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Upload meter readings
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Upload a{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
            .csv
          </code>{" "}
          file with columns{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
            read_at, kind, value, unit
          </code>
          . Readings are attributed to the demo account.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          required
          className="rounded border px-3 py-2 text-sm file:mr-3 file:rounded file:border file:px-2 file:py-1 file:text-xs file:font-medium"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="rounded border px-3 py-2 font-medium disabled:opacity-50"
        >
          {state.status === "loading" ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {state.status === "success" && (
        <p className="mt-4 text-sm text-green-700 dark:text-green-400">
          Successfully inserted {state.inserted} reading
          {state.inserted !== 1 ? "s" : ""}.
        </p>
      )}
      {state.status === "error" && (
        <p className="mt-4 text-sm text-red-600">{state.message}</p>
      )}
    </main>
  );
}
