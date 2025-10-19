import { useEffect, useState } from "react";
import CustomModal from "./Modal";

interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
  selectedToken?: Token | null;
}

export default function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  tokens,
  selectedToken,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(""); // Reset search when modal opens
  }, [isOpen]);

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Select Token">
      <input
        type="text"
        placeholder="Search token..."
        className="w-full p-2 mb-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="max-h-64 overflow-y-auto">
        {filteredTokens.length > 0 ? (
          filteredTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => {
                onSelect(token);
                onClose();
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                selectedToken?.address === token.address
                  ? "bg-gray-700/50"
                  : "hover:bg-gray-700/50"
              }`}
            >
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-white">{token.name}</p>
                <p className="text-xs text-gray-400">{token.symbol}</p>
              </div>
            </button>
          ))
        ) : (
          <p className="p-3 text-gray-400">No tokens found</p>
        )}
      </div>
    </CustomModal>
  );
}