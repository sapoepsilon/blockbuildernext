'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, RefreshCw } from "lucide-react";

interface Container {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused';
  image: string;
  created: string;
  ports: string;
  resource: {
    cpu: number;
    memory: number;
  };
}

export function ContainerList() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows] = useState<Container[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchContainers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/containers');
      const data = await response.json();
      setContainers(data);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
    // Set up polling for real-time updates
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleContainerAction = async (id: string, action: 'start' | 'stop') => {
    try {
      setLoading(true);
      // TODO: Implement API call to start/stop container
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchContainers();
    } catch (error) {
      console.error(`Failed to ${action} container:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    // TODO: Implement navigation to container details
    console.log('View details for container:', id);
  };

  const handleBatchOperation = (operation: string) => {
    // TODO: Implement batch operations
    console.log(`Batch operation ${operation} for:`, selectedRows);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredContainers = containers
    .filter(container =>
      container.name.toLowerCase().includes(searchText.toLowerCase()) ||
      container.image.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(container =>
      statusFilter === 'all' ? true : container.status === statusFilter
    );

  const paginatedContainers = filteredContainers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search containers..."
              className="pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchContainers()}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={!selectedRows.length}
            onClick={() => handleBatchOperation('start')}
          >
            Start Selected
          </Button>
          <Button
            variant="destructive"
            disabled={!selectedRows.length}
            onClick={() => handleBatchOperation('stop')}
          >
            Stop Selected
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Ports</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContainers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-medium">{container.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeColor(container.status)}>
                    {container.status}
                  </Badge>
                </TableCell>
                <TableCell>{container.image}</TableCell>
                <TableCell>{container.created}</TableCell>
                <TableCell>{container.ports}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant={container.status === 'running' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleContainerAction(container.id, container.status === 'running' ? 'stop' : 'start')}
                    >
                      {container.status === 'running' ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(container.id)}
                    >
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedContainers.length} of {filteredContainers.length} containers
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(filteredContainers.length / pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(filteredContainers.length / pageSize)}
          >
            Next
          </Button>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

export default ContainerList;
