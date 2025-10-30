import { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { backendAPI } from '../api';
import { useAccount } from 'wagmi';

ChartJS.register(ArcElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface PortfolioHolding {
  token: string;
  amount: string;
  valueUSD: number;
  pnl24h: number;
}

export default function PortfolioTracker() {
  const { address } = useAccount();
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [pnlHistory, setPnlHistory] = useState<number[]>([]);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      if(address){
          const [holdingsData, pnlData] = await Promise.all([
            backendAPI.getTokenBalances(address), 
            backendAPI.getPortfolioPnL(address, 7), 
          ]);
          setHoldings(holdingsData); 
          setPortfolioValue(holdingsData.reduce((sum: any, h: any) => sum + h.valueUSD, 0));
          setPnlHistory(pnlData); 
      }
    } catch (err) {
      console.error('Portfolio fetch failed:', err);
    }
  };

  // Pie chart for allocation
  const pieData = {
    labels: holdings.map(h => h.token),
    datasets: [{
      data: holdings.map(h => h.valueUSD),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }],
  };

  // Line chart for PnL
  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Portfolio Value',
      data: pnlHistory,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }],
  };

  const totalPnL24h = holdings.reduce((sum, h) => sum + h.pnl24h, 0);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Portfolio Tracker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Value & PnL */}
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-lg">Total Value</p>
          <p className="text-3xl font-bold">${portfolioValue.toFixed(2)}</p>
          <p className={`text-lg ${totalPnL24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            24h PnL: {totalPnL24h >= 0 ? '+' : ''}${totalPnL24h.toFixed(2)}
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-lg mb-2">Asset Allocation</p>
          <Pie data={pieData} />
        </div>

        {/* Line Chart */}
        <div className="bg-gray-700 p-4 rounded md:col-span-2">
          <p className="text-lg mb-2">7-Day Performance</p>
          <Line data={lineData} />
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Insights</h3>
        <ul className="space-y-2">
          {holdings.map(h => (
            <li key={h.token}>
              <span className={`font-semibold ${h.pnl24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {h.token}: {h.pnl24h >= 0 ? '+' : ''}{h.pnl24h.toFixed(2)}%
              </span>
              <span className="text-gray-400 ml-2">({h.valueUSD.toFixed(2)} USD)</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {/* going to add function to rebalance here */}}
        >
          Rebalance Portfolio
        </button>
      </div>
    </div>
  );
}