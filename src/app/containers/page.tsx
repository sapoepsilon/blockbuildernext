'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ContainerDetail } from '@/components/containers/ContainerDetail';
import { ContainerList } from '@/components/containers/ContainerList';
import { ContainerForm } from '@/components/containers/ContainerForm';

export default function ContainersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Container Management</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Container
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {selectedContainerId ? (
          <ContainerDetail
            containerId={selectedContainerId}
            onBack={() => setSelectedContainerId(null)}
          />
        ) : (
          <ContainerList
            onSelectContainer={setSelectedContainerId}
          />
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Container</DialogTitle>
          </DialogHeader>
          <ContainerForm onSuccess={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
