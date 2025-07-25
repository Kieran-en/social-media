import React, { useState, useEffect } from 'react';
import '../Styles/Quotes.css';

const RandomQuote = () => {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchNewQuote = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
          headers: {
            'X-Api-Key': '8QzcI2IVrv0oHna/VouZdw==n1nQd4RAYLGi5KNb',
          },
        });
        const data = await response.json();

        if (isMounted && data.length > 0) {
          // Pick the first quote with 24 words or fewer
          const validQuote = data.find(
            (q) => q.quote.split(/\s+/).length <= 24
          );

          if (validQuote) {
            setQuote(validQuote);
          } else {
            setQuote({ quote: 'No short quote found this time.', author: '' });
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erreur lors de la récupération de la citation :', error);
        }
      }
    };

    fetchNewQuote(); // Fetch immediately
    const interval = setInterval(fetchNewQuote, 120000); // Refresh every 2 minutes

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="quote-container">
        <h3 className="calendar-title">Citation du moment</h3>
        <p className="quote-text">"{quote.quote || 'Chargement...'}"</p>
        <div className="quote-line" />
        <p className="quote-author">{quote.author}</p>
      </div>
    </div>
  );
};

export default RandomQuote;
