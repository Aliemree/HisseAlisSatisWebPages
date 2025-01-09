import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WalletPage.css";

const WalletPage = () => {
  const [wallets, setWallets] = useState([]); // Kullanıcının wallet verileri
  const [userId, setUserId] = useState(null); // /api/users/me'den alınan kullanıcı ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Kullanıcı ID'yi almak için /api/users/me isteği
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. User not authenticated.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const fetchedUserId = res.data.id; // API'den kullanıcı ID'sini al
        setUserId(fetchedUserId);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2) /api/wallets?populate=* çağrısı ile wallet verilerini çek
  useEffect(() => {
    if (!userId) return; // userId yoksa wallet isteğini yapma

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    axios
      .get("http://localhost:1337/api/wallets?populate=*", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Gelen wallet verileri
        const fetchedWallets = response.data.data || [];
        // Sadece kullanıcı ID'si eşleşen wallet'ları filtrele
        const userWallets = fetchedWallets.filter(
          (wallet) => wallet.attributes.users_permissions_user.data.id === userId
        );
        setWallets(userWallets);
      })
      .catch((err) => {
        console.error("Error fetching wallet data:", err);
        setError("Failed to load wallet data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading wallet...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="wallet-container">
      <h1>Wallet Page</h1>

      {/* Wallet Listesi */}
      {wallets.length === 0 ? (
        <div>No wallet data for this user.</div>
      ) : (
        <ul className="wallet-list">
          {wallets.map((item) => {
            const relatedUserId = item.attributes?.users_permissions_user?.data?.id || "N/A";
            const username = item.attributes?.users_permissions_user?.data?.attributes?.username || "Unknown";
            const balance = item.attributes?.balance || "0";

            return (
              <li key={item.id} className="wallet-item">
                <p>
                  <strong>User ID:</strong> {relatedUserId}
                </p>
                <p>
                  <strong>Username:</strong> {username}
                </p>
                <p>
                  <strong>Balance:</strong> {balance}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WalletPage;