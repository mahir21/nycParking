export interface ParkingViolation {
  summons_number: string;
  plate_id: string;
  registration_state: string;
  plate_type: string;
  issue_date: string;
  violation_code: string;
  vehicle_body_type: string;
  vehicle_make: string;
  issuing_agency: string;
  street_code1: string;
  street_code2: string;
  street_code3: string;
  vehicle_expiration_date: string;
  violation_location: string;
  violation_precinct: string;
  issuer_precinct: string;
  issuer_code: string;
  issuer_command: string;
  issuer_squad: string;
  violation_time: string;
  time_first_observed: string;
  violation_county: string;
  violation_in_front_of_or_opposite: string;
  house_number: string;
  street_name: string;
  intersecting_street: string;
  date_first_observed: string;
  law_section: string;
  sub_division: string;
  violation_legal_code: string;
  days_parking_in_effect: string;
  from_hours_in_effect: string;
  to_hours_in_effect: string;
  vehicle_color: string;
  unregistered_vehicle: string;
  vehicle_year: string;
  meter_number: string;
  feet_from_curb: string;
  violation_post_code: string;
  violation_description: string;
  no_standing_or_stopping_violation: string;
  hydrant_violation: string;
  double_parking_violation: string;
}

export interface ViolationSearchResult {
  violations: ParkingViolation[];
  totalCount: number;
  licensePlate: string;
}

export interface SearchParams {
  licensePlate?: string;
  ticketNumber?: string;
  state?: string;
  borough?: string;
  limit?: number;
  offset?: number;
}