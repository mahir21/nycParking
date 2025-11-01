import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plates = await prisma.plateWatch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ plates })
  } catch (error) {
    console.error('Error fetching plates:', error)
    return NextResponse.json({ error: 'Failed to fetch plates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plateNumber, state, borough, nickname } = await request.json()

    if (!plateNumber || !state) {
      return NextResponse.json(
        { error: 'Plate number and state are required' }, 
        { status: 400 }
      )
    }

    // Check if plate already exists for this user
    const existingPlate = await prisma.plateWatch.findUnique({
      where: {
        userId_plateNumber_state: {
          userId: session.user.id,
          plateNumber: plateNumber.toUpperCase(),
          state: state.toUpperCase()
        }
      }
    })

    if (existingPlate) {
      return NextResponse.json(
        { error: 'This plate is already being monitored' }, 
        { status: 400 }
      )
    }

    const plate = await prisma.plateWatch.create({
      data: {
        userId: session.user.id,
        plateNumber: plateNumber.toUpperCase(),
        state: state.toUpperCase(),
        borough: borough || null,
        nickname: nickname || null
      }
    })

    return NextResponse.json({ plate, message: 'Plate added successfully' })
  } catch (error) {
    console.error('Error creating plate:', error)
    return NextResponse.json({ error: 'Failed to add plate' }, { status: 500 })
  }
}