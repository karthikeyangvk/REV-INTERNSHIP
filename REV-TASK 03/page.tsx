'use client';

import { useEffect, useState } from 'react';
import { getTrips, getTripStats, TripType } from '@/utils/storage';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  UserIcon,
  CheckIcon  
} from '@heroicons/react/24/outline';

const InsightsPage = () => {
  const [stats, setStats] = useState(getTripStats());
  const trips = getTrips();

  // Update stats when component mounts
  useEffect(() => {
    setStats(getTripStats());
  }, []);

  // Get the most common destination
  const getMostCommonDestination = () => {
    if (!stats.byDestination) return 'None';
    const entries = Object.entries(stats.byDestination);
    if (entries.length === 0) return 'None';
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  // Get the most common trip type
  const getMostCommonTripType = () => {
    if (!stats.byType) return 'None';
    const entries = Object.entries(stats.byType) as [TripType, number][];
    if (entries.length === 0) return 'None';
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  // Get the trip type icon
  const getTripTypeIcon = (type: TripType) => {
    switch (type) {
      case 'Family':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Friends':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'Business':
        return <BriefcaseIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  // Format number with ordinal suffix
  const formatOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Insights</h1>
        <p className="mt-1 text-sm text-gray-500">Analytics and statistics about your trips</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Trips */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Trips</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.upcoming}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Trips */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.completed}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Most Common Destination */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Top Destination</dt>
                  <dd className="text-sm font-medium text-gray-900 truncate">
                    {getMostCommonDestination()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Trips by Type */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Trips by Type</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Distribution of trips by their type</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <span className="mr-2">{getTripTypeIcon(type as TripType)}</span>
                    {type}
                  </dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="w-full">
                      <div className="flex justify-between text-sm">
                        <span>{count} {count === 1 ? 'trip' : 'trips'}</span>
                        <span className="text-gray-500">
                          {Math.round((count / stats.total) * 100) || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Destinations */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Top Destinations</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your most visited places</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {Object.entries(stats.byDestination)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([destination, count], index) => (
                  <div key={destination} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-900 flex items-center">
                      <span className="mr-2 text-gray-500">#{index + 1}</span>
                      {destination}
                    </dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="w-full">
                        <div className="flex justify-between text-sm">
                          <span>{count} {count === 1 ? 'trip' : 'trips'}</span>
                          <span className="text-gray-500">
                            {Math.round((count / stats.total) * 100) || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Trips</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your most recent trips</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {trips
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .slice(0, 5)
              .map((trip) => (
                <li key={trip.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate">{trip.name}</p>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {trip.destination}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {new Date(trip.startDate).toLocaleDateString()} -{' '}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trip.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : trip.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {trip.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;