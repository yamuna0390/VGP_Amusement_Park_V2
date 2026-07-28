/* Image map — 10 locally stored unique ride photos */
export const RIDE_IMG = {
  family:  "/images/rides/roller1.jpg",
  adult:   "/images/rides/roller1.jpg",
  child:   "/images/rides/kidsRide1.jpg",
  water:   "/images/rides/waterride.jpg",
  zoo:     null,
};

export const rides = [
/* ---- FAMILY (5) ---- */
{
  n: "Castle Jet",
  m: "Zamperla",
  c: "family",
  ph: "Castle Jet",
  bg: "bg-mint",
  d: "Soar high around the iconic castle tower while enjoying breathtaking panoramic views of the park. A gentle yet exciting family ride perfect for kids and adults alike.",
  img: "/images/rides/flyingride.jpg",
  slug: "castle-jet"
},
{n:"Tea Cup",m:"Okamoto · Japan",c:"family",i:"teacup",bg:"bg-mint",d:"Climb into a colourful teacup and spin your way through a cheerful adventure. Gentle thrills, playful turns and plenty of laughter.", img: "/images/vgrides/Tea Cup.jpeg"},
{n:"Telecombat",m:"Okamoto · Japan",c:"family",ph:"Sky War on Telecombat",bg:"bg-lavender",d:"Take control of your own flying vehicle as you rise, dip and circle through the air. Every rider gets a playful aerial adventure.", img: "/images/vgrides/Tele combact.jpeg"}, //
{n:"Merry-Go-Round",m:"Okamoto · Japan",c:"family",i:"carousel",bg:"bg-sky",d:"Ride beautifully crafted horses to gentle movement and cheerful music. A timeless, magical classic for children and families.", img: "/images/rides/carousel.jpg"},
{n:"Balloon Racer",m:"Okamoto · Japan",c:"family",ph:"Balloon Racer",bg:"bg-cream",d:"Climb into a colourful balloon-shaped gondola and gently rise into the air. Smooth circles and delightful views for the family.", img: "/images/rides/flyingride.jpg"},
{n:"Crazy Plane",m:"Zamperla · Italy",c:"family",i:"plane",bg:"bg-peach",d:"Take flight as the Crazy Plane spins, rises and moves through the air. Gentle thrills with the exciting sensation of flying.", img: "/images/rides/flyingride.jpg"},
/* ---- ADULT (13) ---- */

{n:"Flying Machine",m:"Zamperla · Italy",c:"adult",ph:"Flying Machine",bg:"bg-softyellow",d:"Take to the skies as the Flying Machine rises and circles through the air. The exciting feeling of true flight.", img: "/images/rides/flyingride.jpg"},
{n:"Power Surge",m:"Zamperla · Italy",c:"adult",ph:"Top Gun",bg:"bg-lavender",d:"Brace yourself for powerful spins, sweeping swings and unexpected changes in direction. An electrifying mix of speed, height and adrenaline.", img: "/images/vgrides/Powrer Surge.JPG"},//
{n:"Rock & Roll",m:"Okamoto · Japan",c:"adult",i:"spinner",bg:"bg-mint",d:"Get ready to spin, twist and rock through an energetic adventure. Fast rotations and lively movements deliver non-stop excitement.", img: "/images/vgrides/Rock & Roll.jpg"}, //
{n:"Giant Wheel",m:"UKD Classic",c:"adult",ph:"Ferris Wheel",bg:"bg-sky",d:"Rise high above the park and enjoy beautiful panoramic views from the top. See the whole Kingdom — and the sea — from the very top.", img: "/images/rides/ferriswheel.jpg"},
{n:"Octopus",m:"Okamoto · Japan",c:"adult",i:"octopus",bg:"bg-peach",d:"Hold on as the giant arms spin, rise and dip in different directions. Speed and unpredictable movement make it thrillingly lively.", img: "/images/rides/roller1.jpg"},
{n:"Flash Dance",m:"Okamoto · Japan",c:"adult",i:"spinner",bg:"bg-softyellow",d:"Feel the rush as the ride spins rapidly and changes direction without warning. A dazzling adventure of speed and surprise.", img: "/images/rides/roller1.jpg"},
{n:"Disco '16",m:"Zamperla · Italy",c:"adult",i:"disco",bg:"bg-cream",d:"Ride a giant spinning disc that sweeps back and forth along a curved track. Rotation, speed and soaring movement in one unforgettable thrill.", img: "/images/rides/bumpercars.jpg"},
{n:"Jumping Tower",m:"Moser Rides",c:"adult",i:"tower",bg:"bg-mint",d:"Rise high above the ground before bouncing through exciting drops. Weightless moments, laughter and adventure combined.", img: "/images/rides/roller1.jpg"},
{n:"Viking",m:"Okamoto · Japan",c:"adult",i:"ship",bg:"bg-lavender",d:"Set sail aboard a giant ship that swings higher with every movement. Exciting drops and moments of pure weightlessness.", img: "/images/vgrides/Viking.jpg"},
{n:"Flying Tiger",m:"UKD Classic",c:"adult",i:"pendulum",bg:"bg-peach",d:"Leap on the tiger's back as it swoops and circles high above the midway. A roaring adventure of speed and sweeping turns.", img: "/images/rides/roller1.jpg"},
{n:"Wave Swinger",m:"Okamoto · Japan",c:"adult",i:"swinger",bg:"bg-sky",d:"Soar through the air as colourful chairs rise, tilt and circle gracefully. A refreshing feeling of freedom, speed and excitement.", img: "/images/vgrides/Wave Swigner.JPG"}, //
{n:"Mixer",m:"Zamperla · Italy",c:"adult",i:"spinner",bg:"bg-softyellow",d:"Prepare for powerful spins and sweeping rotations on this high-energy attraction. Intense, pulse-racing fun for adventure lovers.", img: "/images/rides/roller1.jpg"},
{n:"Roller Coaster",m:"UKD Classic",c:"adult",ph:"Roller Coaster",bg:"bg-cream",d:"Race through exciting twists, sharp turns and thrilling drops at high speed. A heart-pounding adventure riders will remember.", img: "/images/vgrides/Roaler Coster.JPG"}, //

/* ---- CHILD (4) ---- */
{n:"Fun Clown",m:"UKD Classic",c:"child",i:"clown",bg:"bg-mint",d:"Join the cheerful Fun Clown for a colourful ride filled with smiles. Gentle movement makes it perfect for young children.", img: "/images/rides/kidsRide1.jpg"},
{n:"Flying Chair",m:"Omes",c:"child",i:"swinger",bg:"bg-peach",d:"Colourful chairs gently spin little adventurers through the air. Smooth movement for a safe, joyful feeling of flight.", img: "/images/rides/kidsRide1.jpg"},
{n:"Aladdin",m:"Omes",c:"child",i:"carpet",bg:"bg-softyellow",d:"Embark on a magical journey aboard a colourful flying carpet. Gentle spins make an enchanting family adventure.", img: "/images/rides/kidsRide1.jpg"},
{n:"Jet Star",m:"Okamoto · Japan",c:"child",i:"coaster",bg:"bg-lavender",d:"Hold on tight as the mini coaster races through drops and sweeping curves. The perfect first taste of coaster thrills.", img: "/images/rides/kidsRide1.jpg"},
/* ---- WATER PARK (11) ---- */
{n:"Surfing Pool",m:"Aqua Kingdom",c:"water",e:"🏄",bg:"bg-sky",d:"Catch the Kingdom's rolling surf right beside the Bay of Bengal. Body-surf the swells and ride wave after wave.", img: "/images/vgrides/Surf Ride.JPG"},//
{n:"Wave Pool",m:"Aqua Kingdom",c:"water",e:"🌊",bg:"bg-mint",d:"Dive into rolling waves in the Kingdom's giant wave pool. Thousands of gallons of swirling, splashing fun for everyone.", img: "/images/vgrides/Wave Pool.jpeg"},
{n:"Tornado",m:"Aqua Kingdom",c:"water",e:"🌪️",bg:"bg-lavender",d:"Spiral down the giant funnel and whirl like you're inside a storm. The splashdown is worth every scream.", img: "/images/vgrides/Tornodo.jpg"}, //
{n:"Deep Sea",m:"Aqua Kingdom",c:"water",e:"🤿",bg:"bg-sky",d:"Take a plunge into the deepest pool in the park. Cool off, float about and dive like a pro.", img: "/images/rides/waterride.jpg"},
{n:"River Ride",m:"Aqua Kingdom",c:"water",e:"🛟",bg:"bg-cream",d:"Grab a float and drift along the winding river. The current does the walking while you do the laughing.", img: "/images/vgrides/Wave Pool.jpeg"}, //
{n:"Kurinji Falls",m:"Aqua Kingdom",c:"water",e:"🏞️",bg:"bg-mint",d:"Stand beneath the thundering waterfall and feel the hills come to Chennai. Nature's massage, Kingdom style.", img: "/images/rides/waterride.jpg"},
{n:"Multi Mat Racer",m:"Aqua Kingdom",c:"water",e:"🛹",bg:"bg-peach",d:"Grab a mat, pick a lane and race your friends head-first to the splash finish. May the fastest slider win!", img: "/images/rides/waterride.jpg"},
{n:"Multi Double Slide",m:"Aqua Kingdom",c:"water",e:"🛹",bg:"bg-lavender",d:"Twin twisting slides running side by side — double the lanes, double the fun. Perfect for a friendly face-off.", img: "/images/rides/waterride.jpg"},
{n:"Multi Body Slide (Open & Closed)",m:"Aqua Kingdom",c:"water",e:"💦",bg:"bg-sky",d:"Choose the open chute for the views or the closed tube for the thrill of the dark. Either way, you land with a mighty splash.", img: "/images/rides/waterride.jpg"},
{n:"Kids' Water Slide",m:"Aqua Kingdom",c:"water",e:"🧒",bg:"bg-softyellow",d:"Gentle mini slides made just for the little splashers. Safe, shallow and seriously fun.", img: "/images/rides/kidsRide1.jpg"},
{n:"Rain Dance",m:"Aqua Kingdom",c:"water",ph:"Rain Dance",bg:"bg-cream",d:"We play thumping music and we know kids dance when they see water. You'll never find a kid sing rain-rain-go-away here!", img: "/images/rides/wavepool.jpg"},
/* ---- PETTING ZOO (8) ---- */
{n:"Pigeon",m:"Pet Zoo",c:"zoo",e:"🕊️",bg:"bg-sky",d:"Watch fluffy fantails and homing pigeons strut and coo. Gentle enough for the smallest visitors to greet.", img: null},
{n:"Emu",m:"Pet Zoo",c:"zoo",e:"🦤",bg:"bg-mint",d:"Meet the giant flightless wonder from Australia. Watch it stride, stare and steal the show.", img: null},
{n:"Country Chicken",m:"Pet Zoo",c:"zoo",e:"🐔",bg:"bg-softyellow",d:"Say hello to proud roosters and clucking hens of the good old country breed. Farm life, up close.", img: null},
{n:"Ducks",m:"Pet Zoo",c:"zoo",e:"🦆",bg:"bg-cream",d:"Follow the waddling parade around the pond. Splashy landings guaranteed.", img: null},
{n:"Rabbits",m:"Pet Zoo",c:"zoo",e:"🐇",bg:"bg-lavender",d:"Soft, twitchy-nosed and endlessly adorable. The cuddliest corner of the whole Kingdom.", img: null},
{n:"Sanganoor Parrots",m:"Pet Zoo",c:"zoo",e:"🦜",bg:"bg-peach",d:"Bright green chatterboxes with plenty of opinions. Listen closely — they might just say hello first.", img: null},
{n:"Cockatoos",m:"Pet Zoo",c:"zoo",e:"🦅",bg:"bg-lavender",d:"Crested show-offs who love an audience. Expect head-bobs, squawks and dance moves.", img: null},
{n:"Macaws",m:"Pet Zoo",c:"zoo",e:"🦜",bg:"bg-softyellow",d:"Rainbow giants of the parrot world. Big, bold, brilliant — and very photogenic.", img: null}
];
