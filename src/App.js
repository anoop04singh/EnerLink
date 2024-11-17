// Note: Requires the following dependencies:
// npm install aptos lucide-react @/components/ui/card
import React, { useState, useEffect } from 'react';
import { AptosClient, AptosAccount, HexString, FaucetClient } from "aptos";
import { Battery, Zap, StopCircle, Power, Key, Plus } from 'lucide-react';


const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const MODULE_ADDRESS = "0xdb0538df56fa2a4e262fccf4d0c6a4a0aa4c9ed713d1b3b3280dbeb12becf29a";

// Initialize Aptos clients
const aptosClient = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

function App() {
  // State management
  const [account, setAccount] = useState(null);
  const [view, setView] = useState('login');
  const [privateKey, setPrivateKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUtilizing, setIsUtilizing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [generateInterval, setGenerateInterval] = useState(null);
  const [utilizeInterval, setUtilizeInterval] = useState(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (generateInterval) clearInterval(generateInterval);
      if (utilizeInterval) clearInterval(utilizeInterval);
    };
  }, [generateInterval, utilizeInterval]);

  // Account creation function
  const createAccount = async () => {
    try {
      const newAccount = new AptosAccount();
      await faucetClient.fundAccount(newAccount.address(), 100_000_000);
      
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::energy_token::register`,
        type_arguments: [],
        arguments: []
      };
      
      const txnRequest = await aptosClient.generateTransaction(newAccount.address(), payload);
      const signedTxn = await aptosClient.signTransaction(newAccount, txnRequest);
      const txnResult = await aptosClient.submitTransaction(signedTxn);
      await aptosClient.waitForTransaction(txnResult.hash);
      
      setAccount(newAccount);
      setView('dashboard');
      addLog('Account created successfully');
      addLog(`Public Key: ${newAccount.address().hex()}`);
      addLog(`Private Key: ${HexString.fromUint8Array(newAccount.signingKey.secretKey).hex()}`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Login function
  const login = async () => {
    try {
      const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      const privateKeyBytes = new HexString(cleanPrivateKey).toUint8Array();
      const newAccount = new AptosAccount(privateKeyBytes);
      setAccount(newAccount);
      setView('dashboard');
      addLog('Logged in successfully');
      addLog(`Address: ${newAccount.address().hex()}`);
    } catch (err) {
      setError('Invalid private key format. Please check your private key.');
    }
  };

  // Energy generation function
  const generateEnergy = async () => {
    setIsGenerating(true);
    setIsUtilizing(false);
    setError('');
    const interval = setInterval(async () => {
      try {
        const amount = Math.floor(Math.random() * 100) + 50;
        const payload = {
          type: "entry_function_payload",
          function: `${MODULE_ADDRESS}::energy_token::mint`,
          type_arguments: [],
          arguments: [account.address().hex(), amount]
        };
        const txnRequest = await aptosClient.generateTransaction(account.address(), payload);
        const signedTxn = await aptosClient.signTransaction(account, txnRequest);
        const txnResult = await aptosClient.submitTransaction(signedTxn);
        await aptosClient.waitForTransaction(txnResult.hash);
        addLog(`Generated ${amount} energy units - Tokens minted`);
      } catch (err) {
        setError(err.message);
        stopOperations();
      }
    }, 10000);
    setGenerateInterval(interval);
    addLog('Started energy generation');
  };

  // Energy utilization function
  const utilizeEnergy = async () => {
    setIsUtilizing(true);
    setIsGenerating(false);
    setError('');
    const interval = setInterval(async () => {
      try {
        const amount = Math.floor(Math.random() * 50) + 25;
        const payload = {
          type: "entry_function_payload",
          function: `${MODULE_ADDRESS}::energy_token::burn`,
          type_arguments: [],
          arguments: [amount]
        };
        const txnRequest = await aptosClient.generateTransaction(account.address(), payload);
        const signedTxn = await aptosClient.signTransaction(account, txnRequest);
        const txnResult = await aptosClient.submitTransaction(signedTxn);
        await aptosClient.waitForTransaction(txnResult.hash);
        addLog(`Utilized ${amount} energy units - Tokens burned`);
      } catch (err) {
        setError(err.message);
        stopOperations();
      }
    }, 10000);
    setUtilizeInterval(interval);
    addLog('Started energy utilization');
  };

  // Helper functions
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const stopOperations = () => {
    if (generateInterval) {
      clearInterval(generateInterval);
      setGenerateInterval(null);
    }
    if (utilizeInterval) {
      clearInterval(utilizeInterval);
      setUtilizeInterval(null);
    }
    setIsGenerating(false);
    setIsUtilizing(false);
    addLog('Operations stopped');
  };

  // Login view
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">EnerLink</h1>
            <p className="text-gray-600">Tokenizing Energy</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Key className="w-6 h-6" /> Login
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Private Key
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your private key"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                  />
                </div>
                <button
                  onClick={login}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Power className="w-4 h-4" /> Login
                </button>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={createAccount}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create New Account
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                EnerLink Dashboard
              </h1>
              <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg break-all max-w-md">
                {account?.address().hex()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={generateEnergy}
                disabled={isGenerating}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
                  isGenerating
                    ? 'bg-green-100 text-green-800'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } transition-colors`}
              >
                <Zap className="w-5 h-5" />
                {isGenerating ? 'Generating Energy...' : 'Generate Energy'}
              </button>
              
              <button
                onClick={utilizeEnergy}
                disabled={isUtilizing}
                className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
                  isUtilizing
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                <Battery className="w-5 h-5" />
                {isUtilizing ? 'Utilizing Energy...' : 'Utilize Energy'}
              </button>
            </div>

            {(isGenerating || isUtilizing) && (
              <button
                onClick={stopOperations}
                className="w-full mb-6 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <StopCircle className="w-5 h-5" />
                Stop Operations
              </button>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Activity Logs</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white rounded border border-gray-200 text-sm text-gray-700"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;