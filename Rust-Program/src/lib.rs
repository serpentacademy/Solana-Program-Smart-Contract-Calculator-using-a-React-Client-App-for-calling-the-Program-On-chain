use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
//program id 49PjFAFiYjxH4gqM8AWmVHgaYiCKVsNHUSKPEoQ2NgjE
/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CalculatorAccount {
    /// number to make an operation
    pub num_1: u32,
    pub num_2: u32,
    pub operation: u32,
    pub result: u32,

}


// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey, // Public key of the account the hello world program was loaded into
    accounts: &[AccountInfo], // The account to say hello to
    _instruction_data: &[u8], // Ignored, all helloworld instructions are hellos
) -> ProgramResult {
    
    fn sum(a: u32, b: u32) -> u32 {
        a + b
    }
    
    fn substract(a:u32, b:u32) -> u32 {
        a - b
    }
    
    fn multiply(a:u32, b:u32) -> u32 {
        a * b
    }
    fn divide(a:u32, b:u32) -> u32 {
        if b == 0
        {
            0
        }
        else{
            a / b
        }
       
    }
    

    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;
    
    msg!("Start instruction decode");
    let message = CalculatorAccount::try_from_slice(_instruction_data).map_err(|err| {
      msg!("Receiving num_1, num_2 u32, {:?}", err);
      ProgramError::InvalidInstructionData  
    })?;
    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Increment and store the number of times the account has been greeted
    let mut calculator_account = CalculatorAccount::try_from_slice(&account.data.borrow())?;
   // 
   msg!("Was sent number, operation {} {} {}!", message.num_1, message.num_2, message.operation);

    //calculator math operation
    match message.operation{ 
        1=>calculator_account.result=sum(message.num_1,message.num_2), 
        2=>calculator_account.result=substract(message.num_1,message.num_2),
        3=>calculator_account.result=multiply(message.num_1,message.num_2), 
        4=>calculator_account.result=divide(message.num_1,message.num_2), 
        _=>println!("error"), 
        }
       // calculator_account.result= message.result;
        calculator_account.num_1= message.num_1;
        calculator_account.num_2= message.num_2;
        calculator_account.operation= message.operation;

    calculator_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Calculator {} result!", calculator_account.result);

    Ok(())
}