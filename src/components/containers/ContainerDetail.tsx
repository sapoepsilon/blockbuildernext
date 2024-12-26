'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Power, Pause, Play, RefreshCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ContainerService } from '@/lib/services/containerService';
import { toast } from '@/hooks/use-toast';
import { Container } from '@/lib/types/api';

interface Props {
  containerId: string;
  onBack: () => void;
}

export function ContainerDetail({ containerId, onBack }: Props) {
  const [container, setContainer] = useState<Container | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchContainer = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching container details for ID:', containerId);
      const response = await ContainerService.getContainer(containerId);
      console.log('Container details response:', response);
      if (response.error) {
        console.error('Error fetching container:', response.error);
        toast({
          variant: "destructive",
          title: "Error fetching container details",
          description: response.error.error,
        });
        return;
      }
      setContainer(response.data || null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch container details",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, [containerId]);

  const fetchLogs = useCallback(async () => {
    try {
      setLogsLoading(true);
      const response = await ContainerService.getContainerLogs(containerId);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Error fetching container logs",
          description: response.error.error,
        });
        return;
      }
      setLogs(response.data?.logs || '');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch container logs",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLogsLoading(false);
    }
  }, [containerId]);

  useEffect(() => {
    fetchContainer();
    fetchLogs();
    // Set up polling for logs and container status
    const intervalId = setInterval(() => {
      fetchContainer();
      fetchLogs();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [containerId, fetchContainer, fetchLogs]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8" />
          </div>
        </div>
      </Card>
    );
  }

  if (!container) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-lg">Container not found</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
          </Button>
        </div>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'running':
        return 'outline';
      case 'stopped':
        return 'destructive';
      case 'paused':
        return 'secondary'; // TODO: I might need to create a custom secondary button
      default:
        return 'default';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{container.name}</h2>
            <p className="text-sm text-muted-foreground">{container.id}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(container.state)}>
            {container.state}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {container.state === 'running' && (
            <Button variant="outline" size="sm">
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}
          {container.state === 'paused' && (
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" /> Resume
            </Button>
          )}
          {container.state !== 'stopped' && (
            <Button variant="outline" size="sm">
              <Power className="mr-2 h-4 w-4" /> Stop
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  container and remove all of its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Resource Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>{container.resources?.cpuUsage ?? 'N/A'}%</span>
                  </div>
                  <Progress value={Number(container.resources?.cpuUsage ?? 0)} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{container.resources?.memoryUsage ?? 'N/A'}%</span>
                  </div>
                  <Progress value={Number(container.resources?.memoryUsage ?? 0)} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Container Info</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Image</dt>
                  <dd>{container.image}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd>{container.created_at}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Ports</dt>
                  {/* <dd>{container.ports.join(', ') || 'None'}</dd> */}
                </div>
              </dl>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-4">
            <ScrollArea className="h-[400px]">
              {logsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{logs}</pre>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="environment">
          <Card className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {container.environment && Object.keys(container.environment).length > 0 ? (
                  Object.entries(container.environment).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-4">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{key}</code>
                      <code className="text-sm font-mono text-muted-foreground">{value}</code>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No environment variables set</p>
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="p-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">IP Address</dt>
                {/* <dd className="font-mono">{container.}</dd> */}
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Network Mode</dt>
                <dd>{container.networkMode || 'N/A'}</dd>
              </div>
            </dl>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
