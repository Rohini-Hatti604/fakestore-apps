'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { apply } from 'json-logic-js';
import { useFilterStore } from '../../store/useFilterStore';
import { queryBuilderToJsonLogic } from '../../utils/queryBuilderToJsonLogic';
import type { MyRuleGroupType } from '../../utils/queryBuilderToJsonLogic';

/* ---------------------------
   Product Interface
--------------------------- */
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

/* ---------------------------
   API Fetcher
--------------------------- */
const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch('https://fakestoreapi.com/products');
  return res.json();
};

/* ---------------------------
   Product Table Component
--------------------------- */
export default function ProductTable() {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { filters } = useFilterStore();
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  /* Apply filtering */
  useEffect(() => {
    if (!data) return;

    // If no filters, show all data
    if (!filters) {
      setFilteredData(data);
      return;
    }

    try {
      const logic = queryBuilderToJsonLogic(filters as MyRuleGroupType);

      if (!logic || typeof logic !== 'object') {
        setFilteredData(data);
        return;
      }

      const filtered = data.filter((item) => {
        try {
          const itemWithFlattenedRating = {
            ...item,
            'rating.rate': item.rating.rate,
            'rating.count': item.rating.count
          };
          return apply(logic, itemWithFlattenedRating);
        } catch (e) {
          // If json-logic fails for an item, exclude it
          return false;
        }
      });
      setFilteredData(filtered);
    } catch (error) {
      console.error('Filtering error:', error);
      setFilteredData(data);
    }
  }, [data, filters]);


  /* ---------------------------
     Table Columns
  --------------------------- */
  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: 'id',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">ID</span>,
      cell: (info) => <span className="text-gray-200 text-sm">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'image',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">Image</span>,
      cell: (info) => (
        <div className="w-14 h-14 bg-[#1B1B1B] rounded flex items-center justify-center overflow-hidden">
          <Image
            src={info.getValue() as string}
            alt="product"
            className="w-full h-full object-contain"
            width={56}
            height={56}
            onError={(e) =>
              ((e.target as HTMLImageElement).src = '/fallback.png')
            }
          />
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">Title</span>,
      cell: (info) => (
        <span className="text-[#FAFAFA] text-sm font-medium">{String(info.getValue())}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">Price</span>,
      cell: (info) => (
        <span className="text-[#FAFAFA] text-sm font-normal">${String(info.getValue())}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">Category</span>,
      cell: (info) => (
        <span className="text-[#FAFAFA] text-sm font-medium">{String(info.getValue())}</span>
      ),
    },
    {
      accessorKey: 'rating',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">Rating</span>,
      cell: (info) => {
        const rating = info.getValue() as Product['rating'];
        return (
          <div className="flex items-center gap-1">
            <span className="text-[#FAFAFA] text-sm font-medium">{rating.rate} ★</span>
            <span className="text-gray-400 text-[11px] font-normal">({rating.count})</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: () => <span className="text-xs font-medium text-[#FAFAFA] uppercase">Description</span>,
      cell: (info) => (
        <span className="text-gray-300 text-sm">
          {(info.getValue() as string).slice(0, 100)}...
        </span>
      ),
    },
  ], []);

  /* ---------------------------
     Table Initialization
  --------------------------- */
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ---------------------------
     Render
  --------------------------- */
  if (isLoading) return <div className="text-blue-400 text-sm">Loading...</div>;

  return (
    <div className="overflow-x-auto bg-[#1B1B1B] p-4 rounded-xl text-white">
      <table className="w-full text-sm border-separate border-spacing-0">
        <thead className="bg-[#2A2A2A]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-5 py-3 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`bg-[#2B2B2B] hover:bg-[#3A3A3A] transition ${
                  rowIndex !== table.getRowModel().rows.length - 1 ? 'border-b border-[#3A3A3A]' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-gray-400 text-xs">
        <span>
          Showing{' '}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          –
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredData.length
          )}{' '}
          of {filteredData.length} items
        </span>

        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-[#2A2A2A] rounded hover:bg-[#444]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>

          <button
            className="px-2 py-1 bg-[#2A2A2A] rounded hover:bg-[#444]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
