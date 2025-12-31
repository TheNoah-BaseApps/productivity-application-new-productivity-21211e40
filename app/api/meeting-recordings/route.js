import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/meeting-recordings:
 *   get:
 *     summary: Get all meeting recordings
 *     description: Retrieve all meeting recordings with filtering and pagination
 *     tags: [Meeting Recordings]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by meeting title
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: List of meeting recordings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM meeting_recordings WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      sql += ` AND meeting_title ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY meeting_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching meeting recordings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/meeting-recordings:
 *   post:
 *     summary: Create a new meeting recording
 *     description: Add a new meeting recording to the system
 *     tags: [Meeting Recordings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recording_id
 *               - meeting_title
 *               - meeting_date
 *             properties:
 *               recording_id:
 *                 type: string
 *               meeting_title:
 *                 type: string
 *               participants:
 *                 type: string
 *               recording_link:
 *                 type: string
 *               meeting_date:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *     responses:
 *       201:
 *         description: Meeting recording created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      recording_id,
      meeting_title,
      participants,
      recording_link,
      meeting_date,
      duration
    } = body;

    if (!recording_id || !meeting_title || !meeting_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO meeting_recordings (
        recording_id, meeting_title, participants, recording_link,
        meeting_date, duration, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(sql, [
      recording_id,
      meeting_title,
      participants,
      recording_link,
      meeting_date,
      duration
    ]);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating meeting recording:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}