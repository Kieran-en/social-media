import React, { useState, useEffect } from 'react';
import '../Styles/Quotes.css';

const RandomQuote = () => {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    let isMounted = true; // 🔐 flag de montage

    const fetchNewQuote = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
          headers: {
            'X-Api-Key': '8QzcI2IVrv0oHna/VouZdw==n1nQd4RAYLGi5KNb',
          },
        });
        const data = await response.json();
        if (isMounted && data.length > 0) {
          setQuote(data[0]);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erreur lors de la récupération de la citation :', error);
        }
      }
    };

    fetchNewQuote(); // première citation immédiate
    const interval = setInterval(fetchNewQuote, 120000); // toutes les 2 minutes

    return () => {
      isMounted = false;      // 🔁 empêche setState après démontage
      clearInterval(interval); // 🧹 nettoyage de l'intervalle
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
