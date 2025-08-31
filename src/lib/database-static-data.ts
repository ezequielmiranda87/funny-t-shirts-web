import { Product } from '@/app/api/products/route';

/**
 * Static data for build-time performance
 * This avoids database initialization overhead during Next.js build process
 */
export function getInitialProductsForBuild(): Product[] {
  return [
    // Original 12 products + 20 new products (same as database initialization)
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
    },
    // 20 new products (IDs 13-32)
    {
      id: '13',
      name: 'My Code Doesn\'t Have Bugs, It Has Unexpected Features',
      price: 23.99,
      image: 'https://picsum.photos/800/800?random=13',
      description: 'Every developer needs this shirt. Perfect for explaining why your app crashes in creative ways.',
      category: 'Tech',
      stock: 19,
      reviews: [
        {
          id: '25',
          userName: 'FeatureEngineer',
          rating: 5,
          comment: 'My QA team finally gets it now!',
          date: '2024-02-01'
        }
      ],
      similarProducts: ['4', '8', '10']
    },
    {
      id: '14',
      name: 'I\'m Not Ignoring You, I\'m on Airplane Mode',
      price: 21.99,
      image: 'https://picsum.photos/800/800?random=14',
      description: 'Sometimes you need to disconnect from people, not just WiFi.',
      category: 'Antisocial',
      stock: 17,
      reviews: [
        {
          id: '26',
          userName: 'IntrovertLife',
          rating: 4,
          comment: 'Perfect excuse for avoiding small talk.',
          date: '2024-02-02'
        }
      ],
      similarProducts: ['3', '15', '16']
    },
    {
      id: '15',
      name: 'Professional Overthinker',
      price: 20.99,
      image: 'https://picsum.photos/800/800?random=15',
      description: 'When regular thinking just isn\'t enough. Expert level anxiety included.',
      category: 'Anxiety',
      stock: 24,
      reviews: [
        {
          id: '27',
          userName: 'ThoughtSpiral',
          rating: 5,
          comment: 'Finally, a job title that fits!',
          date: '2024-02-03'
        }
      ],
      similarProducts: ['14', '16', '17']
    },
    {
      id: '16',
      name: 'Currently Accepting Snacks as Payment',
      price: 19.99,
      image: 'https://picsum.photos/800/800?random=16',
      description: 'Broke but honest. Will work for food, preferably cookies.',
      category: 'Food',
      stock: 28,
      reviews: [
        {
          id: '28',
          userName: 'SnackLover',
          rating: 5,
          comment: 'Got three job offers after wearing this!',
          date: '2024-02-04'
        }
      ],
      similarProducts: ['17', '18', '19']
    },
    {
      id: '17',
      name: 'I Don\'t Need Google, My Wife Knows Everything',
      price: 22.99,
      image: 'https://picsum.photos/800/800?random=17',
      description: 'Why search the internet when you have a human encyclopedia at home?',
      category: 'Marriage',
      stock: 15,
      reviews: [
        {
          id: '29',
          userName: 'HappyHubby',
          rating: 5,
          comment: 'My wife bought me three more of these.',
          date: '2024-02-05'
        }
      ],
      similarProducts: ['18', '19', '20']
    },
    {
      id: '18',
      name: 'Weekend Loading... Please Wait',
      price: 21.99,
      image: 'https://picsum.photos/800/800?random=18',
      description: 'Friday can\'t come fast enough. Currently buffering happiness.',
      category: 'Weekend',
      stock: 32,
      reviews: [
        {
          id: '30',
          userName: 'FridayFan',
          rating: 4,
          comment: 'Wearing this every Wednesday for motivation.',
          date: '2024-02-06'
        }
      ],
      similarProducts: ['8', '10', '19']
    },
    {
      id: '19',
      name: 'Exercise? I Thought You Said Extra Fries',
      price: 20.99,
      image: 'https://picsum.photos/800/800?random=19',
      description: 'Mishearing things has never been more delicious.',
      category: 'Food',
      stock: 26,
      reviews: [
        {
          id: '31',
          userName: 'FryFanatic',
          rating: 5,
          comment: 'This shirt speaks my language!',
          date: '2024-02-07'
        }
      ],
      similarProducts: ['16', '20', '21']
    },
    {
      id: '20',
      name: 'I\'m Not Procrastinating, I\'m Doing Side Quests',
      price: 23.99,
      image: 'https://picsum.photos/800/800?random=20',
      description: 'Every task avoidance is just character development in the game of life.',
      category: 'Gaming',
      stock: 18,
      reviews: [
        {
          id: '32',
          userName: 'QuestMaster',
          rating: 5,
          comment: 'Finally someone who gets my productivity strategy!',
          date: '2024-02-08'
        }
      ],
      similarProducts: ['3', '21', '22']
    },
    {
      id: '21',
      name: 'Relationship Status: Committed to Pizza',
      price: 19.99,
      image: 'https://picsum.photos/800/800?random=21',
      description: 'Pizza never lets you down, never argues, and always satisfies.',
      category: 'Food',
      stock: 30,
      reviews: [
        {
          id: '33',
          userName: 'PizzaLoyalist',
          rating: 5,
          comment: 'Pizza is the only relationship I need.',
          date: '2024-02-09'
        }
      ],
      similarProducts: ['16', '19', '22']
    },
    {
      id: '22',
      name: 'Powered by Caffeine and Questionable Decisions',
      price: 22.99,
      image: 'https://picsum.photos/800/800?random=22',
      description: 'The perfect fuel combination for modern life adventures.',
      category: 'Coffee',
      stock: 14,
      reviews: [
        {
          id: '34',
          userName: 'CaffeineQueen',
          rating: 4,
          comment: 'Story of my life in one shirt.',
          date: '2024-02-10'
        }
      ],
      similarProducts: ['2', '23', '24']
    },
    {
      id: '23',
      name: 'I\'m Not Antisocial, I\'m Selectively Social',
      price: 21.99,
      image: 'https://picsum.photos/800/800?random=23',
      description: 'Quality over quantity applies to social interactions too.',
      category: 'Antisocial',
      stock: 22,
      reviews: [
        {
          id: '35',
          userName: 'SelectiveSocializer',
          rating: 5,
          comment: 'Perfect explanation for my social choices.',
          date: '2024-02-11'
        }
      ],
      similarProducts: ['14', '24', '25']
    },
    {
      id: '24',
      name: 'Default Mode: Sarcasm Activated',
      price: 20.99,
      image: 'https://picsum.photos/800/800?random=24',
      description: 'Warning label for those who haven\'t figured out my communication style yet.',
      category: 'Sarcastic',
      stock: 27,
      reviews: [
        {
          id: '36',
          userName: 'SarcasmExpert',
          rating: 5,
          comment: 'Finally, a user manual for my personality!',
          date: '2024-02-12'
        }
      ],
      similarProducts: ['1', '6', '25']
    },
    {
      id: '25',
      name: 'Sleep is for People Without Internet',
      price: 19.99,
      image: 'https://picsum.photos/800/800?random=25',
      description: 'Why sleep when there are memes to browse and videos to watch?',
      category: 'Tech',
      stock: 16,
      reviews: [
        {
          id: '37',
          userName: 'NightOwl',
          rating: 4,
          comment: '3 AM shirt shopping confirms this message.',
          date: '2024-02-13'
        }
      ],
      similarProducts: ['13', '26', '27']
    },
    {
      id: '26',
      name: 'I\'m Not Addicted to Reading, I Can Quit Anytime',
      price: 21.99,
      image: 'https://picsum.photos/800/800?random=26',
      description: 'Said while hiding a stack of unread books behind my back.',
      category: 'Books',
      stock: 19,
      reviews: [
        {
          id: '38',
          userName: 'Bookworm',
          rating: 5,
          comment: 'Wearing this while buying more books.',
          date: '2024-02-14'
        }
      ],
      similarProducts: ['27', '28', '29']
    },
    {
      id: '27',
      name: 'Work Hard, Nap Harder',
      price: 20.99,
      image: 'https://picsum.photos/800/800?random=27',
      description: 'Professional productivity balanced with expert-level relaxation.',
      category: 'Lazy',
      stock: 25,
      reviews: [
        {
          id: '39',
          userName: 'NapChampion',
          rating: 5,
          comment: 'My life philosophy in shirt form.',
          date: '2024-02-15'
        }
      ],
      similarProducts: ['3', '28', '29']
    },
    {
      id: '28',
      name: 'I Speak Fluent Movie Quotes',
      price: 22.99,
      image: 'https://picsum.photos/800/800?random=28',
      description: 'Why use original thoughts when cinema has already said it better?',
      category: 'Movies',
      stock: 21,
      reviews: [
        {
          id: '40',
          userName: 'CinemaQuoter',
          rating: 4,
          comment: 'That\'s just like, your opinion, man.',
          date: '2024-02-16'
        }
      ],
      similarProducts: ['29', '30', '31']
    },
    {
      id: '29',
      name: 'Chaos Coordinator',
      price: 23.99,
      image: 'https://picsum.photos/800/800?random=29',
      description: 'Someone has to organize all this beautiful madness.',
      category: 'Office',
      stock: 17,
      reviews: [
        {
          id: '41',
          userName: 'MasterOfChaos',
          rating: 5,
          comment: 'Perfect job title for my resume!',
          date: '2024-02-17'
        }
      ],
      similarProducts: ['9', '30', '31']
    },
    {
      id: '30',
      name: 'I\'m Not Yelling, This is My Enthusiastic Voice',
      price: 21.99,
      image: 'https://picsum.photos/800/800?random=30',
      description: 'Sometimes passion sounds like volume. Enthusiasm included.',
      category: 'Personality',
      stock: 23,
      reviews: [
        {
          id: '42',
          userName: 'EnthusiasticOne',
          rating: 4,
          comment: 'Finally people understand my communication style!',
          date: '2024-02-18'
        }
      ],
      similarProducts: ['31', '32', '1']
    },
    {
      id: '31',
      name: 'Multitasking: Screwing Up Several Things at Once',
      price: 20.99,
      image: 'https://picsum.photos/800/800?random=31',
      description: 'Why fail at one thing when you can fail at everything simultaneously?',
      category: 'Office',
      stock: 20,
      reviews: [
        {
          id: '43',
          userName: 'MultiTasker',
          rating: 5,
          comment: 'This shirt describes my work day perfectly.',
          date: '2024-02-19'
        }
      ],
      similarProducts: ['9', '29', '32']
    },
    {
      id: '32',
      name: 'I Put the Pro in Procrastination',
      price: 19.99,
      image: 'https://picsum.photos/800/800?random=32',
      description: 'Professional level delay tactics. I\'ll start tomorrow, I promise.',
      category: 'Lazy',
      stock: 29,
      reviews: [
        {
          id: '44',
          userName: 'DelayExpert',
          rating: 5,
          comment: 'I\'ll write a proper review later.',
          date: '2024-02-20'
        }
      ],
      similarProducts: ['3', '20', '27']
    }
  ];
}