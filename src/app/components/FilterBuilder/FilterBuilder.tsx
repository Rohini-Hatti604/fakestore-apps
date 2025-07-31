'use client';

import { QueryBuilder, RuleGroupType } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import { useFilterStore } from '../../store/useFilterStore';
import { useEffect, useState } from 'react';

const fields = [
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'category', label: 'Category', type: 'string' },
  { name: 'rating.rate', label: 'Rating', type: 'number' },
];

export default function FilterBuilder() {
  const { filters, setFilters } = useFilterStore();

  const handleChange = (newFilters: RuleGroupType) => {
    setFilters(newFilters);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-4 mb-6 bg-[#1B1B1B] text-white rounded-lg shadow-md">
     <h2 className="text-xl font-semibold mb-4 text-white">Products Details</h2>

      <div className="text-sm"> 
        <QueryBuilder
          fields={fields}
          query={filters}
          onQueryChange={handleChange}
          controlClassnames={{
            ruleGroup: 'p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800',
            combinators: 'h-10 w-24 text-sm px-2 rounded-md border border-gray-300 bg-white dark:bg-gray-700',
            addRule: 'text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition',
            addGroup: 'text-sm px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 ml-2 transition',
            removeGroup: 'text-xs text-red-600 ml-2 hover:text-red-800',
            removeRule: 'text-xs text-red-600 ml-2 hover:text-red-800',
            fields: 'h-10 text-sm rounded-md border border-gray-300 bg-white dark:bg-gray-700',
            operators: 'h-10 text-sm rounded-md border border-gray-300 bg-white dark:bg-gray-700',
            value: 'h-10 text-sm rounded-md border border-gray-300 bg-white dark:bg-gray-700',
          }}
        />
      </div>
    </div>
  );
}
