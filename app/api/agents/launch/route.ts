import { NextRequest } from 'next/server'
import { POST as create } from '../instances/route'

export async function POST(request: NextRequest) { return create(request) }
