import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify plate belongs to user before deleting
    const plate = await prisma.plateWatch.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!plate) {
      return NextResponse.json({ error: 'Plate not found' }, { status: 404 })
    }

    await prisma.plateWatch.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Plate removed successfully' })
  } catch (error) {
    console.error('Error deleting plate:', error)
    return NextResponse.json({ error: 'Failed to remove plate' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isActive } = await request.json()
    const { id } = await params

    // Verify plate belongs to user before updating
    const plate = await prisma.plateWatch.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!plate) {
      return NextResponse.json({ error: 'Plate not found' }, { status: 404 })
    }

    const updatedPlate = await prisma.plateWatch.update({
      where: { id: id },
      data: { isActive }
    })

    return NextResponse.json({ 
      plate: updatedPlate, 
      message: `Plate ${isActive ? 'activated' : 'paused'} successfully` 
    })
  } catch (error) {
    console.error('Error updating plate:', error)
    return NextResponse.json({ error: 'Failed to update plate' }, { status: 500 })
  }
}