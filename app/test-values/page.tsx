'use client';

import { useWalletData } from '../../src/hooks/useWalletData';
import { useState } from 'react';

export default function TestValuesPage() {
  const [address, setAddress] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
  const { portfolio, transactions, stats, isLoading, error } = useWalletData(address);

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Test Values</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter wallet address"
        />
      </div>

      {isLoading && <div>Loading...</div>}
      
      {error && (
        <div className="text-red-500 mb-4">
          Error: {error.message}
        </div>
      )}

      {portfolio?.data && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Portfolio Data</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(portfolio.data, null, 2)}
          </pre>
        </div>
      )}

      {transactions?.data && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Transactions Data</h2>
          <p>Total transactions fetched: {transactions.data.pages.flatMap(page => page.transactions).length}</p>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(transactions.data.pages[0]?.transactions?.slice(0, 3), null, 2)}
          </pre>
        </div>
      )}

      {stats?.data && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Stats Data</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(stats.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
