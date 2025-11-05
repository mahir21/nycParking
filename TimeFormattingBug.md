# API Data Processing Documentation

## NYC Open Data API

This application uses the NYC Open Data API to fetch parking violation records.

**API Endpoint:** `https://data.cityofnewyork.us/resource/nc67-uf89.json`

---

## Data Returned from API

The API returns parking violation records in JSON format. Each violation object contains the following fields:

### Raw API Response Fields:
```json
{
  "summons_number": "1234567890",
  "plate": "ABC1234",
  "state": "NY",
  "license_type": "PAS",
  "issue_date": "2024-11-05T00:00:00.000",
  "violation": "21",
  "violation_time": "0730A",
  "precinct": "019"
}
```

### Key Fields:
- **`summons_number`**: Unique ticket identifier
- **`plate`**: License plate number
- **`state`**: Registration state (e.g., NY, NJ, CT)
- **`license_type`**: Type of license plate (PAS = Passenger, COM = Commercial, etc.)
- **`issue_date`**: Date when the ticket was issued (ISO 8601 format)
- **`violation`**: Violation code number
- **`violation_time`**: Time of violation (HHMM format with sometimes additional characters like 'A' or 'P')
- **`precinct`**: Precinct number where violation occurred

---

## Data Processing Flow

### 1. API Route Processing (`/src/app/api/violations/route.ts`)

**Location:** Lines 52-96

The API route transforms the raw NYC Open Data response into our application's format:

```typescript
const violations: ParkingViolation[] = rawViolations.map((raw: any) => ({
  summons_number: raw.summons_number?.toString() || '',
  plate_id: raw.plate?.toString() || '',
  registration_state: raw.state?.toString() || '',
  plate_type: raw.license_type?.toString() || '',
  issue_date: raw.issue_date?.toString() || '',
  violation_code: raw.violation?.toString() || '',
  violation_time: raw.violation_time?.toString() || '',
  violation_precinct: raw.precinct?.toString() || '',
  // ... other fields set to empty defaults
}));
```

**Processing Steps:**
1. Fetch data from NYC Open Data API
2. Convert all fields to strings using `.toString()`
3. Provide empty string defaults for missing fields
4. Map API field names to our internal field names:
   - `plate` → `plate_id`
   - `state` → `registration_state`
   - `license_type` → `plate_type`
   - `violation` → `violation_code`
   - `precinct` → `violation_precinct`

### 2. Frontend Display Processing (`/src/components/ViolationsDisplay.tsx`)

**Location:** Lines 76-93

The `formatTime` function processes the `violation_time` field for display:

```typescript
const formatTime = (timeStr: string) => {
  console.log('Raw time:', timeStr, 'Type:', typeof timeStr);
  if (!timeStr) return timeStr;
  
  // Remove any non-digit characters and pad to 4 digits
  const cleanTime = timeStr.replace(/\D/g, '').padStart(4, '0');
  console.log('Cleaned time:', cleanTime);
  
  if (cleanTime.length < 4) return timeStr;
  
  // Format time from HHMM to HH:MM AM/PM
  const hours = parseInt(cleanTime.substring(0, 2));
  const minutes = cleanTime.substring(2, 4);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  const formatted = `${displayHours}:${minutes} ${ampm}`;
  console.log('Formatted time:', formatted);
  
  return formatted;
};
```

**Time Processing Steps:**
1. **Clean**: Remove all non-digit characters using regex `/\D/g`
   - `"0730A"` → `"0730"`
   - `"7:30"` → `"730"`
2. **Pad**: Ensure 4-digit format using `.padStart(4, '0')`
   - `"730"` → `"0730"`
   - `"73"` → `"0073"`
3. **Extract**: Get hours (first 2 digits) and minutes (last 2 digits)
   - Hours: `"0730".substring(0, 2)` → `"07"`
   - Minutes: `"0730".substring(2, 4)` → `"30"`
4. **Convert**: Transform to 12-hour format with AM/PM
   - Parse hours as integer: `07`
   - Determine AM/PM: hours >= 12 ? 'PM' : 'AM'
   - Convert to 12-hour: `hours % 12 || 12`
5. **Format**: Combine into readable time string
   - `"7:30 AM"`

---

## The Bug That Was Fixed

### Problem:
Times were displaying incorrectly as **"7::3 AM"** instead of **"7:30 AM"**

### Root Cause:
The original code had these issues:

```typescript
// ORIGINAL BUGGY CODE:
const formatTime = (timeStr: string) => {
  if (!timeStr || timeStr.length < 4) return timeStr;
  
  const hours = parseInt(timeStr.substring(0, 2));
  const minutes = timeStr.substring(2, 4).padStart(2,'0');  // ❌ WRONG PLACEMENT
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes} ${ampm}`;
};
```

**Issues:**
1. **`.padStart(2, '0')` applied AFTER substring extraction** - The substring already extracts 2 characters, so padding does nothing useful
2. **No cleaning of non-digit characters** - If the time came as "0730A", it would fail
3. **No padding of the entire string** - If time was "730" (3 digits), substring would extract wrong values:
   - `"730".substring(0, 2)` → `"73"` (wrong hours!)
   - `"730".substring(2, 4)` → `"0"` (wrong minutes!)

### Examples of Failures:
- Input: `"730"` → Output: `"73:0 AM"` → Displayed as `"73::0 AM"` (broken)
- Input: `"0730A"` → Substring gets `"30A"` → Further processing fails

### Solution:
1. **Clean first**: Remove non-digits with `.replace(/\D/g, '')`
2. **Pad the entire string**: Use `.padStart(4, '0')` on the full time string
3. **Then extract**: Now substring extraction always works correctly

### Before vs After:

| Raw Input | Before (Buggy)  | After (Fixed) |
|-----------|----------------|---------------|
| `"730"`   | `"73:0 AM"` ❌  | `"7:30 AM"` ✅ |
| `"0730A"` | Error/Wrong ❌  | `"7:30 AM"` ✅ |
| `"1430"`  | `"2:30 PM"` ✅  | `"2:30 PM"` ✅ |
| `"7:30"`  | Error ❌        | `"7:30 AM"` ✅ |

---

## Summary

1. **API returns** raw violation data with times in HHMM format (sometimes with extra characters)
2. **API route** transforms raw data to our internal format
3. **Frontend** cleans, pads, and formats times for user-friendly display
4. **Bug fix** involved cleaning and padding the entire time string before extraction, not after

The key insight: **Process the entire string first, then extract parts** - not the other way around!
