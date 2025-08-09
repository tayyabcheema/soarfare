import { NextApiRequest, NextApiResponse } from 'next';

interface Blog {
  title: string;
  image: string;
  created_at: string;
  slug: string;
  content: string;
}

interface BlogResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      data: {
        blogs: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 0,
          from: 1,
          to: 0
        }
      }
    });
  }

  try {
    // Mock response based on the provided data
    const mockResponse: BlogResponse = {
      "success": true,
      "data": {
        "blogs": [
          {
            "title": "Top 5 Cheap Summer Travel Locations",
            "image": "/destination1.jpg",
            "created_at": "2021-07-31T16:39:27.000000Z",
            "slug": "top-5-cheap-summer-travel-locations",
            "content": "<p>Covid-19 completely changed our lives by halting everything and anything possible; it is difficult being cooped up within four walls with nothing to do but scroll social media and lament over the days we once had… Wait, is that Kim Kardashian hanging out on an island in the middle of a pandemic? Unfair!</p><h2>Why Summer Travel is Still Possible</h2><p>Despite the challenges, there are still amazing destinations that offer both affordability and safety. Here are our top 5 picks for budget-friendly summer travel:</p><img src='/destination2.jpg' alt='Beautiful summer destination' style='width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin: 20px 0;' /><h3>1. Portugal</h3><p>With its stunning coastline, historic cities, and affordable prices, Portugal offers incredible value for money. From the vibrant streets of <a href='https://www.visitlisboa.com' target='_blank' style='color: #2563eb; text-decoration: none;'>Lisbon</a> to the beautiful beaches of the Algarve, there's something for every traveler.</p><blockquote style='border-left: 4px solid #2563eb; padding-left: 16px; margin: 24px 0; font-style: italic; color: #6b7280;'>\"Portugal is one of Europe's best-kept secrets for budget travelers\" - Travel & Leisure Magazine</blockquote><h3>2. Greece</h3><p>The Greek islands are more accessible than ever, with many offering special deals for summer travelers. Experience ancient history, crystal-clear waters, and Mediterranean cuisine without breaking the bank.</p><h3>3. Eastern Europe</h3><p>Countries like <strong>Poland</strong>, <strong>Czech Republic</strong>, and <strong>Hungary</strong> offer rich culture, stunning architecture, and incredibly affordable prices. Your dollar will go much further here than in Western Europe.</p><ul><li>Prague's historic center - <em>UNESCO World Heritage site</em></li><li>Krakow's medieval architecture</li><li>Budapest's thermal baths and nightlife</li><li>Authentic local cuisine at fraction of Western European prices</li></ul><img src='/destination3.jpg' alt='Eastern European cityscape' style='width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin: 20px 0;' /><h3>4. Mexico</h3><p>From the beaches of Yucatan to the mountains of Oaxaca, Mexico offers diverse experiences at fraction of the cost of other tropical destinations. Don't miss:</p><ol><li><strong>Tulum</strong> - Ancient Mayan ruins by the sea</li><li><strong>Mexico City</strong> - World-class museums and street food</li><li><strong>Puerto Vallarta</strong> - Pacific coast beaches and culture</li></ol><h3>5. Southeast Asia</h3><p>Thailand, Vietnam, and Cambodia continue to offer exceptional value, with beautiful landscapes, rich culture, and delicious food at budget-friendly prices.</p><p style='background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;'><strong>💡 Pro Tip:</strong> Always check current travel restrictions and health guidelines before booking your trip. Visit <a href='https://www.cdc.gov/travel' target='_blank' style='color: #2563eb;'>CDC Travel Guidelines</a> for the latest information.</p>"
          },
          {
            "title": "Walked into 30 like an Egyptian",
            "image": "/destination2.jpg",
            "created_at": "2021-05-28T20:24:53.000000Z",
            "slug": "walked-into-30-like-an-egyptian",
            "content": "<p>As many of you know by now, I had a goal to visit 30 countries by 30 and obviously Covid did throw it for a loop, but I am happy to say I hit my goal!</p><h2>My Journey to 30 Countries</h2><p>Setting ambitious travel goals can seem daunting, but with proper planning and determination, they're absolutely achievable. Here's how I managed to visit 30 countries before turning 30, even with a global pandemic thrown into the mix.</p><h3>The Beginning</h3><p>It all started with a simple desire to see the world. I realized that if I wanted to travel extensively, I needed to start early and be strategic about it.</p><h3>Planning and Budgeting</h3><p>The key to extensive travel is smart budgeting. I learned to:</p><ul><li>Book flights well in advance</li><li>Travel during shoulder seasons</li><li>Use budget airlines for short-haul flights</li><li>Stay in hostels and budget accommodations</li><li>Eat like a local</li></ul><h3>The Pandemic Challenge</h3><p>When Covid-19 hit, I thought my goal was impossible. But I adapted by:</p><ul><li>Focusing on domestic travel when possible</li><li>Taking advantage of reduced flight prices</li><li>Planning future trips during lockdowns</li><li>Staying flexible with destinations</li></ul><h3>The Final Push</h3><p>Egypt was country number 30, and what a way to finish! The pyramids, the Nile, the incredible history – it was the perfect capstone to an amazing journey.</p><p>If you have travel goals, don't let obstacles stop you. Adapt, plan, and keep moving forward. The world is waiting!</p>"
          },
          {
            "title": "L. O. V is for Verona. E.",
            "image": "/destination3.jpg",
            "created_at": "2021-02-20T00:35:03.000000Z",
            "slug": "L-O-V-is-for-Verona-E",
            "content": "<p>One of the most challenging parts of any trip is booking the flight. Let SoarFare help get you that flight to Italy and then it's up to you to decide how to spend your Italian get away!</p><h2>Why Verona Should Be On Your List</h2><p>Verona, the city of Romeo and Juliet, is one of Italy's most romantic and historically rich destinations. Here's why you should consider it for your next Italian adventure.</p><h3>Rich History and Architecture</h3><p>Verona is home to some of the best-preserved Roman architecture outside of Rome itself. The Arena di Verona, a Roman amphitheater built in 30 AD, still hosts world-class opera performances today.</p><h3>Romantic Atmosphere</h3><p>Beyond the Shakespeare connection, Verona exudes romance at every corner. From intimate wine bars to candlelit restaurants overlooking the Adige River, it's perfect for couples.</p><h3>Gateway to Northern Italy</h3><p>Verona's location makes it an excellent base for exploring:</p><ul><li>Lake Garda - Italy's largest lake</li><li>Venice - just 1.5 hours by train</li><li>Milan - perfect for shopping and fashion</li><li>The Dolomites - for outdoor adventures</li></ul><h3>Food and Wine</h3><p>The Veneto region is famous for its wines, particularly Amarone and Prosecco. Pair these with local specialties like risotto all'Amarone and you're in for a treat.</p><h3>Getting There</h3><p>Verona has its own airport with connections throughout Europe, or you can easily reach it by train from major Italian cities. The city center is compact and walkable, making it perfect for a long weekend getaway.</p><p>Book your flight to Italy today and discover the magic of Verona!</p>"
          },
          {
            "title": "30 by 30",
            "image": "/destination4.jpg",
            "created_at": "2021-01-26T19:09:34.000000Z",
            "slug": "30-by-30",
            "content": "<p>My name is Chiara and I have a goal to visit 30 countries by my 30th year on earth! Let me tell you a little bit about myself and how I started my travel journey and set my goal!</p><h2>The Beginning of My Journey</h2><p>Travel wasn't always a passion of mine. Growing up in a small town, international travel seemed like something only wealthy people could afford. That all changed during my junior year of college when I studied abroad in Spain.</p><h3>The Spark</h3><p>That semester in Madrid opened my eyes to how much there was to see and experience in the world. I realized that with careful planning and budgeting, travel was much more accessible than I had thought.</p><h3>Setting the Goal</h3><p>On my 22nd birthday, I made a resolution: visit 30 countries before turning 30. At the time, I had only been to 3 countries, so this seemed like an enormous challenge.</p><h3>The Strategy</h3><p>To make this goal achievable, I developed a strategy:</p><ul><li><strong>Budget ruthlessly:</strong> I tracked every expense and cut unnecessary spending</li><li><strong>Travel smart:</strong> I learned to find deals, travel during off-peak times, and use budget accommodations</li><li><strong>Maximize trips:</strong> I planned routes that allowed me to visit multiple countries in one journey</li><li><strong>Work remotely:</strong> I negotiated remote work arrangements to extend my travels</li></ul><h3>The Countries</h3><p>Over the next 8 years, I explored:</p><ul><li>Europe: Spain, France, Italy, Germany, Netherlands, and more</li><li>Asia: Thailand, Japan, Singapore, Malaysia, Indonesia</li><li>Americas: Mexico, Canada, Colombia, Peru, Chile</li><li>Africa: Morocco, Egypt, South Africa</li><li>Oceania: Australia, New Zealand</li></ul><h3>Lessons Learned</h3><p>This journey taught me that travel is about more than just checking countries off a list. It's about personal growth, cultural understanding, and creating lasting memories.</p><p>If you have a travel goal, start planning today. The world is waiting for you!</p>"
          },
          {
            "title": "2021 - What Matters Most",
            "image": "/destination5.jpg",
            "created_at": "2021-01-12T04:38:35.000000Z",
            "slug": "2021-what-matters-most",
            "content": "<p>In 2021, people are most looking forward to unhindered travel and spending time with loved ones. According to new research conducted by Agoda, there are certain things that people are looking forward to most this year.</p><h2>Post-Pandemic Travel Priorities</h2><p>The pandemic has fundamentally changed how we think about travel. As we enter 2021, travelers are prioritizing different aspects of their journeys than ever before.</p><h3>Safety First</h3><p>Health and safety have become the top priority for travelers. This includes:</p><ul><li>Choosing destinations with strong health protocols</li><li>Flexible booking policies</li><li>Enhanced cleaning standards at accommodations</li><li>Easy access to healthcare while traveling</li></ul><h3>Meaningful Connections</h3><p>After months of isolation, people are craving genuine human connections. Travel in 2021 is about:</p><ul><li>Reuniting with family and friends</li><li>Supporting local communities</li><li>Engaging with local culture authentically</li><li>Creating deeper, more meaningful experiences</li></ul><h3>Nature and Wellness</h3><p>There's been a significant shift toward nature-based and wellness travel:</p><ul><li>National parks and outdoor destinations</li><li>Wellness retreats and spa experiences</li><li>Active travel and adventure tourism</li><li>Destinations that promote mental health and well-being</li></ul><h3>Slow Travel</h3><p>The trend toward slow travel has accelerated, with travelers preferring:</p><ul><li>Longer stays in fewer destinations</li><li>Immersive local experiences</li><li>Sustainable travel practices</li><li>Quality over quantity in travel experiences</li></ul><h3>Technology Integration</h3><p>Technology has become essential for modern travel:</p><ul><li>Contactless check-ins and payments</li><li>Health passports and vaccination records</li><li>Virtual reality previews of destinations</li><li>AI-powered travel planning and recommendations</li></ul><h3>Looking Forward</h3><p>As we navigate this new travel landscape, it's clear that what matters most is our health, our relationships, and our connection to the world around us. Travel in 2021 and beyond will be more thoughtful, more intentional, and ultimately more rewarding.</p>"
          },
          {
            "title": "Awesome Travel Map Ideas!",
            "image": "/login_bg.jpg",
            "created_at": "2020-06-05T06:09:18.000000Z",
            "slug": "awesome-travel-map-ideas",
            "content": "<p>Track where you're going and where you've been. From the classic pin map to modern scratch-off maps you can easily keep a list of places you have been, and places you want to go.</p><h2>Why Travel Maps Matter</h2><p>Travel maps are more than just decorative pieces – they're visual representations of your adventures, dreams, and memories. They serve as constant reminders of where you've been and inspiration for where you want to go next.</p><h3>Classic Pin Maps</h3><p>The traditional pin map remains one of the most popular ways to track your travels:</p><ul><li><strong>Push Pin Maps:</strong> Use different colored pins for different types of trips</li><li><strong>String Art Maps:</strong> Connect destinations with string to show your travel routes</li><li><strong>Flag Pin Maps:</strong> Use small flags to represent countries you've visited</li></ul><h3>Scratch-Off Maps</h3><p>Modern scratch-off maps have revolutionized travel tracking:</p><ul><li><strong>World Maps:</strong> Scratch off countries as you visit them</li><li><strong>National Maps:</strong> Available for many countries to track domestic travel</li><li><strong>Detailed Versions:</strong> Some include cities, landmarks, and attractions</li></ul><h3>Digital Alternatives</h3><p>For tech-savvy travelers, digital options offer unique advantages:</p><ul><li><strong>Google My Maps:</strong> Create custom maps with photos and notes</li><li><strong>Travel Apps:</strong> Many apps automatically track and visualize your journeys</li><li><strong>Social Media:</strong> Share your adventures in real-time</li></ul><h3>Creative DIY Ideas</h3><p>Make your travel map uniquely yours:</p><ul><li><strong>Photo Collage Maps:</strong> Replace pins with photos from each destination</li><li><strong>Postcard Maps:</strong> Attach postcards from each place you visit</li><li><strong>Memory Maps:</strong> Add tickets, brochures, and other mementos</li></ul><h3>Planning Your Next Adventure</h3><p>Use your map not just to show where you've been, but to plan where you're going:</p><ul><li>Mark dream destinations with a different color</li><li>Research travel routes between planned destinations</li><li>Set annual goals for new places to add to your map</li></ul><h3>Making It Social</h3><p>Travel maps can bring people together:</p><ul><li>Create a family travel map for shared adventures</li><li>Compare maps with friends for travel inspiration</li><li>Use maps as conversation starters about your experiences</li></ul><p>Whether you prefer the tactile experience of a physical map or the convenience of a digital version, tracking your travels is a rewarding way to celebrate your adventures and plan for future ones!</p>"
          }
        ],
        "pagination": {
          "current_page": 1,
          "last_page": 1,
          "per_page": 12,
          "total": 6,
          "from": 1,
          "to": 6
        }
      }
    };

    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      data: {
        blogs: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 0,
          from: 1,
          to: 0
        }
      }
    });
  }
}
