import { useState } from "react";
import api from "../api/AxiosInstance";
import { toast, ToastContainer, Bounce } from "react-toastify";

export default function ContactMePage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement & {
      name: HTMLInputElement;
      email: HTMLInputElement;
      subject: HTMLInputElement;
      message: HTMLTextAreaElement;
    };

    try {
      setIsLoading(true);
      await api.post("/api/contact", {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
      });
      toast.success(
        <p className="font-extrabold text-center text-lg px-4">Message sent!</p>,
        { position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce }
      );
      form.reset();
    } catch (err) {
      toast.error(
        <p className="font-extrabold text-center text-lg px-4">Failed to send message.</p>,
        { position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="max-w-lg mx-auto px-4 py-16">
        <h1 className="font-extrabold text-2xl underline text-center tracking-wide mb-2">
          CONTACT
        </h1>
        <p className="text-center text-sm text-black/40 mb-8">
          Inquiries, commissions, or just to say hello.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-sm font-semibold">Name</label>
              <input
                type="text"
                name="name"
                required
                className="block w-full border border-black/20 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                required
                className="block w-full border border-black/20 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              required
              className="block w-full border border-black/20 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold">Message</label>
            <textarea
              name="message"
              required
              rows={6}
              className="block w-full border border-black/20 rounded px-3 py-2 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="button-spcl w-full py-3"
          >
            {isLoading ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      </div>
    </>
  );
}
