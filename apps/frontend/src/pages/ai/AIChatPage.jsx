import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader } from 'lucide-react'
import apiClient from '../../services/api'

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m your AI Medical Assistant. How can I help you today? You can ask me about symptoms, medications, or general health questions.',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!inputMessage.trim()) return

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsTyping(true)

        try {
            // Call AI service
            const response = await apiClient.post('/ai/chat', {
                message: inputMessage,
                conversationHistory: messages.map(m => ({
                    role: m.type === 'user' ? 'user' : 'assistant',
                    content: m.content
                }))
            })

            // Add bot response
            const botMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: response.data.response || 'I apologize, but I couldn\'t process that request. Please try again.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            // Add error message
            const errorMessage = {
                id: messages.length + 2,
                type: 'bot',
                content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center">
                        <Bot className="w-8 h-8 text-primary-600 mr-3" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">AI Medical Assistant</h1>
                            <p className="text-gray-600 mt-1">Ask me anything about health and medical topics</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-primary-600' : 'bg-green-600'
                                            }`}>
                                            {message.type === 'user' ? (
                                                <User className="w-6 h-6 text-white" />
                                            ) : (
                                                <Bot className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div>
                                        <div className={`rounded-lg px-4 py-3 ${message.type === 'user'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 px-1">
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                                            <Bot className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !inputMessage.trim()}
                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isTyping ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            AI responses are for informational purposes only. Always consult a healthcare professional.
                        </p>
                    </div>
                </div>

                {/* Quick Suggestions */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            'What are the symptoms of diabetes?',
                            'How can I improve my sleep quality?',
                            'What should I know about high blood pressure?',
                            'Explain common side effects of antibiotics'
                        ].map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => setInputMessage(suggestion)}
                                className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm text-gray-700"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AIChatPage
