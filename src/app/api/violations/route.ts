import { NextRequest, NextResponse } from 'next/server';
import { ParkingViolation, ViolationSearchResult } from '@/types/violations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const licensePlate = searchParams.get('licensePlate');
  const ticketNumber = searchParams.get('ticketNumber');
  const state = searchParams.get('state') || 'NY';

  if (!licensePlate && !ticketNumber) {
    return NextResponse.json(
      { error: 'Either license plate or ticket number is required' },
      { status: 400 }
    );
  }

  try {
    // Build API URL based on search type
    let apiUrl = '';
    let searchType = '';
    
    if (ticketNumber) {
      // Search by ticket number (summons_number)
      apiUrl = `https://data.cityofnewyork.us/resource/nc67-uf89.json?summons_number=${ticketNumber}&$limit=50&$order=issue_date DESC`;
      searchType = 'ticket';
    } else if (licensePlate) {
      // Search by license plate
      apiUrl = `https://data.cityofnewyork.us/resource/nc67-uf89.json?plate=${licensePlate.toUpperCase()}&state=${state.toUpperCase()}&$limit=50&$order=issue_date DESC`;
      searchType = 'plate';
    }
    
    console.log(`Fetching ${searchType} search from:`, apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { 
          error: 'Failed to fetch violations',
          details: `API returned ${response.status}: ${errorText}`
        },
        { status: 500 }
      );
    }

    const rawViolations = await response.json();
    console.log('Raw violations count:', rawViolations.length);

    // Map to our expected format
    const violations: ParkingViolation[] = rawViolations.map((raw: any) => ({
      summons_number: raw.summons_number?.toString() || '',
      plate_id: raw.plate?.toString() || '',
      registration_state: raw.state?.toString() || '',
      plate_type: raw.license_type?.toString() || '',
      issue_date: raw.issue_date?.toString() || '',
      violation_code: raw.violation?.toString() || '',
      violation_time: raw.violation_time?.toString() || '',
      violation_precinct: raw.precinct?.toString() || '',
      // Set empty defaults for fields not in this dataset
      vehicle_body_type: '',
      vehicle_make: '',
      issuing_agency: '',
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
      violation_county: '',
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