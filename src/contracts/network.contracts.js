export const localhost = { 
    chainId: '0x7a69',
    chainName: 'localhost',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18, 
    },  
    rpcUrls: [
        'http://localhost:8545/'
    ],  
    blockExplorerUrls: [
        ''
    ],  
}

export const avalanche_fuji = {
    chainId: '0xa869',
    chainName: 'Avalanche Fuji',
    nativeCurrency: {
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18,
    },
    rpcUrls: [
        'https://api.avax-test.network/ext/bc/C/rpc'
    ],
    blockExplorerUrls: [
        'https://testnet.snowtrace.io/'
    ],
}

export const binance = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 8,
    },
    rpcUrls: [
        'https://bsc-dataseed.binance.org/'
    ],
    blockExplorerUrls: [
        'https://bscscan.com'
    ],
}

export const binance_test = {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: [
        'https://data-seed-prebsc-1-s1.binance.org:8545/'
    ],
    blockExplorerUrls: [
        'https://testnet.bscscan.com/'
    ],
}

export default binance_test