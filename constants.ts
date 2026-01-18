
import { Article, Category } from './types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Architecting Real-time AI with Gemini Live',
    excerpt: 'My experience building a low-latency voice interface using the native audio capabilities of Gemini 2.5 Flash.',
    category: Category.LLM,
    author: 'BrainCare Lead',
    date: '2024-06-01',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    tags: ['Live API', 'WebSockets', 'AI Architecture'],
    language: 'typescript',
    code: `// Connecting to the Live API Session
const sessionPromise = ai.live.connect({
  model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  config: {
    responseModalities: [Modality.AUDIO],
    speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
    }
  },
  callbacks: {
    onmessage: (msg) => handleRealtimeResponse(msg)
  }
});`,
    content: `When I first started experimenting with Gemini's Live API, the challenge wasn't the AI itself—it was the orchestration of raw PCM audio buffers.

In this deep dive, I share how I solved the 'audio stutter' problem by implementing a custom nextStartTime cursor for gapless playback. This project taught me more about browser AudioContext than any tutorial ever could.

Key Insights:
- Why raw PCM is better than encoded streams for latency.
- Managing the race condition between session connection and media input.
- Designing a responsive 'thinking' UI state during silent periods.`
  },
  {
    id: '2',
    title: 'The Future of Neural-Symbolic Reasoning',
    excerpt: 'Why LLMs need a symbolic backbone. My personal take on the merging of logic systems and probabilistic models.',
    category: Category.AGENT,
    author: 'BrainCare Lead',
    date: '2024-05-28',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    tags: ['Neural-Symbolic', 'LLM', 'Logic'],
    language: 'python',
    code: `def solve_complex_logic(prompt):
    # Probabilistic generation
    raw_response = model.generate(prompt)
    
    # Symbolic verification (The 'BrainCare' Logic Layer)
    is_valid = symbolic_engine.verify(raw_response)
    
    if not is_valid:
        return symbolic_engine.repair(raw_response)
    return raw_response`,
    content: `I've noticed a recurring pattern in production AI: purely probabilistic models eventually hallucinate on logical constraints. 

Neural-symbolic AI is my preferred solution. By wrapping LLM outputs in a formal logic verifier, we get the best of both worlds: human-like creativity and mathematical rigor.

I call this the 'Guardian Logic' pattern. It ensures that the 'Brain' part of my projects actually 'Cares' about the truth.`
  },
  {
    id: '3',
    title: 'Optimizing Token Density in Prompts',
    excerpt: 'A technical snippet for compressing long context windows without losing semantic meaning.',
    category: Category.CODE,
    author: 'BrainCare Lead',
    date: '2024-05-20',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    tags: ['Optimization', 'Prompt Engineering', 'Efficiency'],
    language: 'javascript',
    code: `const compressPrompt = (text) => {
  return text
    .replace(/\\s+/g, ' ')
    .replace(/(\\w+)\\1+/gi, '$1') // Simple deduplication
    .split('.')
    .filter(sentence => isHighSalience(sentence))
    .join('.');
};`,
    content: `Token management is essentially cost management. In this short insight, I share the utility function I use to strip 'fluff' from user-provided context before hitting the API.

Small optimizations like these saved over 15% on monthly API costs for my recent enterprise AI integration. It's about being efficient without sacrificing the intelligence of the output.`
  }
];
