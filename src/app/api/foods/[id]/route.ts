
import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { dbName } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'


// PUT update food

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db(dbName)
    const { id } = await context.params

    await db.collection('foods').updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    )

    return NextResponse.json({ _id: id, ...body })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 })
  }
}

// DELETE food

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const { id } = await context.params

    await db.collection('foods').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Food deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 })
  }
}