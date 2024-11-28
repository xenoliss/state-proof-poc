import type { SingleProof } from '@chainsafe/persistent-merkle-tree';
import { bytesToHex } from 'viem';
const { ssz } = await import('@lodestar/types');
const { BeaconBlock } = ssz.deneb;
const { createProof, ProofType } = await import('@chainsafe/persistent-merkle-tree');

export function getExecutionStateRootProof(block: any) {
  const blockView = BeaconBlock.toView(block);
  const path = blockView.type.getPathInfo(['body', 'executionPayload', 'state_root']);

  const proofObj = createProof(blockView.node, { type: ProofType.single, gindex: path.gindex }) as SingleProof;
  const proof = proofObj.witnesses.map((w: Uint8Array) => bytesToHex(w));
  const leaf = bytesToHex(proofObj.leaf as Uint8Array)
  return { proof, leaf }
}
