import { getProject, getProjectExpensesByMonth, getProjectRemainingBudget } from '@/app/_lib/queries/projects'
import { notFound } from 'next/navigation'
import React from 'react'

 export default async function Project({
  params,
  searchParams,
 }:{
  params: {
    projectId:string
  }
  searchParams?: {
    month: string;
  };
 }) {
  const project = await getProject({
    id: params.projectId
  }) 
 if(!project) {
  notFound()
 }

 const remainigBudget = await getProjectRemainingBudget(project.id);

 const expensesByMonth =
 (await getProjectExpensesByMonth({
   projectId: project.id,
   month: searchParams?.month,
 })) || [];
 
  console.log(expensesByMonth);
  
  return (
    <div>pageddddddddd</div>
  )
}
