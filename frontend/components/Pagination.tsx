import React from 'react';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-coffee-100/50 text-coffee-950 hover:bg-coffee-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm premium-shadow"
            >
                <ArrowRight className="w-5 h-5 rotate-180" />
            </button>

            <div className="flex items-center gap-2">
                {[ ...Array(totalPages) ].map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;

                    // Only show current, next, prev, first, last if many pages
                    if (totalPages > 7) {
                        if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                            if (Math.abs(page - currentPage) === 2) return <span key={page} className="text-coffee-300 mx-1">...</span>;
                            return null;
                        }
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${isActive
                                ? 'bg-coffee-900 text-white shadow-xl scale-110 translate-y-[-2px]'
                                : 'bg-white/50 text-coffee-400 hover:text-coffee-900 hover:bg-white border border-transparent hover:border-coffee-100'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-coffee-100/50 text-coffee-950 hover:bg-coffee-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm premium-shadow"
            >
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
