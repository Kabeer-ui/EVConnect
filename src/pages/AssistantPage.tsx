import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { assistantService } from '../services/assistantService';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, Zap, ArrowRight, CornerDownLeft, Info } from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const suggestionChips = [
    'Find a fast charger near me',
    "What's my upcoming booking?",
    'Which charger is closest?',
    'Book the best available charger',
    'Show my booking history'
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    isInitialMount.current = true;
    async function init() {
      const initial = await assistantService.getInitialMessages();
      setMessages(initial);

      // If came with query from home page
      if (initialQuery) {
        handleSendPrompt(initialQuery);
      }
    }
    init();
  }, [initialQuery]);

  useEffect(() => {
    // Prevent the entire page from scrolling down when first opening
    if (isInitialMount.current) {
      if (messages.length > 0) {
        isInitialMount.current = false;
      }
      return;
    }

    // Scroll only the chat conversation container to the latest message without forcing the page down
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await assistantService.sendMessage(textToSend);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Failed to get assistant response', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(inputVal);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F8FAF9] flex flex-col overflow-x-hidden">
      {/* Top Copilot Bar */}
      <div className="bg-white border-b border-neutral-200 py-4 px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#062D24] text-emerald-300 flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#062D24] font-display truncate">
                EVConnect Assistant
              </h1>
              <p className="text-xs text-neutral-500 truncate">
                Your charging copilot · Context-aware routing &amp; bay status
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Copilot Active</span>
          </div>
        </div>
      </div>

      {/* Notice about architecture & demo context */}
      <div className="bg-emerald-900/5 border-b border-emerald-950/5 py-2 px-4 text-center shrink-0">
        <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>EVConnect Copilot demo interface. Operating with local sample station and booking state.</span>
        </p>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between overflow-hidden min-w-0">
        
        {/* Messages Scroll Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 min-w-0"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 min-w-0 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#062D24] text-emerald-300 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-xl min-w-0 space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm break-words ${
                      isUser
                        ? 'bg-[#062D24] text-white rounded-tr-none'
                        : 'bg-white text-neutral-800 border border-neutral-200/90 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Recommendation cards inside assistant message if present */}
                    {msg.stationRecommendations && msg.stationRecommendations.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-neutral-100">
                        {msg.stationRecommendations.map((st) => (
                          <div
                            key={st.id}
                            className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs gap-2 min-w-0"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-neutral-900 block truncate">{st.name}</span>
                              <span className="text-[11px] text-neutral-500 truncate block">
                                {st.distanceKm} km · {st.chargingSpeed} · {st.availableConnectors} bays free
                              </span>
                            </div>
                            <Link
                              to={`/booking/${st.id}`}
                              className="px-3 py-1.5 rounded-xl bg-[#062D24] text-emerald-300 font-semibold text-xs hover:bg-[#0A3D31] shrink-0"
                            >
                              Book
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action link button */}
                    {msg.actionLink && (
                      <div className="mt-3 pt-2 border-t border-neutral-100">
                        <Link
                          to={msg.actionLink.href}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                        >
                          <span>{msg.actionLink.text}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-neutral-400 px-1 block">
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    AR
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-[#062D24] text-emerald-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-neutral-200 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips with overflow containment */}
        <div className="py-2.5 w-full overflow-x-auto text-xs shrink-0 no-scrollbar">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(chip)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 whitespace-nowrap transition-colors shadow-xs active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="mt-1 relative shrink-0 w-full">
          <input
            type="text"
            placeholder="Ask about fast charging hubs, upcoming bookings, or compatibility..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white border border-neutral-200 shadow-sm text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#062D24] hover:bg-[#0A3D31] text-emerald-300 flex items-center justify-center transition-colors disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
