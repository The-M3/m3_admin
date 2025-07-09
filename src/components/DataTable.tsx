"use client"
import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Flex, Text, Button, Select, HStack, useColorModeValue } from '@chakra-ui/react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender, SortingState, ColumnDef } from '@tanstack/react-table';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
}
export function DataTable<TData>({
  data,
  columns
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
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
            {table.getRowModel().rows.map(row => <Tr key={row.id} _hover={{
            bg: 'gray.50'
          }}>
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
            Showing{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{' '}
            to{' '}
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getRowCount())}{' '}
            of {table.getRowCount()} entries
          </Text>
          <Select size="sm" value={table.getState().pagination.pageSize} onChange={e => {
          table.setPageSize(Number(e.target.value));
        }} width="80px">
            {[5, 10, 20, 30, 40, 50].map(pageSize => <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>)}
          </Select>
        </HStack>
        <HStack>
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Text fontSize="sm">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </Text>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </HStack>
      </Flex>
    </Box>;
}