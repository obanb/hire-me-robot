'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, ArrowUpIcon, QuestionMarkCircleIcon, ArrowDownIcon, GlobeAltIcon} from '@heroicons/react/solid';

import { Button } from '@nextui-org/react';
import Logo from '../images/avatar_boss.png';
import Girl from '../images/girl1.png';
import Image from 'next/image';
import { UserContext } from '../hooks/userContext';
import { useSession } from 'next-auth/react';
import { useWebSocket } from "../hooks/useWebSocket";

const ChatWindow = () => {
    const [user, setUser] = useContext(UserContext) as any;
    const [input, setInput] = useState('');
    const [userIsTyping, setUserIsTyping] = useState(false);
    const [newMessageId, setNewMessageId] = useState<number | null>(null);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const firstMessageRef = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const { sendMessage, messages, questionRequest } = useWebSocket('ws://localhost:3000/agent/ws', 'handshake_token');

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current!.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (newMessageId !== null) {
            const timeout = setTimeout(() => {
                setNewMessageId(null);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [newMessageId]);

    const handleSendMessage = () => {
        if (input.trim() !== '') {
            const newMsg = { id: messages.length + 1, text: input };
            sendMessage(input);
            setInput('');
            setUser(input);
            setUserIsTyping(false);
            setNewMessageId(newMsg.id);
        }
    };

    const handleNextQuestion = () => {
        if (input.trim() !== '') {
            const newMsg = { id: messages.length + 1, text: input };
            sendMessage(input);
            setInput('');
            setUser(input);
            setUserIsTyping(false);
            setNewMessageId(newMsg.id);
        }
    };

    const handleScrollToTop = () => {
        if (firstMessageRef.current) {
            firstMessageRef.current!.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToLast = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current!.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
        setUserIsTyping(true);
    };

    const session = useSession();

    // Light theme styles
    const themeClass = 'bg-gray-50 text-gray-800';
    const messageBgClass = 'bg-white text-gray-800 border border-gray-200 shadow-sm'; // Light message background with borders
    const buttonColorClass = 'bg-blue-400 hover:bg-blue-500 text-white'; // Soft blue button

    return (
        <div className={`flex flex-col h-full ${themeClass} rounded-lg shadow-md p-6`}>
            <div
                className="flex-grow overflow-y-auto mb-4"
                ref={chatContainerRef}
            >
                <div className="flex justify-between items-center mb-2">
                    <button
                        onClick={handleScrollToLast}
                        className={`${buttonColorClass} flex items-center gap-2 rounded-md shadow-md px-4 py-2`}
                    >
                        <ArrowDownIcon className="w-5 h-5" />
                        Scroll to Last
                    </button>
                </div>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            ref={index === messages.length - 1
                                ? lastMessageRef
                                : (index === 0
                                    ? firstMessageRef
                                    : null)}
                            className={`flex items-start ${messageBgClass} p-4 rounded-lg shadow-md transition-all duration-500 ${
                                newMessageId === index + 1 ? 'bg-yellow-100' : ''
                            }`}
                        >
                            <Image
                                src={Girl}
                                alt="User Avatar"
                                className="w-10 h-10 mr-3 rounded-full border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="break-words whitespace-pre-wrap overflow-hidden">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="text-gray-500 text-sm italic mt-2 h-5">
                        {userIsTyping ? (
                            <span>User is typing...</span>
                        ) : (
                            <span></span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className={`flex-grow flex-shrink min-w-0 p-3 ${messageBgClass} border rounded-lg resize-none overflow-hidden`}
                    rows={1}
                    onBlur={() => setUserIsTyping(false)}
                />
                <div className="flex gap-4">
                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        className={`${buttonColorClass} flex items-center gap-2 rounded-md shadow-md px-6 py-2`}
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Send
                    </button>

                    {/* Scroll to Top Button */}
                    <button
                        onClick={handleScrollToTop}
                        className={`${buttonColorClass} flex items-center gap-2 rounded-md shadow-md px-4 py-2`}
                    >
                        <ArrowUpIcon className="w-5 h-5" />
                        Scroll to Top
                    </button>

                    {/* Get Next Question Button */}
                    <button
                        onClick={questionRequest}
                        className={`${buttonColorClass} flex items-center gap-2 rounded-md shadow-md px-4 py-2`}
                    >
                        <QuestionMarkCircleIcon className="w-5 h-5" />
                        Get next question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;