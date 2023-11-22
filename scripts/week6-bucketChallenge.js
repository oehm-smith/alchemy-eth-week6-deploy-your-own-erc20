/**
 * Send ERC20s to Contracts - https://university.alchemy.com/course/ethereum/md/63b7650acb47730004b8de1b
 *
 * Approve / TransferFrom to transfer some ERC20 tokens (ie. Joy) to https://goerli.etherscan.io/address/0x873289a1aD6Cf024B927bd13bd183B264d274c68#code
 */
const fs = require("fs")
const path = require("path")

const contractAddrJoy = "0xd81CDB067Ba87222eA7f404511BFfDff4083719A";

const getTheJoyAbi = () => {
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


const contractAddrBucket = "0x873289a1aD6Cf024B927bd13bd183B264d274c68";
const getTheBucketAbi = () => {
    try {
        // copied from the contract - https://goerli.etherscan.io/address/0x873289a1aD6Cf024B927bd13bd183B264d274c68#code
        const abiString = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"Winner\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"erc20\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"drop\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]"
        const json = JSON.parse(abiString)

        return json
    } catch (e) {
        console.log(`e`, e)
    }
}
async function main() {
    const [signer1, signer2] = await ethers.getSigners();

    const joyContract = await ethers.getContractAt(getTheJoyAbi(), contractAddrJoy, signer1);
    const bucketContract = await ethers.getContractAt(getTheBucketAbi(), contractAddrBucket, signer2);
    const bucketSigner = await ethers.getSigner(contractAddrBucket);

    // let weiAmount1 = (await signer1.getBalance()).toString();
    let weiAmount1 = (await joyContract.balanceOf(signer1.getAddress()));
    let weiAmount2 = (await joyContract.balanceOf(signer2.getAddress()));

    console.log(`signer1: ${await signer1.getAddress()}`)
    console.log(`signer2: ${await signer2.getAddress()}`)
    console.log(`signer1 amount: ${weiAmount1}`);
    console.log(`signer2 amount: ${weiAmount2}`);
    console.log(`bucket signer: ${await bucketSigner.getAddress()}`)
    // console.log(`contract interface fns: ${JSON.stringify(joyContract.interface.functions)}`)

    const amount = ethers.utils.parseEther("0.0007");
    // const amount = 1000000000;  //000000000 - or whatever amount - works also
    console.log(`transfer amount: ${amount}, type isBigNumber: ${ethers.BigNumber.isBigNumber(amount)}`);

    await joyContract.connect(signer2).approve(contractAddrBucket, amount);
    console.log(`approved signer2 to spend amount from joyContract via bucketContract`);
    const tx = await bucketContract.connect(signer2).drop(contractAddrJoy, amount);
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
