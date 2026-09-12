import React from 'react'
import { TableData } from '../types/props';
import Button from './button';
import { EllipsisVertical } from '@/assets/icons';

export default function PageActions({add, tableToExport}: {add?: ()=>void, tableToExport?: TableData}) {
  return (
    <button className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:text-gray-400 lg:h-11 lg:w-11 hover:text-dark-900 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white">
      <EllipsisVertical  className="h-5 w-5"/>
    </button>
  )
}
