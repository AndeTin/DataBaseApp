import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './TrailInfo.css'; // Import the CSS file

function TrailInfo() {
  const { id } = useParams();
  const [trailData, setTrailData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/trail/${id}`);
        setTrailData(response.data);
      } catch (error) {
        console.error('Error fetching trail data:', error);
      }
    };

    fetchTrailData();
  }, [id]);

  if (!trailData) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="TrailInfo">
      <div className="button-container">
        <button onClick={handleGoBack}>回到列表</button>
        <button onClick={handleGoHome}>首頁</button>
      </div>
      <h1>{trailData.tr_cname}</h1>
      <div className="trail-details">
        <p>步道名稱: {trailData.tr_cname}</p>
        <p>所屬城市: {trailData.city}</p>
        <p>所屬區域: {trailData.district}</p>
        <p>步道長度: {trailData.tr_length}</p>
        <p>海拔高度: {trailData.tr_alt}</p>
        <p>最低海拔: {trailData.tr_alt_low}</p>
        <p>步道許可: {trailData.tr_permit_stop}</p>
        <p>鋪面狀況: {trailData.tr_pave}</p>
        <p>難度等級: {trailData.tr_dif_class}</p>
        <p>旅遊時長: {trailData.tr_tour}</p>
        <p>最佳季節: {trailData.tr_best_season}</p>
      </div>
    </div>
  );
}

export default TrailInfo;
