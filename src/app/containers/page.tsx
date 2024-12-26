'use client';

import React, { useState } from 'react';
import { Layout, Button, Modal } from 'antd';
import ContainerList from '@/components/containers/ContainerList';
import ContainerForm from '@/components/containers/ContainerForm';
import ContainerDetail from '@/components/containers/ContainerDetail';

const { Content } = Layout;

export default function ContainersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);

  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Container Management</h1>
          <Button
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Container
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {selectedContainerId ? (
            <ContainerDetail
              containerId={selectedContainerId}
            />
          ) : (
            <ContainerList />
          )}
        </div>

        <Modal
          title="Create New Container"
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          footer={null}
          width={800}
        >
          <ContainerForm />
        </Modal>
      </Content>
    </Layout>
  );
}
