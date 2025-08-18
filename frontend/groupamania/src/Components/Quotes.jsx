import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const RandomQuote = () => {
  const [quote, setQuote] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewQuote = async () => {
    setIsLoading(true);
    try {
      let data;
      let attempts = 0;

      do {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
          headers: {
            'X-Api-Key': '8QzcI2IVrv0oHna/VouZdw==n1nQd4RAYLGi5KNb',
          },
        });
        data = await response.json();
        attempts++;
      } while (
          data.length === 0 ||
          data[0].quote.split(' ').length > 30 &&
          attempts < 5
          );

      if (data.length > 0) {
        setQuote(data[0]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la citation :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchNewQuote();
    }

    const interval = setInterval(() => {
      if (isMounted) {
        fetchNewQuote();
      }
    }, 120000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800">Quote of the Day</h3>
          </div>
          <button
              onClick={fetchNewQuote}
              disabled={isLoading}
              className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 group"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 group-hover:text-blue-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200 opacity-50" />
          <p className="text-gray-700 italic leading-relaxed pl-6 min-h-[60px]">
            {quote.quote || 'Loading inspiration...'}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-600 text-right">
            — {quote.author || 'Anonymous'}
          </p>
        </div>
      </div>
  );
};

export default RandomQuote;