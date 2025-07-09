import React from 'react';
import ElementList from '@/app/components/ElementList';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ElementList
            title="Proyectos"
          />

          <ElementList
            title="Sensores"
          />

          <ElementList
            title="Actuadores"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
