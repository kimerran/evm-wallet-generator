import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ethers } from 'ethers';
import crypto from 'crypto';

const app = express();
app.use(cors({ origin: '*' }));
app.options('*', cors()) // include before other routes
app.disable('x-powered-by')
app.use(bodyParser.json())

/**
 * Create a new wallet
 */
function createWallet(iterate: number = 1) {
    const wallets = [];
    for (let index = 0; index < iterate; index++) {
        const id = crypto.randomBytes(32).toString('hex');
        const privateKey = "0x" + id;
        const wallet = new ethers.Wallet(privateKey);

        wallets.push({
            privateKey: privateKey,
            address: wallet.address
        });
    }
    return wallets;
}

app.get('/create', (req: Request, res: Response) => {
    let i = req.query.i as string || '1';
    try {
        const accounts = parseInt(i);
        const wallets = createWallet(accounts);
        res.send(wallets);
    } catch (error) {
        console.error(error)
        res.status(400).send('error')
    }
})

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`Create your wallet using http://localhost:${PORT}/create`);
    console.log('To add more accounts, use http://localhost:3000/create?i=HOW_MANY_WALLETS')
});