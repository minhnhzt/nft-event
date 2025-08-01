const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

// Kết nối tới Solana Devnet
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

// Tạo keypair cho mint authority (trong thực tế nên lưu trong .env)
let mintAuthority;
try {
  const keypairFile = path.join(__dirname, '../../keypair.json');
  if (fs.existsSync(keypairFile)) {
    const keypairData = JSON.parse(fs.readFileSync(keypairFile, 'utf8'));
    mintAuthority = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(keypairData));
  } else {
    mintAuthority = solanaWeb3.Keypair.generate();
    fs.writeFileSync(keypairFile, JSON.stringify(Array.from(mintAuthority.secretKey)));
  }
} catch (error) {
  console.error('Error loading keypair:', error);
  mintAuthority = solanaWeb3.Keypair.generate();
}

// Hàm mint NFT thực tế trên Solana Devnet
async function mintNFT({ toPublicKey, metadataUrl, name, symbol }) {
  try {
    // Tạo mint account
    const mint = solanaWeb3.Keypair.generate();
    
    // Tạo metadata cho NFT
    const metadata = {
      name: name || 'NFT Event Certificate',
      symbol: symbol || 'CERT',
      uri: metadataUrl || 'https://example.com/metadata.json',
    };

    // Tạo mint instruction
    const mintInstruction = splToken.createMint(
      connection,
      mintAuthority,
      mintAuthority.publicKey,
      null,
      0,
      mint
    );

    // Tạo associated token account
    const associatedTokenAccount = await splToken.getAssociatedTokenAddress(
      mint.publicKey,
      new solanaWeb3.PublicKey(toPublicKey)
    );

    // Tạo associated token account instruction
    const createAtaInstruction = splToken.createAssociatedTokenAccountInstruction(
      mintAuthority.publicKey,
      associatedTokenAccount,
      new solanaWeb3.PublicKey(toPublicKey),
      mint.publicKey
    );

    // Tạo mint to instruction
    const mintToInstruction = splToken.createMintToInstruction(
      mint.publicKey,
      associatedTokenAccount,
      mintAuthority.publicKey,
      1
    );

    // Tạo transaction
    const transaction = new solanaWeb3.Transaction().add(
      mintInstruction,
      createAtaInstruction,
      mintToInstruction
    );

    // Lấy recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = mintAuthority.publicKey;

    // Sign và send transaction
    transaction.sign(mintAuthority, mint);
    const signature = await connection.sendTransaction(transaction, [mintAuthority, mint]);

    // Đợi confirmation
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      success: true,
      txHash: signature,
      mintAddress: mint.publicKey.toString(),
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Hàm lấy SOL balance
async function getSolBalance(publicKey) {
  try {
    const balance = await connection.getBalance(new solanaWeb3.PublicKey(publicKey));
    return balance / solanaWeb3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    return 0;
  }
}

// Hàm airdrop SOL cho testing (chỉ dùng trên devnet)
async function airdropSol(publicKey, amount = 1) {
  try {
    const signature = await connection.requestAirdrop(
      new solanaWeb3.PublicKey(publicKey),
      amount * solanaWeb3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature, 'confirmed');
    return { success: true, signature };
  } catch (error) {
    console.error('Error airdropping SOL:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  connection,
  mintNFT,
  getSolBalance,
  airdropSol,
  mintAuthority: mintAuthority.publicKey.toString(),
}; 