# NYC Parking Violation Checker

A modern, responsive web application that allows users to check parking violations in New York City by entering their license plate number. The app uses the NYC Open Data API to fetch real-time violation data.

## Features

- **License Plate Search**: Enter any license plate number to search for violations
- **State Selection**: Choose from common states (NY, NJ, CT, PA, etc.)
- **Modern UI**: Beautiful gradient design with white, light blue, and purple theme
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Data**: Fetches live data from NYC Open Data API
- **Detailed Information**: Shows comprehensive violation details including:
  - Violation type and description
  - Issue date and time
  - Fine amounts and penalties
  - Payment status
  - Location (precinct and borough)
  - Issuing agency
  - Current status

## Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with gradients, flexbox, and grid
- **Vanilla JavaScript**: Clean, dependency-free JavaScript
- **NYC Open Data API**: Real-time parking violation data
- **Font Awesome**: Icons for better user experience
- **Google Fonts**: Inter font family for modern typography

## API Integration

The application integrates with the NYC Open Data API:
- **Endpoint**: `https://data.cityofnewyork.us/resource/nc67-uf89.json`
- **Method**: GET requests with query parameters
- **Rate Limiting**: Implements reasonable limits (100 results max)
- **Error Handling**: Comprehensive error handling for network issues

## File Structure

```
NYCParkingViolationApp/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## How to Run the Application

### Method 1: Using Python (Recommended)
1. **Open Terminal/Command Prompt**
2. **Navigate to the project directory**:
   ```bash
   cd /path/to/NYCParkingViolationApp
   ```
3. **Start a local server**:
   ```bash
   python3 -m http.server 8000
   ```
   Or on Windows:
   ```bash
   python -m http.server 8000
   ```
4. **Open your web browser** and go to:
   ```
   http://localhost:8000
   ```

### Method 2: Using Node.js (Alternative)
1. **Install a simple HTTP server** (if you have Node.js):
   ```bash
   npm install -g http-server
   ```
2. **Navigate to the project directory** and run:
   ```bash
   http-server -p 8000
   ```
3. **Open your browser** to `http://localhost:8000`

### Method 3: Direct File Opening (Limited functionality)
1. **Double-click** on `index.html` file
2. The app will open in your default browser
3. **Note**: Some features may not work due to CORS restrictions when opening files directly

## How to Use the Application

1. **Enter License Plate**: Type the license plate number in the input field
2. **Select State**: Choose the appropriate state from the dropdown (NY, NJ, CT, PA, etc.)
3. **Search**: Click "Search Violations" or press Enter
4. **View Results**: See all violations with detailed information

### Example License Plates to Test:
- `GZY4258` (NY) - Has violations
- `HMV8581` (NY) - Has violations
- `ABC123` (NY) - Likely no violations (for testing empty results)

## Features in Detail

### Search Functionality
- Automatic uppercase conversion for license plates
- Input validation (alphanumeric characters only)
- State filtering for more accurate results
- Real-time API queries

### Results Display
- **No Violations**: Shows a congratulatory message
- **Violations Found**: Displays each violation in a detailed card format
- **Loading States**: Shows spinner during API calls
- **Error Handling**: User-friendly error messages

### Violation Card Information
Each violation card displays:
- Violation type (formatted for readability)
- Issue date and time
- Payment status (PAID or amount due)
- Summons number
- Fine and penalty amounts
- Location details (precinct and borough)
- Issuing agency
- Current status
- Judgment date (if applicable)

## Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: Full-width layout with side-by-side elements
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Stacked layout with optimized touch targets

## Prerequisites

- **Python 3.x** (recommended) or **Node.js** for running a local server
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Internet connection** for API access

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## Quick Start

1. **Download or clone** this repository
2. **Open terminal** in the project folder
3. **Run**: `python3 -m http.server 8000`
4. **Visit**: `http://localhost:8000` in your browser
5. **Start searching** for parking violations!

## API Data Fields

The application processes the following data fields from the NYC API:
- `plate`: License plate number
- `state`: Registration state
- `summons_number`: Unique violation identifier
- `issue_date`: Date violation was issued
- `violation_time`: Time of violation
- `violation`: Description of the violation
- `fine_amount`: Base fine amount
- `penalty_amount`: Additional penalties
- `amount_due`: Current amount owed
- `precinct`: NYPD precinct
- `county`: Borough code
- `issuing_agency`: Agency that issued the violation
- `violation_status`: Current status of the violation

## Color Scheme

The modern gradient theme uses:
- **Primary Gradient**: Purple to blue (`#667eea` to `#764ba2`)
- **Background**: White with glass-morphism effects
- **Text**: Dark gray (`#333`, `#4a5568`, `#2d3748`)
- **Accents**: Light blue and purple variations
- **Status Colors**: Green for paid, red for due amounts

## Performance Optimizations

- Efficient API queries with appropriate limits
- Debounced search to prevent excessive API calls
- Lightweight CSS with optimized selectors
- Minimal JavaScript with no external dependencies
- Optimized images and fonts loading

## Error Handling

The application handles various error scenarios:
- Network connectivity issues
- API rate limiting
- Invalid license plate formats
- Empty search results
- Server errors

## Future Enhancements

Potential improvements could include:
- Search history
- Export violation data
- Payment integration
- Notification system
- Advanced filtering options
- Violation statistics
- Map integration for violation locations

## License

This project is open source and available under the MIT License.

## Troubleshooting

### Common Issues:

**"Failed to fetch" Error:**
- Ensure you're running the app through a local server (not opening the HTML file directly)
- Check your internet connection
- The NYC API might be temporarily unavailable

**Server Won't Start:**
- Make sure Python is installed: `python3 --version`
- Try a different port: `python3 -m http.server 3000`
- Check if the port is already in use

**No Results Found:**
- Try different license plates from the examples above
- Ensure the license plate format is correct
- Check if the state selection matches the plate

### Need Help?
If you encounter issues, try:
1. Refreshing the browser page
2. Clearing browser cache
3. Trying a different browser
4. Restarting the local server

## Disclaimer

This application uses publicly available data from NYC Open Data. The information is provided as-is and users should verify all violation details through official NYC channels for legal or payment purposes.
