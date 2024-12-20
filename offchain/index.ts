import { createPublicClient, http, keccak256, type Address, encodeAbiParameters, toHex } from "viem";
import { base, mainnet } from "viem/chains";

import { getBeaconRootAndL2Timestamp } from "./src/getBeaconRootAndL2Timestamp";
import { getBeaconBlock } from "./src/getBeaconBlock";
import { getExecutionStateRootProof } from "./src/getExecutionStateRootProof";

const l1Client = createPublicClient({
  chain: mainnet,
  transport: http()
});

const l2Client = createPublicClient({
  chain: base,
  transport: http()
});

const beaconInfo = await getBeaconRootAndL2Timestamp(l2Client as any);
const block = await getBeaconBlock(beaconInfo.beaconRoot);
const stateRootInclusion = getExecutionStateRootProof(block);

const tokenId = BigInt(256);
const ownerMappingSlot = BigInt(3);
const slot = keccak256(encodeAbiParameters([{ type: 'uint256' }, { type: 'uint256' }], [tokenId, ownerMappingSlot]))
const storageProof = await l1Client.getProof({
  address: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03' as Address, // nouns token
  storageKeys: [slot],
  blockNumber: BigInt(block.body.executionPayload.blockNumber)
})

const proofObj = {
  beaconRoot: beaconInfo.beaconRoot,
  beaconOracleTimestamp: toHex(beaconInfo.timestampForL2BeaconOracle, { size: 32 }),
  executionStateRoot: stateRootInclusion.leaf,
  stateRootProof: stateRootInclusion.proof,
  storageProof: storageProof.storageProof[0].proof,
  accountProof: storageProof.accountProof
}

await Bun.write("output.json", JSON.stringify(proofObj));