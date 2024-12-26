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
import { Search, RefreshCw, Power, Pause, Play, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ContainerService } from '@/lib/services/containerService';
import { toast } from '@/hooks/use-toast';

interface Container {
  ID: string;
  Name: string;
  Status: string;
  Image: string;
  CreatedAt: string;
  Ports?: string;
}

interface ContainerListProps {
  onSelectContainer: (id: string) => void;
}

export function ContainerList({ onSelectContainer }: ContainerListProps) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchContainers = async () => {
    try {
      setLoading(true);
      console.log('Fetching containers...');
      const response = await ContainerService.listContainers();
      console.log('Response:', response);
      if (response.error) {
        console.error('Error response:', response.error);
        toast({
          variant: "destructive",
          title: "Error fetching containers",
          description: response.error.error,
        });
        return;
      }
      setContainers(response.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch containers",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContainerAction = async (containerId: string, action: 'start' | 'stop' | 'pause' | 'delete') => {
    try {
      let response;
      switch (action) {
        case 'delete':
          response = await ContainerService.deleteContainer(containerId);
          break;
        // Add other actions when backend supports them
      }
      
      if (response?.error) {
        toast({
          variant: "destructive",
          title: `Failed to ${action} container`,
          description: response.error.error,
        });
        return;
      }
      
      toast({
        title: "Success",
        description: `Container ${action}ed successfully`,
      });
      
      fetchContainers(); // Refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${action} container`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    if (status.toLowerCase().includes('up')) return 'default';
    if (status.toLowerCase().includes('exited')) return 'destructive';
    if (status.toLowerCase().includes('paused')) return 'outline';
    return 'secondary';
  };

  const filteredContainers = containers.filter(container => {
    const matchesSearch = (container?.Name?.toLowerCase()?.includes(searchText.toLowerCase()) || false) ||
      (container?.Image?.toLowerCase()?.includes(searchText.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || container?.Status?.toLowerCase().includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search containers..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
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
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchContainers}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh containers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Ports</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContainers.map((container) => (
              <TableRow key={container.ID}>
                <TableCell className="font-medium">{container.Name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(container.Status)}>
                    {container.Status}
                  </Badge>
                </TableCell>
                <TableCell>{container.Image}</TableCell>
                <TableCell>{container.CreatedAt}</TableCell>
                <TableCell>{container.Ports}</TableCell>
                <TableCell>
                  {/* Removed resource information as it's not present in the updated Container interface */}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onSelectContainer(container.ID)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {container.Status.toLowerCase().includes('running') && (
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" /> Pause
                        </DropdownMenuItem>
                      )}
                      {container.Status.toLowerCase().includes('paused') && (
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" /> Resume
                        </DropdownMenuItem>
                      )}
                      {!container.Status.toLowerCase().includes('stopped') && (
                        <DropdownMenuItem>
                          <Power className="mr-2 h-4 w-4" /> Stop
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive" onClick={() => handleContainerAction(container.ID, 'delete')}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
