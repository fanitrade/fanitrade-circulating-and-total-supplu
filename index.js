const express = require('express')
const app = express()
const solana = require('@solana/web3.js')
const serum = require('@project-serum/common')

const rpcUrl = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com'
const connection = new solana.Connection(rpcUrl)
const provider = new serum.Provider(connection)

const fanitradeMint = new solana.PublicKey('6c4L5nTH2sBKkfeuP3WhGp6Vq1tE4Suh4ezRp5KSu8Z7')
const treasuryTokens = new solana.PublicKey('AUs2r5XCGRAmZnthfTT22CHQ2BGSm1Ra843EM67rB3bF')

app.get('/total', async function(req, res) {
    const mintInfo = await serum.getMintInfo(provider, fanitradeMint)
    const totalSupply = parseInt(mintInfo.supply.toString()) / Math.pow(10, mintInfo.decimals)
    res.send(totalSupply.toString())
})

app.get('/circulating', async function(req, res) {
    const mintInfo = await serum.getMintInfo(provider, fanitradeMint)
    const totalSupply = parseInt(mintInfo.supply.toString()) / Math.pow(10, mintInfo.decimals)
    const treasuryInfo = await serum.getTokenAccount(provider, treasuryTokens)
    const lockedSupply = parseInt(treasuryInfo.amount.toString()) / Math.pow(10, mintInfo.decimals)
    const circulatingSupply = totalSupply - lockedSupply
    res.send(circulatingSupply.toString())
})

app.listen(process.env.PORT || 5000)