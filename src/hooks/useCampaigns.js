import { useEffect, useState } from 'react';
import { getCampaigns, subscribeToCampaigns } from '../data/campaignStore.js';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState(() => getCampaigns());
  useEffect(() => subscribeToCampaigns(setCampaigns), []);
  return campaigns;
}
