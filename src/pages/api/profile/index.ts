import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { PrismaClient, ReleaseType } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'GET') {
      // Fetch user profile with trusted contacts
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          trustedContacts: {
            include: {
              trustedUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true
                }
              }
            }
          }
        }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Format trusted contacts for frontend
      const trustedContacts = user.trustedContacts.map(trust => ({
        id: trust.trustedUser.id,
        name: trust.trustedUser.name,
        email: trust.trustedUser.email,
        avatarUrl: trust.trustedUser.avatarUrl,
        role: trust.role,
        trustId: trust.id
      }))

      const profile = {
        id: user.id,
        email: user.email,
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        timeZone: user.timeZone,
        willStatement: user.willStatement,
        defaultRelease: user.defaultRelease,
        defaultReleaseAfterDays: user.defaultReleaseAfterDays,
        twoFactor: user.twoFactor,
        phoneNumber: user.phoneNumber,
        notifications: user.notifications || {
          emailOnUnlock: true,
          notifyOnShare: true,
          reminderAfterInactivity: true
        },
        trustedContacts
      }

      return res.status(200).json({ profile })
    }

    if (req.method === 'PUT') {
      // Update user profile
      const {
        name,
        dateOfBirth,
        timeZone,
        willStatement,
        defaultRelease,
        defaultReleaseAfterDays,
        twoFactor,
        phoneNumber,
        notifications,
        avatarUrl
      } = req.body

      // Validation
      if (name && (typeof name !== 'string' || name.trim().length === 0)) {
        return res.status(400).json({ error: 'Name must be a non-empty string' })
      }

      if (dateOfBirth && !isValidDate(dateOfBirth)) {
        return res.status(400).json({ error: 'Invalid date of birth' })
      }

      if (timeZone && typeof timeZone !== 'string') {
        return res.status(400).json({ error: 'Time zone must be a string' })
      }

      if (willStatement && (typeof willStatement !== 'string' || willStatement.length > 500)) {
        return res.status(400).json({ error: 'Will statement must be a string with max 500 characters' })
      }

      if (defaultRelease && !Object.values(ReleaseType).includes(defaultRelease)) {
        return res.status(400).json({ error: 'Invalid default release type' })
      }

      if (defaultReleaseAfterDays && (typeof defaultReleaseAfterDays !== 'number' || defaultReleaseAfterDays < 1)) {
        return res.status(400).json({ error: 'Default release after days must be a positive number' })
      }

      if (twoFactor && typeof twoFactor !== 'boolean') {
        return res.status(400).json({ error: 'Two factor must be a boolean' })
      }

      if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' })
      }

      // Update user
      const updateData: any = {}
      if (name !== undefined) updateData.name = name.trim()
      if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth)
      if (timeZone !== undefined) updateData.timeZone = timeZone
      if (willStatement !== undefined) updateData.willStatement = willStatement
      if (defaultRelease !== undefined) updateData.defaultRelease = defaultRelease
      if (defaultReleaseAfterDays !== undefined) updateData.defaultReleaseAfterDays = defaultReleaseAfterDays
      if (twoFactor !== undefined) updateData.twoFactor = twoFactor
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber
      if (notifications !== undefined) updateData.notifications = notifications
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl

      const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: updateData
      })

      return res.status(200).json({ 
        message: 'Profile updated successfully',
        profile: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          dateOfBirth: updatedUser.dateOfBirth,
          avatarUrl: updatedUser.avatarUrl,
          timeZone: updatedUser.timeZone,
          willStatement: updatedUser.willStatement,
          defaultRelease: updatedUser.defaultRelease,
          defaultReleaseAfterDays: updatedUser.defaultReleaseAfterDays,
          twoFactor: updatedUser.twoFactor,
          phoneNumber: updatedUser.phoneNumber,
          notifications: updatedUser.notifications
        }
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Profile API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime()) && date < new Date()
}

function isValidPhoneNumber(phone: string): boolean {
  // Basic phone number validation - adjust regex as needed
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
} 