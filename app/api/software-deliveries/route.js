import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/software-deliveries:
 *   get:
 *     summary: Get all software deliveries
 *     description: Retrieve a list of all software deliveries with optional filtering and pagination
 *     tags: [Software Deliveries]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by installation status
 *       - in: query
 *         name: customer_id
 *         schema:
 *           type: string
 *         description: Filter by customer ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Successfully retrieved software deliveries
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
    const status = searchParams.get('status');
    const customer_id = searchParams.get('customer_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM software_deliveries WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND installation_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (customer_id) {
      sql += ` AND customer_id = $${paramIndex}`;
      params.push(customer_id);
      paramIndex++;
    }

    sql += ` ORDER BY delivery_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching software deliveries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/software-deliveries:
 *   post:
 *     summary: Create a new software delivery
 *     description: Add a new software delivery record
 *     tags: [Software Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - delivery_id
 *               - customer_id
 *               - software_name
 *               - version
 *               - delivery_date
 *               - installation_status
 *             properties:
 *               delivery_id:
 *                 type: string
 *               customer_id:
 *                 type: string
 *               software_name:
 *                 type: string
 *               version:
 *                 type: string
 *               delivery_date:
 *                 type: string
 *                 format: date-time
 *               installation_status:
 *                 type: string
 *               support_level:
 *                 type: string
 *               assigned_agent:
 *                 type: string
 *               feedback_received:
 *                 type: string
 *     responses:
 *       201:
 *         description: Software delivery created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      delivery_id,
      customer_id,
      software_name,
      version,
      delivery_date,
      installation_status,
      support_level,
      assigned_agent,
      feedback_received
    } = body;

    if (!delivery_id || !customer_id || !software_name || !version || !delivery_date || !installation_status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO software_deliveries (
        delivery_id, customer_id, software_name, version, delivery_date,
        installation_status, support_level, assigned_agent, feedback_received,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(sql, [
      delivery_id,
      customer_id,
      software_name,
      version,
      delivery_date,
      installation_status,
      support_level || null,
      assigned_agent || null,
      feedback_received || null
    ]);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating software delivery:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}