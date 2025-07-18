import { useChat } from '@ai-sdk/react'
import { ChatForm, ChatMessages } from "@/components/ui/chat"
import { MessageList } from '../ui/message-list'
import { MessageInput } from '../ui/message-input'
import { useEffect, useRef, useState } from "react"

export function ChatDemo() {
  const { messages, input, handleInputChange, status, stop, setMessages } = useChat()
  const [isLoading, setIsLoading] = useState(false)
  const loading = status === "submitted" || status === "streaming"

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length === 0 && setMessages) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant" as const,
          content: "Bonjour ! Comment puis-je vous aider ?"
        }
      ])
    }
  }, [messages, setMessages])


  const lastMessage = messages.at(-1)
  const isTyping = lastMessage?.role === "user" && (loading || isLoading)

  const onSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()

    if (!input.trim()) return

    const currentInput = input.trim()
    setIsLoading(true)

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: currentInput,
    }

    if (setMessages) {
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage
      ])
    }

    handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)

    ;(async () => {
      try {
        const response = await fetch("http://localhost:3000/conseil", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requete: currentInput }),
          credentials: "include"
        })

        if (!response.ok) throw new Error("Erreur API")

        const data = await response.json()
        console.log("Réponse API:", data)

        if (setMessages) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: `api-response-${Date.now()}`, 
              role: "assistant" as const,
              content: data.reponse || JSON.stringify(data), 
            }
          ])
        }

      } catch (error) {
        console.error(error)

        if (setMessages) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: `error-${Date.now()}`,
              role: "assistant" as const,
              content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
            }
          ])
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages}>
          <MessageList messages={messages} isTyping={isTyping} />
          <div ref={messagesEndRef} />
        </ChatMessages>
      </div>

      <ChatForm
        className="bg-white border-t p-2"
        handleSubmit={onSubmit}
        isPending={loading || isLoading}
      >
        {({ files, setFiles }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            files={files}
            setFiles={setFiles}
            stop={stop}
            isGenerating={loading || isLoading}
          />
        )}
      </ChatForm>
    </div>
  )
}

export default ChatDemo
