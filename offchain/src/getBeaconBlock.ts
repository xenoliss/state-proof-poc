import { getClient } from "@lodestar/api";
import { config } from "@lodestar/config/default";
import type { SignedBeaconBlock } from "@lodestar/types/electra";

const BEACON_API_URL = process.env.NODE || '';

export async function getBeaconBlock(tag: string) {
  const api = getClient({ baseUrl: BEACON_API_URL }, { config });
  const block = await api.beacon.getBlockV2({ blockId: tag });
  return (block.value() as SignedBeaconBlock).message;
}
