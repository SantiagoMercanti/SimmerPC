// 'use client'

// import React, { useState, useEffect } from 'react';

// // Interfaz para definir la estructura de un proyecto
// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   status: 'activo' | 'completado' | 'pausado';
//   createdAt: string;
// }

// // Props del componente
// interface ElementListProps {
//   title?: string;
//   apiEndpoint?: string;
//   className?: string;
// }

// const ElementList: React.FC<ElementListProps> = ({
//   title = "Proyectos",
//   apiEndpoint = "/api/projects",
//   className = ""
// }) => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Función para obtener proyectos desde la API
//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(apiEndpoint);

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`);
//       }

//       const data = await response.json();
//       setProjects(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error al cargar proyectos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cargar proyectos al montar el componente
//   useEffect(() => {
//     fetchProjects();
//   }, [apiEndpoint]);

//   // Función para obtener el color del estado
//   const getStatusColor = (status: Project['status']) => {
//     switch (status) {
//       case 'activo':
//         return 'bg-green-100 text-green-800';
//       case 'completado':
//         return 'bg-blue-100 text-blue-800';
//       case 'pausado':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Función para formatear fecha
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('es-ES', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
//       {/* Título de la columna */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
//           {title}
//         </h2>
//       </div>

//       {/* Contenido de la columna */}
//       <div className="space-y-4">
//         {loading ? (
//           // Estado de carga
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//             <span className="ml-2 text-gray-600">Cargando proyectos...</span>
//           </div>
//         ) : error ? (
//           // Estado de error
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//             <button
//               onClick={fetchProjects}
//               className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//             >
//               Reintentar
//             </button>
//           </div>
//         ) : projects.length === 0 ? (
//           // Estado vacío
//           <div className="text-center py-8">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
//             <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo proyecto.</p>
//           </div>
//         ) : (
//           // Lista de proyectos
//           projects.map((project) => (
//             <div
//               key={project.id}
//               className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {project.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                     {project.description}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                       {project.status}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {formatDate(project.createdAt)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Botón para recargar */}
//       {!loading && !error && projects.length > 0 && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={fetchProjects}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
//           >
//             Actualizar
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ElementList;
"use client"

import React from 'react';

const ElementList = ({ title }: { title?: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 mb-6">
        {title}
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Elemento 1
          </h3>
          <p className="text-gray-600 text-sm">
            Descripción del elemento
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Elemento 2
          </h3>
          <p className="text-gray-600 text-sm">
            Descripción del elemento
          </p>
        </div>
      </div>
    </div>
  );
};

export default ElementList;