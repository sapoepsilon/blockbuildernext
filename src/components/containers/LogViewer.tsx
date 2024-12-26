'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Download, XCircle } from "lucide-react";

interface Props {
  containerId: string;
}

interface LogEntry {
  timestamp: string;
  stream: 'stdout' | 'stderr';
  message: string;
}

export function LogViewer({ containerId }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [following, setFollowing] = useState(true);
  const [filter, setFilter] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection for real-time logs
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [containerId]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const connectWebSocket = () => {
    // TODO: Replace with actual WebSocket endpoint
    const ws = new WebSocket(`ws://localhost:3000/api/containers/${containerId}/logs`);

    ws.onmessage = (event) => {
      const logEntry: LogEntry = JSON.parse(event.data);
      setLogs(prev => [...prev, logEntry]);
    };

    ws.onclose = () => {
      // Attempt to reconnect after a delay
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleDownloadLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp}] [${log.stream}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `container-${containerId}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(log =>
    filter ? log.message.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Filter logs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={following}
              onCheckedChange={setFollowing}
            />
            <Label>Follow</Label>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownloadLogs}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearLogs}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px] rounded-md border bg-muted">
        <div className="p-4 font-mono text-sm">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.stream === 'stderr' ? 'text-red-400' : 'text-green-400'
              } whitespace-pre-wrap`}
            >
              <span className="text-muted-foreground">[{log.timestamp}]</span>{' '}
              <span className="text-blue-400">[{log.stream}]</span>{' '}
              {log.message}
            </div>
          ))}
          {!filteredLogs.length && (
            <div className="text-center text-muted-foreground py-8">
              No logs available
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{filteredLogs.length} log entries</span>
        <div className="flex items-center gap-2">
          <Switch
            checked={autoScroll}
            onCheckedChange={setAutoScroll}
          />
          <Label>Auto-scroll</Label>
        </div>
      </div>
    </div>
  );
}

export default LogViewer;
