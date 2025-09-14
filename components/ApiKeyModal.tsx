
import React, { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

const ApiKeyModal: React.FC = () => {
    const { setApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen } = useApiKey();
    const [keyInput, setKeyInput] = useState('');

    if (!isApiKeyModalOpen) {
        return null;
    }

    const handleSave = () => {
        if (keyInput.trim()) {
            setApiKey(keyInput.trim());
            setIsApiKeyModalOpen(false);
            setKeyInput('');
        }
    };

    const handleClose = () => {
        setIsApiKeyModalOpen(false);
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-gray-100 rounded-2xl shadow-neumorphic w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">AI Service Configuration</h3>
                    <button onClick={handleClose} className="text-2xl p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Close">&times;</button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Please enter your Google Gemini API key. This is required for all AI-powered features. You can get one from Google AI Studio. Your key is stored securely in your browser's local storage and is never sent to our servers.
                </p>
                <div>
                    <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-600 mb-1">Google Gemini API Key</label>
                    <input
                        id="apiKeyInput"
                        type="password"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Enter your API Key..."
                        className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg shadow-neumorphic-sm-inset focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-brand-primary text-white font-bold rounded-full shadow-md hover:bg-brand-secondary transform hover:scale-105 transition-all duration-300"
                    >
                        Save and Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
