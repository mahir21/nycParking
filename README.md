# NYC Parking Violations Lookup

A Next.js TypeScript web application that allows users to search for parking violations in New York City by license plate number using the NYC Open Data API.

## Features

- 🔍 **License Plate Search**: Enter any license plate number to find associated parking violations
- 🎫 **Ticket Information**: View detailed ticket numbers, dates, times, and violation codes
- 📍 **Location Details**: See where violations occurred with street names and counties
- 🚗 **Vehicle Information**: Display vehicle make, year, and color when available
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Search**: Fast API responses with loading states and error handling

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **API**: NYC Open Data API integration
- **Data Source**: NYC Parking Violations dataset

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mahir21/nycParking.git
cd nycParking
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Enter License Plate**: Type in the license plate number you want to search for
2. **Select State**: Choose the registration state (defaults to NY)
3. **Click Search**: The app will fetch and display all parking violations for that plate
4. **View Results**: See detailed information including:
   - Ticket numbers (summons numbers)
   - Violation dates and times
   - Violation codes and descriptions
   - Location information
   - Vehicle details

## API Endpoints

### GET `/api/violations`

Search for parking violations by license plate.

**Query Parameters:**
- `licensePlate` (required): The license plate number
- `state` (optional): Registration state (default: NY)
- `limit` (optional): Number of results to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```
GET /api/violations?licensePlate=ABC1234&state=NY&limit=25
```

## Data Source

This application uses the NYC Open Data API to fetch parking violation records:
- **Dataset**: Parking Violations Issued - Fiscal Year 2024
- **API Endpoint**: `https://data.cityofnewyork.us/resource/nc67-uf89.json`
- **Documentation**: [NYC Open Data Portal](https://opendata.cityofnewyork.us/)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── violations/
│   │       └── route.ts          # API route handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
├── components/
│   ├── SearchForm.tsx           # License plate search form
│   └── ViolationsDisplay.tsx    # Violations results display
├── types/
│   └── violations.ts            # TypeScript type definitions
└── utils/                       # Utility functions (future use)
```

## Environment Variables

For production use, you may want to add an NYC Open Data app token:

```bash
# .env.local
NYC_OPEN_DATA_TOKEN=your_token_here
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Manual Deployment

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- NYC Open Data team for providing the parking violations dataset
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first CSS framework

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Built with ❤️ using Next.js and TypeScript
