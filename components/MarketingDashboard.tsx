import React, { useState, useEffect, useCallback } from 'react';
import type { AnalysisData, CompetitorAnalysis, Retailer } from '../types';
import { getReviewAnalysis } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon, ChevronDownIcon, ArrowPathIcon } from './icons/Icon';

const mockRetailers: Retailer[] = [
    { id: '1', name: 'Westfield Mall - Luxe Apparel' },
    { id: '2', name: 'Downtown Plaza - Gourmet Eats' },
];

const ratingColors: { [key: string]: string } = {
    Excellent: '#10B981', // green-500
    Good: '#60A5FA', // blue-400
    Average: '#FBBF24', // amber-400
    Poor: '#F87171', // red-400
};

const RatingCell: React.FC<{ category: string; reviewCount: number }> = ({ category, reviewCount }) => {
    return (
        <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ratingColors[category] }}></span>
            <span className="font-medium text-gray-800">{category}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>
    );
};

const CompetitorRow: React.FC<{ competitor: CompetitorAnalysis, attributes: string[] }> = ({ competitor, attributes }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const ratingDistribution = [
        { name: 'Excellent', count: Math.floor(Math.random() * 50) + 5 },
        { name: 'Good', count: Math.floor(Math.random() * 100) + 10 },
        { name: 'Average', count: Math.floor(Math.random() * 30) + 2 },
        { name: 'Poor', count: Math.floor(Math.random() * 15) + 1 },
    ];
    
    return (
        <>
            <tr className={`hover:bg-gray-50 ${competitor.isPrimary ? 'bg-blue-50 font-semibold' : ''}`}>
                <td className="px-4 py-3 whitespace-nowrap">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center w-full text-left space-x-2">
                        <span className="truncate">{competitor.name}</span>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <RatingCell category={competitor.overallRating.category} reviewCount={competitor.overallRating.reviewCount} />
                </td>
                {attributes.map(attr => (
                    <td key={attr} className="px-4 py-3 whitespace-nowrap text-sm">
                        <RatingCell category={competitor.attributes[attr]?.category ?? 'Average'} reviewCount={competitor.attributes[attr]?.reviewCount ?? 0} />
                    </td>
                ))}
            </tr>
            {isExpanded && (
                <tr className={competitor.isPrimary ? 'bg-blue-50' : ''}>
                    <td colSpan={attributes.length + 2} className="p-0">
                        <div className="p-4 bg-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                                <h4 className="font-semibold text-gray-700 mb-2">AI-Generated Sentiment Summary</h4>
                                <p className="text-sm text-gray-600 bg-white p-3 rounded-md shadow-sm">{competitor.sentimentSummary}</p>
                                <div className="mt-3 flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Insight useful?</span>
                                    <button className="p-1 rounded-full hover:bg-green-100"><CheckCircleIcon className="w-6 h-6 text-green-500" /></button>
                                    <button className="p-1 rounded-full hover:bg-red-100"><XCircleIcon className="w-6 h-6 text-red-500" /></button>
                                    <button className="p-1 rounded-full hover:bg-gray-200"><MinusCircleIcon className="w-6 h-6 text-gray-500" /></button>
                                </div>
                           </div>
                           <div>
                               <h4 className="font-semibold text-gray-700 mb-2">Key Mentions</h4>
                               <div className="space-y-1 text-sm">
                                   {competitor.keyMentions.map(mention => (
                                       <div key={mention.term} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                                           <span className="text-gray-700">{mention.term}</span>
                                           <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs">{mention.count}</span>
                                       </div>
                                   ))}
                               </div>
                           </div>
                            <div>
                               <h4 className="font-semibold text-gray-700 mb-2">Rating Distribution</h4>
                               <div className="h-40 w-full bg-white p-2 rounded-md shadow-sm">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ratingDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="name" width={60} tickLine={false} axisLine={false} tick={{fontSize: 12}}/>
                                            <Tooltip />
                                            <Bar dataKey="count" barSize={20}>
                                                {ratingDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={ratingColors[entry.name]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                               </div>
                           </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const MarketingDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [selectedRetailerId, setSelectedRetailerId] = useState<string>(mockRetailers[0].id);
    const [timePeriod, setTimePeriod] = useState<string>('1y');

    const fetchData = useCallback(async () => {
        setLoading(true);
        const retailer = mockRetailers.find(r => r.id === selectedRetailerId);
        if (retailer) {
            const data = await getReviewAnalysis(retailer, timePeriod);
            setAnalysisData(data);
        }
        setLoading(false);
    }, [selectedRetailerId, timePeriod]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="p-4 md:p-0 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Competitive Analysis</h2>
                 <div className="flex items-center flex-wrap gap-4">
                    <select value={selectedRetailerId} onChange={e => setSelectedRetailerId(e.target.value)} className="w-full md:w-auto bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        {mockRetailers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="w-full md:w-auto bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="1y">Last 1 Year</option>
                        <option value="2y">Last 2 Years</option>
                        <option value="3y">Last 3 Years</option>
                    </select>
                    <button 
                        onClick={() => fetchData()} 
                        disabled={loading} 
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading analysis...</div>
                ) : analysisData ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor</th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Rating</th>
                                    {analysisData.attributes.map(attr => (
                                        <th key={attr} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{attr}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analysisData.competitors.map(comp => (
                                    <CompetitorRow key={comp.id} competitor={comp} attributes={analysisData.attributes} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">No data available.</div>
                )}
            </div>
        </div>
    );
};

export default MarketingDashboard;