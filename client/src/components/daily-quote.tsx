import { useQuery } from "@tanstack/react-query";

interface Quote {
  text: string;
  author: string;
}

export default function DailyQuote() {
  const { data: quote, isLoading } = useQuery<Quote>({
    queryKey: ["/api/quote"],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  if (isLoading) {
    return (
      <div className="text-center mb-12 max-w-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-white bg-opacity-20 rounded mb-3"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center mb-12 max-w-2xl">
        <blockquote className="text-lg md:text-xl font-light text-white opacity-90 italic leading-relaxed">
          "The present moment is the only time over which we have dominion."
        </blockquote>
        <cite className="block mt-3 text-sm text-white opacity-70">
          — Thich Nhat Hanh
        </cite>
      </div>
    );
  }

  return (
    <div className="text-center mb-12 max-w-2xl">
      <blockquote className="text-lg md:text-xl font-light text-white opacity-90 italic leading-relaxed">
        "{quote.text}"
      </blockquote>
      <cite className="block mt-3 text-sm text-white opacity-70">
        — {quote.author}
      </cite>
    </div>
  );
}
