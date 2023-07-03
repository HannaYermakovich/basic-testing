import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    const withdrawAmount = 200;
    expect(() => account.withdraw(withdrawAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 100;
    const account1 = getBankAccount(initialBalance);
    const account2 = getBankAccount(50);
    const transferAmount = 200;
    expect(() => account1.transfer(transferAmount, account2)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    const transferAmount = 50;
    expect(() => account.transfer(transferAmount, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    const depositAmount = 50;
    account.deposit(depositAmount);
    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    const withdrawAmount = 50;
    account.withdraw(withdrawAmount);
    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const initialBalance1 = 100;
    const initialBalance2 = 50;
    const account1 = getBankAccount(initialBalance1);
    const account2 = getBankAccount(initialBalance2);
    const transferAmount = 30;
    account1.transfer(transferAmount, account2);
    expect(account1.getBalance()).toBe(initialBalance1 - transferAmount);
    expect(account2.getBalance()).toBe(initialBalance2 + transferAmount);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    const account = getBankAccount(0);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    expect.assertions(1);
    const account = getBankAccount(100);

    account.fetchBalance = jest.fn().mockResolvedValue(null);
    try {
      await account.synchronizeBalance();
    } catch (error) {
      expect(error instanceof SynchronizationFailedError).toBe(true);
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(0);
    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
