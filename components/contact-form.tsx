"use client";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black space-y-6 max-w-2xl rounded-s-2xl mx-auto p-6"
    >
      <h2 className="text-teal-500 font-bold font-mono text-xl">
        Send some appreciation <span className="text-3xl">🤗</span>
      </h2>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-900 
                     text-neutral-100 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-900 
                     text-neutral-100 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-neutral-300"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-900 
                     text-neutral-100 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white
                 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500
                 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && (
        <p className=" text-center">Message sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-center">
          Failed to send message. Please try again.
        </p>
      )}
    </form>
  );
}
