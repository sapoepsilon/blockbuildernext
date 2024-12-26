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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

export function ContainerDetail({ containerId }: Props) {
  const [details, setDetails] = useState<ContainerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContainerDetails();
    const interval = setInterval(fetchContainerDetails, 5000);
    return () => clearInterval(interval);
  }, [containerId]);

  const fetchContainerDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`/api/containers/${containerId}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Failed to fetch container details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!details) {
    return <div>Loading...</div>;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'stopped':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">{details.name}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(details.status)}>
                {details.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {details.id}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={details.status === 'running' ? 'outline' : 'default'}
            >
              {details.status === 'running' ? 'Stop' : 'Start'}
            </Button>
            <Button variant="destructive">Remove</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Image</div>
                <div className="text-sm">{details.image}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Created</div>
                <div className="text-sm">{details.created}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">IP Address</div>
                <div className="text-sm">{details.network.ipAddress}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Network Mode</div>
                <div className="text-sm">{details.network.networkMode}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{details.resources.cpuUsage}%</span>
                </div>
                <Progress value={details.resources.cpuUsage} />
                <div className="text-xs text-muted-foreground">
                  {details.resources.cpuUsage}% of {details.resources.cpu} cores
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>{(details.resources.memoryUsage / details.resources.memory * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(details.resources.memoryUsage / details.resources.memory) * 100}
                />
                <div className="text-xs text-muted-foreground">
                  {details.resources.memoryUsage}MB of {details.resources.memory}MB
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="p-4">
              <LogViewer containerId={containerId} />
            </Card>
          </TabsContent>

          <TabsContent value="environment">
            <Card className="p-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {Object.entries(details.environment).map(([key, value]) => (
                    <HoverCard key={key}>
                      <HoverCardTrigger asChild>
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted">
                          <span className="font-mono text-sm">{key}</span>
                          <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {value}
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <div className="font-medium">{key}</div>
                          <div className="text-sm font-mono break-all">
                            {value}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

export default ContainerDetail;
