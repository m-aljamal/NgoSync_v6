import { getProposalStatistics } from '@/app/_lib/queries/proposals'
import React from 'react'

async function Overview({params}:{
  params: {
    proposalId: string
  }

}) {

  const proposalStatistics = await getProposalStatistics(params.proposalId)
  console.log(proposalStatistics);
  
  return (
    <div>page</div>
  )
}

export default Overview