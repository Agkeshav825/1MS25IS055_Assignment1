export interface Flashcard {
  front: string;
  back: string;
  category?: string;
  mastered?: boolean;
}

export interface Takeaway {
  title: string;
  plainLanguage: string;
  corporateSpeakVsMeaning?: {
    corporateText: string;
    plainMeaning: string;
  };
  metrics: string[];
  filingQuote?: string;
  isNotProvided?: boolean;
}

export interface MetricKPI {
  label: string;
  value: string;
  yoy?: string;
  isProvided: boolean;
  context?: string;
}

export interface RiskFactor {
  category: 'supply_chain' | 'market' | 'regulatory' | 'geopolitical';
  title: string;
  plainLanguageImpact: string;
  filingExcerpt: string;
  severity: 'high' | 'moderate' | 'monitoring';
}

export interface TokenUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  budgetLimit: number; // 25,000 tokens
  percentUsed: number;
}

export interface AnalysisResult {
  rawResponse: string;
  companyName?: string;
  reportingPeriod?: string;
  executiveSummary: {
    takeaways: Takeaway[];
    kpis: MetricKPI[];
  };
  riskFactors: RiskFactor[];
  flashcards: Flashcard[];
  tokenUsage: TokenUsage;
  groundingAudit: {
    strictDocumentDataOnly: boolean;
    missingMetricsReported: string[];
    analyzedTimestamp: string;
    documentSnippetPreview?: string;
  };
  analystQuestions?: string[];
}

export interface SampleReport {
  id: string;
  ticker: string;
  company: string;
  quarter: string;
  tagline: string;
  icon: string;
  content: string;
}
