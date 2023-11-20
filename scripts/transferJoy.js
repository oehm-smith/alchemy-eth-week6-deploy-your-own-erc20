const fs = require("fs")
const path = require("path")
const { address } = require("hardhat/internal/core/config/config-validation")
const contractAddr = "0xd81CDB067Ba87222eA7f404511BFfDff4083719A";
const getTheAbi = () => {
    try {
        const dir = path.resolve(
            __dirname,
            "../artifacts/contracts/JoyToken.sol/JoyToken.json"
        )
        const file = fs.readFileSync(dir, "utf8")
        const json = JSON.parse(file)
        const abi = json.abi
        // console.log(`abi`, abi)

        return abi
    } catch (e) {
        console.log(`e`, e)
    }
}
async function main() {
    const [signer1, signer2] = await ethers.getSigners();

    // const joyContract = new ethers.Contract(contractAddr, getTheAbi(), signer1);
    const joyContract = await ethers.getContractAt(getTheAbi(), contractAddr, signer1);
    // const joyContract = await joyContract1.deployed();

    // let weiAmount1 = (await signer1.getBalance()).toString();
    let weiAmount1 = (await joyContract.balanceOf(signer1.getAddress()));
    let weiAmount2 = (await joyContract.balanceOf(signer2.getAddress()));

    console.log(`signer1: ${await signer1.getAddress()}`)
    console.log(`signer2: ${await signer2.getAddress()}`)
    console.log(`signer1 amount: ${weiAmount1}`);
    console.log(`signer2 amount: ${weiAmount2}`);
    // console.log(`contract interface fns: ${JSON.stringify(joyContract.interface.functions)}`)

    const amount = ethers.utils.parseEther("25");
    // const amount = 1000000000;  //000000000 - or whatever amount - works also
    console.log(`transfer amount: ${amount}, type isBigNumber: ${ethers.BigNumber.isBigNumber(amount)}`);
    const tx = await joyContract.transfer(signer2.getAddress(), amount);
    await tx.wait();

    weiAmount1 = (await joyContract.balanceOf(signer1.getAddress()));
    weiAmount2 = (await joyContract.balanceOf(signer2.getAddress()));
    console.log(`amount 1 after: ${weiAmount1}`)
    console.log(`amount 2 after: ${weiAmount2}`)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('error')
        console.error(error);
        process.exit(1);
    });
