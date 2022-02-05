const EXCLUDED_BOOKS = {
  'https://blueocean.s3.us-west-1.amazonaws.com/Submitting a Winning Bid Guide to Making Construction Bidding with Examples by , (z-lib.org).pdf.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/pg66600.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/pg45438.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Immersive 3D Design Visualization With Autodesk Maya and Unreal Engine 4 by Abhishek Kumar (z-lib.org).epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Immersive 3D Design Visualization With Autodesk Maya and Unreal Engine 4.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Immersive+3D+Design+Visualization+With+Autodesk+Maya+and+Unreal+Engine+4.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Bids, Tenders and Proposals Winning Business Through Best Practice by Harold Lewis (z-lib.org).pdf.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Bids%2C%20Tenders%20and%20Proposals%20by%20Harold%20Lewis.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Cracking the Coding Interview - 189 Programming Questions and Solutions (6th Edition).epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Peace State by Amber Bird.epub': true,
  'https://blueocean.s3.us-west-1.amazonaws.com/Dead Sound by Anise Eden.epub': true,
};

const EDITED_TITLES = {
  'https://blueocean.s3.us-west-1.amazonaws.com/the-republic-by-plato.epub': 'The Republic by Plato',
  'https://blueocean.s3.us-west-1.amazonaws.com/howard-slithering-shadow.epub': 'The Slithering Shadow by Robert E. Howard',
  'https://blueocean.s3.us-west-1.amazonaws.com/alice.epub': 'Alice in Wonderland by Lewis Carroll',
  'https://blueocean.s3.us-west-1.amazonaws.com/The Assassin_s Legacy by D. Lieber.epub': 'The Assassin\'s Legacy by D. Lieber',
};

const EDITED_COVERS = {
  'https://blueocean.s3.us-west-1.amazonaws.com/Submitting a Winning Bid.epub': 'Submitting a Winning Bid.jpeg',
  'https://blueocean.s3.us-west-1.amazonaws.com/Bids, Tenders and Proposals by Harold Lewis.epub': 'Bids, Tenders and Proposals by Harold Lewis.jpg',
  'https://blueocean.s3.us-west-1.amazonaws.com/A Beginner’s Guide to 3D Modeling.epub': 'A Beginner’s Guide to 3D Modeling.jpg',
};

export default { EXCLUDED_BOOKS, EDITED_TITLES, EDITED_COVERS };
