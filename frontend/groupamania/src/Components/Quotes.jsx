import React, { useState, useEffect } from 'react';
import '../Styles/Quotes.css'; // Si tu veux séparer encore plus les styles

const RandomQuote = () => {
  const [quote, setQuote] = useState({});

  const fetchNewQuote = async () => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        headers: {
          'X-Api-Key': '8QzcI2IVrv0oHna/VouZdw==n1nQd4RAYLGi5KNb',
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        setQuote(data[0]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la citation :', error);
    }
  };

  useEffect(() => {
    fetchNewQuote();
    const interval = setInterval(fetchNewQuote, 120000); // toutes les 2 minutes
    return () => clearInterval(interval);
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
