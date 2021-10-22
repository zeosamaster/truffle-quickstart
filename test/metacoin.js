const MetaCoin = artifacts.require("MetaCoin");

contract("MetaCoin", (accounts) => {
  it("should put 10000 MetaCoin in the first account", async () => {
    const metaCoinInstance = await MetaCoin.deployed();
    const balance = await metaCoinInstance.getBalance.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });

  it("should get balance in ETH", async () => {
    const metaCoinInstance = await MetaCoin.deployed();
    const balanceInEth = await metaCoinInstance.getBalanceInEth.call(
      accounts[0]
    );

    assert.equal(
      balanceInEth.valueOf(),
      20000,
      "20000 ETH wasn't in the first account"
    );
  });

  it("should send coin correctly", async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (
      await metaCoinInstance.getBalance.call(accountOne)
    ).toNumber();
    const accountTwoStartingBalance = (
      await metaCoinInstance.getBalance.call(accountTwo)
    ).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (
      await metaCoinInstance.getBalance.call(accountOne)
    ).toNumber();
    const accountTwoEndingBalance = (
      await metaCoinInstance.getBalance.call(accountTwo)
    ).toNumber();

    assert.equal(
      accountOneEndingBalance,
      accountOneStartingBalance - amount,
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      accountTwoEndingBalance,
      accountTwoStartingBalance + amount,
      "Amount wasn't correctly sent to the receiver"
    );
  });
});
