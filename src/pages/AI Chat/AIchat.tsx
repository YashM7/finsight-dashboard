import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_API_BASE_URL;

export default function AIchat() {
  const [firstNameInitial, setFirstNameInitial] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(`${BACKEND_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFirstNameInitial(response.data.firstName.charAt(0).toUpperCase());
      } catch (error) {
        console.error("Error fetching user details", error);
        toast.error("You have been logged out because of inactivity.");
        setTimeout(function () {
          // clear chat history on logout
          localStorage.removeItem("chatMessages");
          window.location.href = `${FRONTEND_URL}/signin`;
        }, 4000);
      }
    };
    fetchUserDetails();
  }, []);

  // ✅ Load chat history from localStorage
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "bot",
            text: "👋 Hi! I'm your FinSight AI Assistant. How can I help you today?",
          },
        ];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    const userMessage = input;
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}/ai/user-question`,
        { question: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add bot response
      setMessages((prev) => [...prev, { role: "bot", text: response.data }]);
    } catch (error) {
      console.error("AI API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Oops! Something went wrong while fetching AI response.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div>
      <PageMeta title="AI Chat" description="This is FinSight AI Chat page" />
      <PageBreadcrumb pageTitle="AI Chatbot" />

      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              FinSight AI Assistant
            </h1>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </div>
          </div>
          <button
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            <i className="fas fa-moon"></i>
          </button>
        </header>

        {/* Chat area */}
        <div
          id="chat-container"
          className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-slate-800 space-y-4"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 animate-fadeIn ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              
              {msg.role === "bot" && (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    AI
                  </div>
                  <div className="max-w-[70%] px-4 py-2 rounded-xl shadow-sm text-sm leading-relaxed bg-gray-200 dark:bg-slate-700 dark:text-white rounded-tl-none">
                    {msg.text}
                  </div>
                </>
              )}

              
              {msg.role === "user" && (
                <>
                  <div className="max-w-[70%] px-4 py-2 rounded-xl shadow-sm text-sm leading-relaxed bg-indigo-500 text-white rounded-tr-none">
                    {msg.text}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md bg-gradient-to-r from-pink-400 to-pink-600 text-white">
                    {firstNameInitial}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                AI
              </div>
              <div className="flex gap-2 bg-gray-200 dark:bg-slate-700 rounded-xl px-4 py-2">
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                <span className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-xl px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isTyping ? "Please wait..." : "Type your message..."}
              disabled={isTyping}
              className="flex-1 bg-transparent border-none outline-none px-2 py-1 text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              aria-label="Attach file"
            >
              <i className="fas fa-paperclip"></i>
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              aria-label="Voice input"
            >
              <i className="fas fa-microphone"></i>
            </button>
            <button
              onClick={handleSend}
              disabled={isTyping}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
            >
              <span>Send</span>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
