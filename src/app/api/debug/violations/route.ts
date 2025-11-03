import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test NYC Open Data API directly
    const testUrl = 'https://data.cityofnewyork.us/resource/nc67-uf89.json?$limit=1'
    
    console.log('Testing NYC Open Data API:', testUrl)
    
    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        status: 'NYC API connection failed',
        statusCode: response.status,
        statusText: response.statusText,
        error: errorText
      }, { status: 500 })
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      status: 'NYC API connection successful',
      statusCode: response.status,
      dataReceived: Array.isArray(data),
      recordCount: Array.isArray(data) ? data.length : 0,
      sampleFields: data[0] ? Object.keys(data[0]).slice(0, 10) : []
    })
    
  } catch (error) {
    console.error('API test error:', error)
    return NextResponse.json({
      status: 'NYC API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}