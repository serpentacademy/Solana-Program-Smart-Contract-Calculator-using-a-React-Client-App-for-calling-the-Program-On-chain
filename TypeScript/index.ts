import * as borsh from 'borsh';
import * as web3 from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
const BN = require("bn.js");
import {Buffer} from "buffer";
/**
 * The public key of the account we are 
 */
 let greetedPubkey: web3.PublicKey;
 /**
 * The state of a calculator account managed by the  program
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

  /**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
    [CalculatorAccount, {kind: 'struct', fields: [['num_1', 'u32'],['num_2', 'u32'],['operation', 'u32'],['result', 'u32']]}],
  ]);
  
  /**
   * The expected size of each greeting account.
   */
  const GREETING_SIZE = borsh.serialize(
    GreetingSchema,
    new CalculatorAccount(),
  ).length;

 

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
async function main(){
     const key: Uint8Array = Uint8Array.from(["YOUR PRIVATE KEY"]);


        const data_to_send: Buffer = Buffer.from(
            
            Uint8Array.of(0, ...new BN(10).toArray("le", 8)
            
            ));

             const data_b = borsh.serialize(
              GreetingSchema,
              new CalculatorAccount(),
              
            )

//NO
        const layout = BufferLayout.struct([BufferLayout.u32("num_1"),BufferLayout.u32("num_2"),BufferLayout.u32("operation"),BufferLayout.u32("result")])
        let data: Buffer = Buffer.alloc(layout.span);
        layout.encode({num_1:90, num_2:10, operation:4, result:100}, data);


        const signer: web3.Keypair = web3.Keypair.fromSecretKey(key);
        let programId: web3.PublicKey = new web3.PublicKey("GB7RT1KNWANbfpFJKJY5FgxKhWYa282TCQw8sFatcASZ");
     
          // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
   
  // first create account with seed then refer with Public Key
          const GREETING_SEED = 'heY51';
  //  greetedPubkey = await web3.PublicKey.createWithSeed(
  //    signer.publicKey,
  //    GREETING_SEED,
  //    programId,
  //  );
   //HJgsAeHzKRN1gap9Kz7rNkXQY9rEA3do5tJ4epX4cA56
 
 greetedPubkey = new web3.PublicKey("GJiHoq1t6Sgp8d8idD5XjBtgibU8DccQebuXSqNygC9G");


   let fees = 0;
 
 

   const lamports = await connection.getMinimumBalanceForRentExemption(
    GREETING_SIZE,
  );
 

//This creteAccount with Seed  only first time    
  //    const transaction = new web3.Transaction()

  //  .add(
  //   web3.SystemProgram.createAccountWithSeed({
  //     fromPubkey: signer.publicKey,
  //     basePubkey: signer.publicKey,
  //     seed: GREETING_SEED,
  //     newAccountPubkey: greetedPubkey,
  //     lamports,
  //     space: GREETING_SIZE,
  //     programId,
  //   }),
  // );


let transaction: web3.Transaction = new web3.Transaction();
//programId = greetedPubkey;
  transaction.add(
    new web3.TransactionInstruction({
        keys: [
          {pubkey: greetedPubkey, isSigner: false, isWritable: true}],
            programId,
        data: data
        
        
    })
);
// const transaction = new web3.Transaction().add(
//   new web3.TransactionInstruction({
//       keys: [{
//         "pubkey": signer.publicKey
//         ,
//         "isSigner": true,
//         "isWritable": true
//          }],
//       programId,
//       data
      
      
//   })
// );

await web3
.sendAndConfirmTransaction(connection, transaction, [signer])
.then((sig)=> {
  console.log("sig: {}", sig);
});
reportGreetings();
    

    }
     async function reportGreetings(): Promise<void> {
        const accountInfo = await connection.getAccountInfo(greetedPubkey);
        if (accountInfo === null) {
          throw 'Error: cannot find the greeted account';
        }
        const greeting = borsh.deserialize(
          GreetingSchema,
          CalculatorAccount,
          accountInfo.data,
        );
        console.log(
          greetedPubkey.toBase58(),
          'result',
          Number(greeting.result),
          'time(s)',
        );
      }

    main();
