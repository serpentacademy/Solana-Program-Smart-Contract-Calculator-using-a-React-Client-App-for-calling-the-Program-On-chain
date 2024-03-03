import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
//import * as borsh from '@project-serum/borsh';
import '../src/css/bootstrap.css'
import {Buffer} from "buffer";
import * as BufferLayout from "@solana/buffer-layout";
import * as borsh from 'borsh';


import {
    GlowWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,

} from '@solana/wallet-adapter-wallets';

import { clusterApiUrl, Transaction, TransactionInstruction, SystemProgram, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState } from 'react';

import { actions, utils, programs, NodeWallet, Connection} from '@metaplex/js'; 


const BN = require("bn.js");

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');
let thelamports = 0;
let theWallet = "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9"
function getWallet(){

    
}

/**
* The state of a greeting account managed by the hello world program
*/
class CalculatorAccount {
    num_1 = 1;
    num_2 = 2;
    result = 1;
    operation = 1;
    constructor(fields: {num_1: number,num_2: number, operation: number, result: number} | undefined = undefined) {
      if (fields) {
        this.num_1 = fields.num_1;
        this.num_2 = fields.num_2;
        this.operation = fields.operation;
        this.result = fields.result;

      }
    }
  }
  let greetedPubkey: PublicKey

  
  /**
   * The expected size of each greeting account.
   */
 
const App: FC = () => {
/**
 * The public key of the account we are saying hello to
 */
let greetedPubkey: PublicKey;


 /**
* Borsh schema definition for greeting accounts
*/
const GreetingSchema = new Map([
    [CalculatorAccount, {kind: 'struct', fields: [['num_1', 'u32'],['num_2', 'u32'],['operation', 'u32'],['result', 'u32']]}],
 ]);
 
 /**
  * The expected size of each greeting account.
  */




    return (
        <Context>
            <Content />
        </Context>
    );
};


export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new LedgerWalletAdapter(),
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolletExtensionWalletAdapter(), 
            new SolletWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

   

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    let [wallet, setWallet] = useState("");
    let [num1, setNum1] = useState(1)
    let [num2, setNum2] = useState(1)
    let [operationI, setOperationI] = useState(1)


    let [blockchainCounter, setBlockchainCounter] = useState("")

    // const { connection } = useConnection();
    const connection = new Connection(clusterApiUrl("devnet"))
    const { publicKey, sendTransaction } = useWallet();

    const GreetingSchema = new Map([
        [CalculatorAccount, {kind: 'struct', fields: [['num_1', 'u32'],['num_2', 'u32'],['operation', 'u32'],['result', 'u32']]}],
    ]);
 

    const onClick = useCallback(async () => {
        if (!publicKey) throw new Error('Wallet not connected');

        // Assuming you have a programId and some instructionData
        const programId = new PublicKey("GB7RT1KNWANbfpFJKJY5FgxKhWYa282TCQw8sFatcASZ");
        //const instructionData = Buffer.from([/* Your serialized instruction data here */]);



        
       

        const instructionData: Buffer = Buffer.from(
            
            Uint8Array.of(0, ...new BN(10).toArray("le", 8)
            
            ));

             const data_b = borsh.serialize(
              GreetingSchema,
              new CalculatorAccount(),
              
            )

//NO

        const layout = BufferLayout.struct([BufferLayout.u32("num_1"),BufferLayout.u32("num_2"),BufferLayout.u32("operation"),BufferLayout.u32("result")])
        let data: Buffer = Buffer.alloc(layout.span);
        layout.encode({num_1:num1, num_2:num2, operation:operationI, result:1}, data);
        greetedPubkey = new PublicKey("GJiHoq1t6Sgp8d8idD5XjBtgibU8DccQebuXSqNygC9G");

        const instruction = new TransactionInstruction({
            keys: [
              {pubkey: greetedPubkey, isSigner: false, isWritable: true}],
                programId,
            data: data
            
            
        })

        const transaction = new Transaction().add(instruction);
        const signature = await sendTransaction(transaction, connection);
        console.log("Transaction signature", signature);
        calculateOperation()

        // Additional logic to confirm the transaction may go here
    }, [publicKey, sendTransaction, connection]);

    async function calculateOperation(): Promise<void> {
        greetedPubkey = new PublicKey("GJiHoq1t6Sgp8d8idD5XjBtgibU8DccQebuXSqNygC9G");

        const accountInfo = await connection.getAccountInfo(greetedPubkey);
        if (accountInfo === null) {
          throw 'Error: cannot find the greeted account';
        }
        const greeting = borsh.deserialize(
          GreetingSchema,
          CalculatorAccount,
          accountInfo.data,
        );
        setBlockchainCounter(greeting.result+"")
        console.log(
          greetedPubkey.toBase58(),
          'has been greeted',
          Number(greeting.result),
          'time(s)',
        );
      }
function setNum1F(e: any)
{
    console.log(Number(e.target.value));
    setNum1(Number(e.target.value));
}

function setNum2F(e: any)
{
    console.log(Number(e.target.value));
    setNum2(Number(e.target.value));
}

function setOperationF(e: any)
{
    console.log(Number(e.target.value));
    setOperationI(Number(e.target.value));
}

function setTheWallet(e: any){
    setWallet(e.target.value)
    theWallet = e.target.value;
}
    return (
       

        <div className="App">
                <div className="navbar">
        <div className="navbar-inner ">
          <a id="title" className="brand" href="#">Calculator</a>
          <ul className="nav">


          </ul>
          <ul className="nav pull-right">
                      <li><a href="#">White Paper</a></li>
                      <li className="divider-vertical"></li>
                      <li><WalletMultiButton /></li>

                    </ul>
        </div>
      </div>
<input value={num1} type="number" onChange={(e) => setNum1F(e)}></input>
<input value={num2} type="number" onChange={(e) => setNum2F(e)}></input>

        <br></br>
<ul style={{color:"whitesmoke"}}>
    <li>1 👉 Sum</li>
    <li>2 👉 Substract</li>
    <li>3 👉 Multiply</li>
    <li>4 👉 Divide</li>
    <p>Operation</p>
    <input value={operationI} type="number" onChange={(e) => setOperationF(e)}></input>





</ul>

      <button className='btn' onClick={onClick}>Calculate </button>
<button onClick={calculateOperation} >Refresh Calculation TX</button>
<p style={{color:'whitesmoke'}}>{blockchainCounter}</p>
        </div>
    );
};
