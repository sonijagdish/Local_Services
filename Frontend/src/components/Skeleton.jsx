const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl ${className}`} />
  );
};

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-10 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700/50 space-y-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="w-24 h-6 rounded-full" />
                            <Skeleton className="w-32 h-4 rounded-full" />
                        </div>
                        <Skeleton className="w-3/4 h-10 rounded-xl" />
                        <div className="flex gap-4">
                            <Skeleton className="w-24 h-8 rounded-lg" />
                            <Skeleton className="w-24 h-8 rounded-lg" />
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <Skeleton className="w-24 h-10 rounded-xl" />
                            <Skeleton className="w-32 h-12 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
                    <Skeleton className="w-24 h-4 rounded-full" />
                    <Skeleton className="w-1/2 h-10 rounded-xl" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="w-24 h-4 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
