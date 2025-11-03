import { NextRequest, NextResponse } from 'next/server';
import { ParkingViolation, ViolationSearchResult } from '@/types/violations';

const NYC_API_BASE = 'https://data.cityofnewyork.us/resource/nc67-uf89.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const licensePlate = searchParams.get('licensePlate');
  const ticketNumber = searchParams.get('ticketNumber');
  const state = searchParams.get('state') || 'NY';
  const borough = searchParams.get('borough');
  const limit = searchParams.get('limit') || '50';
  const offset = searchParams.get('offset') || '0';

  console.log('🔍 Violations API called:', { licensePlate, ticketNumber, state, borough });

  if (!licensePlate && !ticketNumber) {
    return NextResponse.json(
      { error: 'Either license plate or ticket number is required' },
      { status: 400 }
    );
  }

  try {
    // Build NYC Open Data API URL
    const params = new URLSearchParams();
    
    if (ticketNumber) {
      params.append('summons_number', ticketNumber);
    } else if (licensePlate) {
      params.append('plate', licensePlate.toUpperCase());
      params.append('registration_state', state.toUpperCase());
    }
    
    params.append('$limit', limit);
    params.append('$offset', offset);
    params.append('$order', 'issue_date DESC');

    const apiUrl = `${NYC_API_BASE}?${params.toString()}`;
    console.log('📡 Calling NYC API:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NYC API Error:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { 
          error: 'Failed to fetch violations from NYC Open Data',
          details: `NYC API returned ${response.status}`,
          violations: [],
          totalCount: 0
        },
        { status: 500 }
      );
    }

    const rawViolations = await response.json();
    console.log('✅ Found violations:', rawViolations.length);

    // Map to our expected format with safe field access
    let violations: ParkingViolation[] = rawViolations.map((raw: any) => ({
      summons_number: raw.summons_number?.toString() || raw.summonsNumber?.toString() || '',
      plate_id: raw.plate_id?.toString() || raw.plate?.toString() || '',
      registration_state: raw.registration_state?.toString() || raw.state?.toString() || '',
      plate_type: raw.plate_type?.toString() || raw.license_type?.toString() || '',
      issue_date: raw.issue_date?.toString() || raw.issueDate?.toString() || '',
      violation_code: raw.violation_code?.toString() || raw.violation?.toString() || '',
      violation_time: raw.violation_time?.toString() || raw.violationTime?.toString() || '',
      violation_precinct: raw.violation_precinct?.toString() || raw.precinct?.toString() || '',
      violation_county: raw.violation_county?.toString() || raw.county?.toString() || '',
      issuing_agency: raw.issuing_agency?.toString() || raw.issuingAgency?.toString() || '',
      // Set empty defaults for fields not in this dataset
      vehicle_body_type: '',
      vehicle_make: '',
      street_code1: '',
      street_code2: '',
      street_code3: '',
      vehicle_expiration_date: '',
      violation_location: '',
      issuer_precinct: '',
      issuer_code: '',
      issuer_command: '',
      issuer_squad: '',
      time_first_observed: '',
      violation_in_front_of_or_opposite: '',
      house_number: '',
      street_name: '',
      intersecting_street: '',
      date_first_observed: '',
      law_section: '',
      sub_division: '',
      violation_legal_code: '',
      days_parking_in_effect: '',
      from_hours_in_effect: '',
      to_hours_in_effect: '',
      vehicle_color: '',
      unregistered_vehicle: '',
      vehicle_year: '',
      meter_number: '',
      feet_from_curb: '',
      violation_post_code: '',
      violation_description: '',
      no_standing_or_stopping_violation: '',
      hydrant_violation: '',
      double_parking_violation: ''
    }));

    // Filter by borough if specified
    if (borough && borough.trim() !== '' && borough.toUpperCase() !== 'ALL BOROUGHS') {
      violations = violations.filter((violation) => {
        const county = violation.violation_county?.toUpperCase();
        const searchBorough = borough.toUpperCase();
        
        // Map borough names to county codes as they appear in the NYC Open Data
        const boroughToCounty: { [key: string]: string[] } = {
          'MANHATTAN': ['NY', 'MN'],
          'BROOKLYN': ['K', 'BK'],
          'QUEENS': ['Q', 'QN', 'QUEENS'],
          'BRONX': ['BX'],
          'STATEN ISLAND': ['R', 'ST']
        };
        
        const countyNames = boroughToCounty[searchBorough];
        return county && countyNames && countyNames.includes(county);
      });
      
      console.log(`Filtered to ${violations.length} violations for ${borough}`);
    }

    const result: ViolationSearchResult = {
      violations,
      totalCount: violations.length,
      licensePlate: licensePlate ? licensePlate.toUpperCase() : (ticketNumber || '')
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching violations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch violations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}