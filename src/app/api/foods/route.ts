import { NextRequest, NextResponse } from 'next/server'
import clientPromise, { dbName } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET all foods
export async function GET() {
  try {
    console.log('GET /api/foods - Starting request')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    
    const client = await clientPromise
    const db = client.db(dbName)
    console.log('Connected to database:', dbName)
    
    const foods = await db.collection('foods').find({}).toArray()
    console.log('Found foods:', foods.length)
    
    return NextResponse.json(foods)
  } catch (error: any) {
    console.error('GET /api/foods - Database error:', error)
    console.error('Error stack:', error.stack)
    
    if (error.message?.includes('MONGODB_URI')) {
      return NextResponse.json({ 
        error: 'Database not configured', 
        message: 'Please configure MONGODB_URI in your .env.local file' 
      }, { status: 500 })
    }
    return NextResponse.json({ 
      error: 'Failed to fetch foods',
      details: error.message 
    }, { status: 500 })
  }
}

// POST new food
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/foods - Starting request')
    const body = await request.json()
    console.log('Request body:', body)
    
    console.log('Connecting to MongoDB...')
    const client = await clientPromise
    const db = client.db(dbName)
    console.log('Connected to database:', dbName)
    
    console.log('Inserting food into collection...')
    const result = await db.collection('foods').insertOne(body)
    console.log('Insert result:', result)
    
    const response = { _id: result.insertedId, ...body }
    console.log('Sending response:', response)
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('POST /api/foods - Database error:', error)
    console.error('Error stack:', error.stack)
    
    if (error.message?.includes('MONGODB_URI')) {
      return NextResponse.json({ 
        error: 'Database not configured', 
        message: 'Please configure MONGODB_URI in your .env.local file' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to create food',
      details: error.message 
    }, { status: 500 })
  }
}