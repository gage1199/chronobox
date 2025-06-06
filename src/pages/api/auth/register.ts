import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Request validation schema
const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Validate request body
    const { name, email, password } = RegisterSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      }
    })

    // Return success response
    return res.status(201).json({
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return res.status(400).json({ 
        error: firstError.message 
      })
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Generic error response
    return res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
} 