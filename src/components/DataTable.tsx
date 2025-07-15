"use client"
import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Flex, Text, Button, Select, HStack, useColorModeValue } from '@chakra-ui/react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender, SortingState, ColumnDef } from '@tanstack/react-table';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  onRowClick?: (row: TData) => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}
export function DataTable<TData>({
  data,
  columns,
  onRowClick,
  totalCount,
  currentPage = 0,
  pageSize = 10,
  onPageChange
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const isServerSidePagination = totalCount !== undefined && onPageChange !== undefined;
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSidePagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    },
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    },
    manualPagination: isServerSidePagination,
    pageCount: isServerSidePagination ? Math.ceil((totalCount || 0) / pageSize) : undefined
  });
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  return <Box>
      <Box overflowX="auto">
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            {table.getHeaderGroups().map(headerGroup => <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => <Th key={header.id} onClick={header.column.getToggleSortingHandler()} cursor={header.column.getCanSort() ? 'pointer' : 'default'} borderColor={borderColor}>
                    <Flex alignItems="center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? ' 🔼' : ''}
                      {header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                    </Flex>
                  </Th>)}
              </Tr>)}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => <Tr 
              key={row.id} 
              _hover={{
                bg: useColorModeValue('gray.50', 'gray.700'),
                cursor: onRowClick ? 'pointer' : 'default'
              }}
              onClick={() => onRowClick?.(row.original)}
            >
                {row.getVisibleCells().map(cell => <Td key={cell.id} borderColor={borderColor}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>)}
              </Tr>)}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
        <HStack>
          <Text fontSize="sm">
            {isServerSidePagination ? (
              <>Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalCount || 0)} of {totalCount || 0} entries</>
            ) : (
              <>Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getRowCount())} of {table.getRowCount()} entries</>
            )}
          </Text>
          {!isServerSidePagination && (
            <Select
              size="sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              width="80px"
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Select>
          )}
        </HStack>
        <HStack>
          <Button
            size="sm"
            onClick={() => {
              if (isServerSidePagination) {
                onPageChange?.(currentPage - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={isServerSidePagination ? currentPage === 0 : !table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Text fontSize="sm">
            Page {(isServerSidePagination ? currentPage : table.getState().pagination.pageIndex) + 1} of{' '}
            {isServerSidePagination ? Math.ceil((totalCount || 0) / pageSize) : table.getPageCount()}
          </Text>
          <Button
            size="sm"
            onClick={() => {
              if (isServerSidePagination) {
                onPageChange?.(currentPage + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={isServerSidePagination ? 
              currentPage >= Math.ceil((totalCount || 0) / pageSize) - 1 : 
              !table.getCanNextPage()
            }
          >
            Next
          </Button>
        </HStack>
      </Flex>
    </Box>;
}