"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

const ChatApp = () => {
  interface Message {
    role: string;
    content: string;
    timestamp: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);

        setIsLoading(true);
        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          setInputValue(data.text);
        } catch (error) {
          console.error("Error transcribing audio:", error);
        }
        setIsLoading(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                Chill Guy
              </h1>
              <p className="text-sm text-gray-600 text-center">
                Your relaxed and easygoing assistant
              </p>
            </div>

            <ScrollArea className="h-[60vh] pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-purple-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {message.role === "user" ? "U" : "AI"}
                        </div>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-4 flex items-center space-x-2">
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                className="flex-shrink-0"
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue.trim()}
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatApp;
