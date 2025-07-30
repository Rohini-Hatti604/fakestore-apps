'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import { apply } from 'json-logic-js';

const fetchProducts = async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  return res.json();
};

export default function ProductTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { filters } = useFilterStore();
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (!data) return;

    try {
      const filtered = data.filter((item: any) => apply(filters, item));
      setFilteredData(filtered);
    } catch (e) {
      console.error('Filtering error:', e);
      setFilteredData(data);
    }
  }, [data, filters]);

  if (isLoading) return <div className="text-blue-600">Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="mt-4 w-full border-separate border-spacing-0 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="text-foreground">ID</th>
            <th className="text-foreground">Image</th>
            <th className="text-foreground">Title</th>
            <th className="text-foreground">Price</th>
            <th className="text-foreground">Category</th>
            <th className="text-foreground">Rating</th>
            <th className="text-foreground">Description</th>

          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((p: any, idx: number) => (
              <tr
                key={p.id}
                className={`align-top ${idx % 2 === 0
                    ? 'bg-white dark:bg-gray-900'
                    : 'bg-gray-50 dark:bg-gray-800'
                  } hover:bg-blue-100 dark:hover:bg-blue-900 transition-all`}
              >
                <td className="border p-3">{p.id}</td>
                <td className="border p-3">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="max-w-20 max-h-20 object-contain"
                    />
                  </div>
                </td>
                <td className="border p-3 text-gray-900 dark:text-white font-semibold">
                  {p.title}
                </td>
                <td className="border p-3 text-green-600 font-medium">
                  ${p.price}
                </td>
                <td className="border p-3 text-blue-800">{p.category}</td>
                <td className="border p-3">
                  <span className="text-yellow-600 font-semibold">
                    {p.rating?.rate} ★
                  </span>{' '}
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    ({p.rating?.count})
                  </span>
                </td>
                <td className="border p-3 text-gray-700 dark:text-gray-300">
                  {p.description}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-3">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
