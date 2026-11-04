export interface SoundscapeTrack {
  id: string;
  title: string;
  category: 'nature' | 'whitenoise' | 'meditation' | 'lullaby';
  durationDesc: string;
  iconName: string;
  description: string;
  synthType: 'rain' | 'ocean' | 'forest' | 'white-noise' | 'tibetan-bowls';
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: 's1',
    title: 'Gentle Summer Rain & Rooftop Droplets',
    category: 'nature',
    durationDesc: 'Continuous Loop',
    iconName: 'CloudRain',
    description: 'Soft patter of warm rain calming maternal heart rate and easing insomnia.',
    synthType: 'rain'
  },
  {
    id: 's2',
    title: 'Rolling Ocean Waves & Tidal Breathing',
    category: 'nature',
    durationDesc: 'Continuous Loop',
    iconName: 'Waves',
    description: 'Rhythmic swells timed to sync with slow diaphragmatic relaxation cycles.',
    synthType: 'ocean'
  },
  {
    id: 's3',
    title: 'Warm Pink Noise & Womb Heartbeat Resonance',
    category: 'whitenoise',
    durationDesc: 'Continuous Loop',
    iconName: 'Activity',
    description: 'Mimics the familiar rhythmic whooshing of maternal blood flow and uterine tranquility.',
    synthType: 'white-noise'
  },
  {
    id: 's4',
    title: 'Misty Pine Forest & Distant Morning Songbirds',
    category: 'nature',
    durationDesc: 'Continuous Loop',
    iconName: 'Trees',
    description: 'Gentle breeze whispering through pine needles with serene birdsong.',
    synthType: 'forest'
  },
  {
    id: 's5',
    title: 'Deep Tibetan Singing Bowls & Delta Sleep Waves',
    category: 'meditation',
    durationDesc: 'Continuous Loop',
    iconName: 'Sparkles',
    description: 'Harmonic resonant frequencies releasing muscular tension in hips and spine.',
    synthType: 'tibetan-bowls'
  }
];

export interface SleepStory {
  id: string;
  title: string;
  narrator: string;
  duration: string;
  summary: string;
  textSnippet: string;
}

export const SLEEP_STORIES: SleepStory[] = [
  {
    id: 'st1',
    title: 'The Starlit Cradle: A Journey Over Silver Hills',
    narrator: 'Bloom Calming Voice',
    duration: '15 mins',
    summary: 'A slow, enchanting visualization taking you across twilight meadows where the evening breeze carries warmth to you and your growing baby.',
    textSnippet: 'Close your eyes. Soften your jaw and let your shoulders melt back into your pillows. Beneath the vast indigo sky, a gentle silver river winds through fragrant jasmine hills. With every breath you take, your body releases the weight of the day, creating a sanctuary of quiet safety for you and the tiny heartbeat nestled within you...'
  },
  {
    id: 'st2',
    title: 'The Secret Lavender Sanctuary',
    narrator: 'Bloom Calming Voice',
    duration: '20 mins',
    summary: 'Wander through purple sunlit terraces surrounded by warm honeybees and the gentle fragrance of relaxation.',
    textSnippet: 'Imagine a stone pathway bordered by flowering lavender. The sun has begun to set, casting golden peach light across the stone steps. You take slow, measured steps, feeling supported, deeply nourished, and grounded. Breathe in the cool, soothing herbal air...'
  }
];
