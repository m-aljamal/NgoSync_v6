import { getFundAccountSummary } from '@/app/_lib/queries/funds';
import React from 'react'

export default async function FundOverview({ params }: { params: { fundId: string } }) {
  const summary = await getFundAccountSummary(params.fundId);
  console.log(summary);
  
  
  return (
    <div>page</div>
  )
}
