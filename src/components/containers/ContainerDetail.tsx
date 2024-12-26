'use client';

import React, { useState, useEffect } from 'react';
import { LogViewer } from './LogViewer';
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

interface ContainerDetails {
  id: string;
  name: string;
  status: string;
  image: string;
  created: string;
  ports: string[];
  environment: Record<string, string>;
  resources: {
    cpu: number;
    memory: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  network: {
    ipAddress: string;
    networkMode: string;
  };
}

interface Props {
  containerId: string;
  onBack: () => void;
}

export function ContainerDetail({ containerId, onBack }: Props) {
  const [details, setDetails] = useState<ContainerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchContainerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/containers/${containerId}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Failed to fetch container details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainerDetails();
  }, [containerId]);

  if (loading || !details) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <h2 className="text-2xl font-bold">{details.name}</h2>
            <p className="text-sm text-muted-foreground">{details.id}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(details.status)}>
            {details.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {details.status === 'running' && (
            <Button variant="outline" size="sm">
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          )}
          {details.status === 'paused' && (
            <Button variant="outline" size="sm">
              <Play className="mr-2 h-4 w-4" /> Resume
            </Button>
          )}
          {details.status !== 'stopped' && (
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
                    <span>{details.resources.cpuUsage}%</span>
                  </div>
                  <Progress value={details.resources.cpuUsage} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{details.resources.memoryUsage}%</span>
                  </div>
                  <Progress value={details.resources.memoryUsage} />
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Container Info</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Image</dt>
                  <dd>{details.image}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd>{details.created}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Ports</dt>
                  <dd>{details.ports.join(', ') || 'None'}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-4">
            <ScrollArea className="h-[400px]">
              <LogViewer containerId={containerId} />
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="environment">
          <Card className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {Object.entries(details.environment).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-4">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{key}</code>
                    <code className="text-sm font-mono text-muted-foreground">{value}</code>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="p-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">IP Address</dt>
                <dd className="font-mono">{details.network.ipAddress}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Network Mode</dt>
                <dd>{details.network.networkMode}</dd>
              </div>
            </dl>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
