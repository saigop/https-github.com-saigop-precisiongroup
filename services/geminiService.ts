import type { AnalysisData, CompetitorAnalysis, Retailer, RatingCategory } from '../types';

// This is a mock service. In a real application, this would interact
// with the Gemini API or your AWS Bedrock RAG backend.

const MOCK_COMPETITORS = [
  'Chic Boutique', 'Vogue Retail', 'The Fashion Hub', 'Modern Attire', 
  'Elegant Threads', 'Urban Styles', 'Classic Wear', 'The Trendsetters'
];

const MOCK_ATTRIBUTES = ['Service', 'Ambiance', 'Value', 'Selection'];

const getRandomRating = (): { category: RatingCategory; reviewCount: number } => {
  const rand = Math.random();
  const reviewCount = Math.floor(Math.random() * 200) + 10;
  if (rand > 0.8) return { category: 'Excellent', reviewCount };
  if (rand > 0.5) return { category: 'Good', reviewCount };
  if (rand > 0.2) return { category: 'Average', reviewCount };
  return { category: 'Poor', reviewCount };
};

// FIX: Create a new function to generate overall ratings including a score to match the CompetitorAnalysis type.
const getRandomOverallRating = (): CompetitorAnalysis['overallRating'] => {
  const rating = getRandomRating();
  let score = 0;
  switch (rating.category) {
      case 'Excellent':
          score = 4.5 + Math.random() * 0.5;
          break;
      case 'Good':
          score = 3.5 + Math.random();
          break;
      case 'Average':
          score = 2.5 + Math.random();
          break;
      case 'Poor':
          score = 1.0 + Math.random() * 1.5;
          break;
  }
  return {
      ...rating,
      score: parseFloat(score.toFixed(1))
  };
};

const mockSentimentSummaries = [
    "Customers consistently praise the excellent customer service and friendly staff. However, some reviews mention that prices are slightly higher than competitors. The store's ambiance is often highlighted as a major positive.",
    "Mixed reviews on value, with some customers finding it overpriced. The product selection is generally well-regarded, but stock levels can be inconsistent. Staff helpfulness is a recurring theme.",
    "A popular choice for its competitive pricing and value. While the selection is vast, some customers find the store layout chaotic. The checkout process is frequently mentioned as slow.",
    "Highly rated for its unique selection and modern ambiance. Service receives polarizing reviews, with some finding staff attentive and others dismissive. Returns policy is noted as being strict."
];

const mockKeyMentions = [
    { term: 'Helpful Staff', count: 89 },
    { term: 'Clean Store', count: 72 },
    { term: 'Good Prices', count: 65 },
    { term: 'Long Lines', count: 41 },
    { term: 'Easy Returns', count: 35 },
];

const generateMockData = (retailer: Retailer): AnalysisData => {
  const competitorsData = MOCK_COMPETITORS.slice(0, 5 + Math.floor(Math.random() * 3)).map((name, index) => {
    const attributes: { [key: string]: { category: RatingCategory; reviewCount: number } } = {};
    MOCK_ATTRIBUTES.forEach(attr => {
      attributes[attr] = getRandomRating();
    });

    return {
      id: `${retailer.id}-${index + 2}`,
      name,
      isPrimary: false,
      // FIX: Use getRandomOverallRating to ensure 'score' property is present.
      overallRating: getRandomOverallRating(),
      attributes,
      sentimentSummary: mockSentimentSummaries[index % mockSentimentSummaries.length],
      keyMentions: [...mockKeyMentions].sort(() => 0.5 - Math.random()).slice(0, 3).map(m => ({...m, count: Math.floor(m.count * (0.5 + Math.random()))})),
    };
  });

  const primaryRetailerAttributes: { [key: string]: { category: RatingCategory; reviewCount: number } } = {};
    MOCK_ATTRIBUTES.forEach(attr => {
      primaryRetailerAttributes[attr] = getRandomRating();
    });

  const primaryData = {
    id: retailer.id,
    name: retailer.name.split(' - ')[1],
    isPrimary: true,
    // FIX: Use getRandomOverallRating to ensure 'score' property is present.
    overallRating: getRandomOverallRating(),
    attributes: primaryRetailerAttributes,
    sentimentSummary: "The primary retailer shows strong performance in service and ambiance, attracting positive feedback. However, value perception is an area for improvement, as some customers feel prices don't align with quality. Selection is good but could be expanded to match key competitors.",
    keyMentions: [...mockKeyMentions].sort(() => 0.5 - Math.random()).slice(0, 3).map(m => ({...m, count: Math.floor(m.count * (0.8 + Math.random()*0.4))})),
  };
  
  const allCompetitors = [primaryData, ...competitorsData].sort((a, b) => b.overallRating.reviewCount - a.overallRating.reviewCount);

  return {
    retailer,
    competitors: allCompetitors,
    attributes: MOCK_ATTRIBUTES,
  };
};

export const getReviewAnalysis = (retailer: Retailer, timePeriod: string): Promise<AnalysisData> => {
  console.log(`Fetching analysis for ${retailer.name} for the period: ${timePeriod}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateMockData(retailer));
    }, 1000 + Math.random() * 500); // Simulate network delay
  });
};
