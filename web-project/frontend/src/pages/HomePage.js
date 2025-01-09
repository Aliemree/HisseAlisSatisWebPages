import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/stocks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStocks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!stocks.length) {
    return <div className="no-stocks">No stocks available.</div>;
  }

  return (
    <div className="stock-container">
      <div className="stocks-list">
        <h2>Stocks</h2>
        {stocks.map((stock) => (
          <div
            className={`stock-item ${selectedStock?.id === stock.id ? "active" : ""}`}
            key={stock.id}
            onClick={() => handleSelectStock(stock)}
          >
            <p className="stock-name">{stock.Name}</p>
            <p className="stock-symbol">Symbol: {stock.Symbol}</p>
          </div>
        ))}
      </div>
      <div className="stock-details">
        {selectedStock ? (
          <>
            <h2>{selectedStock.Name}</h2>
            <p>
              <strong>Symbol:</strong> {selectedStock.Symbol}
            </p>
            <p>
              <strong>Price:</strong> ${selectedStock.Price}
            </p>
            <p>
              <strong>Change:</strong> {selectedStock.Change}%
            </p>
            <div className="actions">
              <button className="buy-btn">Buy</button>
              <button className="sell-btn">Sell</button>
            </div>
          </>
        ) : (
          <p>Select a stock to view details.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
