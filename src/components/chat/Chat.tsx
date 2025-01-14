import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaFile, FaImage, FaThumbsUp, FaThumbsDown, FaClipboard } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('chatGpt3.5');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { accountId } = useParams(); // Get accountId from URL params

  const { mutate: askQuestion } = useMutation({
    mutationFn: async (question: string) => {
      const response = await axios.post(`http://localhost:8080/assist-genie-ai/api/v1/account/${accountId}/conversation/${conversationId}`, {
        question,
        model: { name: 'openAi', version: model },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResponse(data.feedback);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    }
  });

  const handleSubmit = () => {
    if (!question.trim()) return;

    setLoading(true);
    askQuestion(question);
    setQuestion('');
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 bg-blue-600 text-white text-xl flex justify-between items-center">
        <h1>{!question ? 'What can I help with?' : ''}</h1>
        <button className="btn" onClick={() => { /* Trigger start new chat */ }}>Start New Chat</button>
      </header>

      <div className="flex flex-1">
        <div className="w-full flex flex-col justify-end">
          {/* User Question */}
          <div className="flex items-center">
            <div className="flex-1">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-20 p-2 border border-gray-300"
                placeholder="Ask something..."
                disabled={loading}
              />
            </div>
            <div className="flex space-x-4">
              <button><FaFile /></button>
              <button><FaImage /></button>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="border p-2"
              >
                <option value="chatGpt3.5">ChatGPT 3.5</option>
                <option value="chatGpt4">ChatGPT 4</option>
                <option value="gemini1.5">Gemini 1.5</option>
                <option value="geminiUltra">Gemini Ultra</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col space-y-2">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="flex">
                <div className="flex-1 text-left">{question}</div>
                <div className="flex-1 text-right">{response}</div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback actions */}
        <div className="flex space-x-4">
          <button><FaThumbsUp /></button>
          <button><FaThumbsDown /></button>
          {/* <button><FaRefresh /></button> */}
          <button><FaClipboard /></button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
