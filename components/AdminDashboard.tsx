import React, { useState } from 'react';
import { CogIcon, ArrowPathIcon, DocumentTextIcon, UsersIcon } from './icons/Icon';

const AdminDashboard: React.FC = () => {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className="p-4 md:p-0 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Data Sources Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <CogIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">Configure scheduled jobs, API keys, and performance monitoring for Google Places & SERP API.</p>
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                             <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-green-700">Operational</span>
                        </div>
                       <button onClick={handleSync} disabled={isSyncing} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
                           <ArrowPathIcon className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                           {isSyncing ? 'Syncing...' : 'Manual Sync'}
                       </button>
                    </div>
                </div>

                {/* Reporting Configuration */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Reporting Config</h3>
                    </div>
                     <p className="mt-4 text-sm text-gray-600">Setup weekly/monthly PDF reports, manage recipient lists, and customize templates.</p>
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Manage Reports
                        </button>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <UsersIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">Manage user access and roles via AWS Cognito. View audit logs for system activity.</p>
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                           View Users
                        </button>
                    </div>
                </div>
            </div>

            {/* Entities and Competitors */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entities & Competitors</h3>
                <p className="text-sm text-gray-600 mb-4">Manage retailers and their associated competitors (up to 20 per retailer).</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer / Entity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitors Tracked</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[{name: 'Luxe Apparel', competitors: 18}, {name: 'Gourmet Eats', competitors: 20}, {name: 'TechHub Electronics', competitors: 15}].map(entity => (
                                <tr key={entity.name}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entity.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entity.competitors} / 20</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-blue-600 hover:text-blue-900">Manage</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
