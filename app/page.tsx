'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Inserisci del testo');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.analysis);
      } else {
        alert('Errore: ' + data.error);
      }
    } catch (error) {
      alert('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          🔍 Detector per Chi Mente
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Analizza il testo con l&apos;intelligenza artificiale
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Inserisci il testo da analizzare..."
          className="w-full min-h-[150px] p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-y"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full mt-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Analisi in corso...' : 'Analizza'}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Risultato</h2>
            
            <div className="mb-6">
              <span className="text-gray-700 font-semibold">Credibilità: </span>
              <span className="text-3xl font-bold text-purple-600">
                {result.credibility_score}/100
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Indicatori:</h3>
              {result.indicators.map((indicator: string, i: number) => (
                <p key={i} className="text-gray-700 mb-1">• {indicator}</p>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Domande suggerite:</h3>
              {result.questions.map((question: string, i: number) => (
                <p key={i} className="text-gray-700 mb-1">• {question}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
