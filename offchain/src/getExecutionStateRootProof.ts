import { bytesToHex } from 'viem';

const { ssz } = await import('@lodestar/types');
const { BeaconBlock } = ssz.deneb;
const { createProof, ProofType } = await import('@chainsafe/persistent-merkle-tree');

export function getExecutionStateRootProof(block: any) {
  const blockView = BeaconBlock.toView(block);
  const path = blockView.type.getPathInfo(['body', 'executionPayload', 'stateRoot']);
  const proofObj = createProof(blockView.node, { type: ProofType.single, gindex: path.gindex }) as any;
  const proof = proofObj.witnesses.map((w: Uint8Array) => bytesToHex(w));
  const leaf = bytesToHex(proofObj.leaf as Uint8Array)
  return {proof, leaf}
}