import { NextResponse } from 'next/server';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  reviews: Review[];
  similarProducts: string[];
  category: string;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Simulate slow loading with a delay
async function simulateSlowAPI() {
  return new Promise(resolve => {
    setTimeout(resolve, 2000); // 2 second delay to simulate slow API
  });
}

// Mock data for funny t-shirts with all details loaded at once
const products: Product[] = [
  {
    id: '1',
    name: 'I\'m Not Arguing, I\'m Just Explaining Why I\'m Right',
    price: 19.99,
    image: 'https://picsum.photos/800/800?random=1',
    description: 'Perfect for those heated discussions where you know you\'re absolutely correct. Made from 100% cotton for maximum comfort during debates.',
    category: 'Sarcastic',
    stock: 15,
    reviews: [
      {
        id: '1',
        userName: 'DebateMaster',
        rating: 5,
        comment: 'Wore this to a family dinner. Can confirm it works perfectly!',
        date: '2024-01-15'
      },
      {
        id: '2',
        userName: 'LogicLover',
        rating: 4,
        comment: 'Great quality shirt, even better conversation starter.',
        date: '2024-01-20'
      }
    ],
    similarProducts: ['2', '3', '4']
  },
  {
    id: '2',
    name: 'Coffee: Because Murder is Wrong',
    price: 22.99,
    image: 'https://picsum.photos/800/800?random=2',
    description: 'For those mornings when your caffeine levels determine everyone else\'s safety. Dark humor meets darker roast.',
    category: 'Coffee',
    stock: 8,
    reviews: [
      {
        id: '3',
        userName: 'CoffeAddict',
        rating: 5,
        comment: 'My coworkers finally understand why I need my morning coffee.',
        date: '2024-01-18'
      },
      {
        id: '4',
        userName: 'MorningGrump',
        rating: 5,
        comment: 'This shirt speaks to my soul. And warns others.',
        date: '2024-01-22'
      }
    ],
    similarProducts: ['1', '5', '6']
  },
  {
    id: '3',
    name: 'I\'m Not Lazy, I\'m on Energy Saving Mode',
    price: 18.99,
    image: 'https://picsum.photos/800/800?random=3',
    description: 'Environmentally conscious laziness at its finest. Perfect for couch potatoes with a sense of humor.',
    category: 'Lazy',
    stock: 22,
    reviews: [
      {
        id: '5',
        userName: 'CouchPotato',
        rating: 4,
        comment: 'Finally, someone who understands my lifestyle choices.',
        date: '2024-01-12'
      },
      {
        id: '6',
        userName: 'EcoWarrior',
        rating: 3,
        comment: 'Good message, decent quality. Could be softer.',
        date: '2024-01-25'
      }
    ],
    similarProducts: ['4', '7', '8']
  },
  {
    id: '4',
    name: 'Error 404: Motivation Not Found',
    price: 21.99,
    image: 'https://picsum.photos/800/800?random=4',
    description: 'For the programmers and tech-savvy folks who understand that sometimes the system just isn\'t responding.',
    category: 'Tech',
    stock: 12,
    reviews: [
      {
        id: '7',
        userName: 'CodeMonkey',
        rating: 5,
        comment: 'My manager saw this and bought the whole team matching shirts.',
        date: '2024-01-14'
      },
      {
        id: '8',
        userName: 'BugHunter',
        rating: 4,
        comment: 'Wearing this during debugging sessions for maximum irony.',
        date: '2024-01-19'
      }
    ],
    similarProducts: ['3', '9', '10']
  },
  {
    id: '5',
    name: 'I\'m Not Short, I\'m Fun-Sized',
    price: 20.99,
    image: 'https://picsum.photos/800/800?random=5',
    description: 'Embrace your compact awesomeness. Great things come in small packages, just like candy bars.',
    category: 'Self-Love',
    stock: 18,
    reviews: [
      {
        id: '9',
        userName: 'PocketRocket',
        rating: 5,
        comment: 'Finally, a shirt that celebrates being vertically challenged!',
        date: '2024-01-16'
      },
      {
        id: '10',
        userName: 'SmallButMighty',
        rating: 4,
        comment: 'Love the message, fits perfectly (obviously).',
        date: '2024-01-21'
      }
    ],
    similarProducts: ['6', '11', '12']
  },
  {
    id: '6',
    name: 'Sarcasm: Just One of My Many Talents',
    price: 19.99,
    image: 'https://picsum.photos/800/800?random=6',
    description: 'Modestly showcasing your extensive skill set. Warning: may cause increased requests for demonstrations.',
    category: 'Sarcastic',
    stock: 25,
    reviews: [
      {
        id: '11',
        userName: 'SarcasmQueen',
        rating: 5,
        comment: 'People keep asking about my other talents. The shirt works!',
        date: '2024-01-13'
      },
      {
        id: '12',
        userName: 'WittyOne',
        rating: 5,
        comment: 'Excellent quality, even better attitude.',
        date: '2024-01-24'
      }
    ],
    similarProducts: ['1', '7', '8']
  },
  {
    id: '7',
    name: 'I\'m Not Weird, I\'m Limited Edition',
    price: 23.99,
    image: 'https://picsum.photos/800/800?random=7',
    description: 'Celebrate your uniqueness with this exclusive mindset. Perfect for those who march to their own drumbeat.',
    category: 'Self-Love',
    stock: 10,
    reviews: [
      {
        id: '13',
        userName: 'UniqueOne',
        rating: 4,
        comment: 'Love being limited edition! Shirt quality matches the message.',
        date: '2024-01-17'
      },
      {
        id: '14',
        userName: 'CollectorItem',
        rating: 5,
        comment: 'Rare find, just like me. Perfect fit and message.',
        date: '2024-01-23'
      }
    ],
    similarProducts: ['5', '9', '10']
  },
  {
    id: '8',
    name: 'Loading... Please Wait (99% Complete)',
    price: 21.99,
    image: 'https://picsum.photos/800/800?random=8',
    description: 'For those perpetually almost-ready moments. The perfect shirt for procrastinators and perfectionists alike.',
    category: 'Tech',
    stock: 14,
    reviews: [
      {
        id: '15',
        userName: 'AlmostThere',
        rating: 4,
        comment: 'Been waiting for the right shirt. This is 99% perfect!',
        date: '2024-01-11'
      },
      {
        id: '16',
        userName: 'BufferingLife',
        rating: 5,
        comment: 'Story of my life in shirt form. Love it!',
        date: '2024-01-26'
      }
    ],
    similarProducts: ['4', '11', '12']
  },
  {
    id: '9',
    name: 'I Survived Another Meeting That Could Have Been an Email',
    price: 22.99,
    image: 'https://picsum.photos/800/800?random=9',
    description: 'A badge of honor for office warriors everywhere. Wear your meeting survival proudly.',
    category: 'Office',
    stock: 20,
    reviews: [
      {
        id: '17',
        userName: 'MeetingSurvivor',
        rating: 5,
        comment: 'HR loved this shirt. Bought one for the whole team!',
        date: '2024-01-10'
      },
      {
        id: '18',
        userName: 'EmailAdvocate',
        rating: 4,
        comment: 'Wearing this to every unnecessary meeting from now on.',
        date: '2024-01-27'
      }
    ],
    similarProducts: ['10', '4', '7']
  },
  {
    id: '10',
    name: 'Ctrl+Alt+Delete Monday',
    price: 20.99,
    image: 'https://picsum.photos/800/800?random=10',
    description: 'Sometimes you just need to restart the week. Perfect for those tough Monday mornings.',
    category: 'Tech',
    stock: 16,
    reviews: [
      {
        id: '19',
        userName: 'MondayHater',
        rating: 5,
        comment: 'This shirt perfectly captures my Monday mood.',
        date: '2024-01-08'
      },
      {
        id: '20',
        userName: 'WeekendLover',
        rating: 4,
        comment: 'Great for expressing my feelings about Monday without words.',
        date: '2024-01-15'
      }
    ],
    similarProducts: ['4', '8', '9']
  },
  {
    id: '11',
    name: 'Running Late is My Cardio',
    price: 19.99,
    image: 'https://picsum.photos/800/800?random=11',
    description: 'Who needs a gym membership when you\'re perpetually behind schedule? Stay fit, stay stressed.',
    category: 'Fitness',
    stock: 13,
    reviews: [
      {
        id: '21',
        userName: 'AlwaysRushing',
        rating: 5,
        comment: 'Finally, someone who understands my workout routine!',
        date: '2024-01-09'
      },
      {
        id: '22',
        userName: 'TimeChallenger',
        rating: 4,
        comment: 'This shirt gets me. Great quality too.',
        date: '2024-01-28'
      }
    ],
    similarProducts: ['12', '5', '7']
  },
  {
    id: '12',
    name: 'I\'m Not Clumsy, The Floor Just Hates Me',
    price: 18.99,
    image: 'https://picsum.photos/800/800?random=12',
    description: 'It\'s not you, it\'s the floor. And the walls. And that table that came out of nowhere.',
    category: 'Clumsy',
    stock: 21,
    reviews: [
      {
        id: '23',
        userName: 'GracefullyClumsy',
        rating: 5,
        comment: 'The floor really does have it out for me! This shirt speaks truth.',
        date: '2024-01-07'
      },
      {
        id: '24',
        userName: 'AccidentProne',
        rating: 4,
        comment: 'Wore this after my latest mishap. People finally understand.',
        date: '2024-01-29'
      }
    ],
    similarProducts: ['11', '8', '6']
  }
];

export async function GET() {
  // Simulate slow API response
  await simulateSlowAPI();
  
  // Return ALL products with ALL their details at once
  return NextResponse.json({
    products,
    total: products.length,
    message: 'All products loaded at once - this is inefficient!'
  });
}