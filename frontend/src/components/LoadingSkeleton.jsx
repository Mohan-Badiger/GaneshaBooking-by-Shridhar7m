import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-festival-creamDark overflow-hidden shadow-sm">
      <div className="w-full h-64 shimmer-loader"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 w-3/4 rounded shimmer-loader"></div>
        <div className="h-4 w-1/2 rounded shimmer-loader"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-1/3 rounded shimmer-loader"></div>
          <div className="h-4 w-1/4 rounded shimmer-loader"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="h-10 rounded-lg shimmer-loader"></div>
          <div className="h-10 rounded-lg shimmer-loader"></div>
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
      {/* Left: Galleries */}
      <div className="space-y-4">
        <div className="w-full aspect-[4/5] rounded-3xl shimmer-loader"></div>
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl shimmer-loader"></div>
          ))}
        </div>
      </div>
      {/* Right: Info */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-5 w-24 rounded shimmer-loader"></div>
          <div className="h-10 w-3/4 rounded-xl shimmer-loader"></div>
          <div className="h-6 w-1/3 rounded shimmer-loader"></div>
        </div>
        <hr className="border-festival-creamDark" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-3 border border-festival-creamDark rounded-xl space-y-2">
              <div className="h-3 w-16 rounded shimmer-loader"></div>
              <div className="h-5 w-24 rounded shimmer-loader"></div>
            </div>
          ))}
        </div>
        <hr className="border-festival-creamDark" />
        <div className="space-y-3">
          <div className="h-5 w-32 rounded shimmer-loader"></div>
          <div className="h-4 w-full rounded shimmer-loader"></div>
          <div className="h-4 w-full rounded shimmer-loader"></div>
          <div className="h-4 w-5/6 rounded shimmer-loader"></div>
        </div>
        <div className="h-14 rounded-2xl shimmer-loader w-full mt-6"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-festival-creamDark animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg shimmer-loader"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded shimmer-loader"></div>
            <div className="h-3 w-20 rounded shimmer-loader"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 rounded shimmer-loader"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 rounded shimmer-loader"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 rounded shimmer-loader"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded shimmer-loader"></div>
          <div className="w-8 h-8 rounded shimmer-loader"></div>
        </div>
      </td>
    </tr>
  );
};

export const CardGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
export default CardGridSkeleton;
