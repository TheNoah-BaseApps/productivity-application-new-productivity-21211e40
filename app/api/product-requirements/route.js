import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/product-requirements:
 *   get:
 *     summary: Get all product requirements
 *     description: Retrieve all product requirements with filtering and pagination
 *     tags: [Product Requirements]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: Filter by priority
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
 *         description: List of product requirements
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
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM product_requirements WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      sql += ` AND priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    sql += ` ORDER BY requirement_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching product requirements:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/product-requirements:
 *   post:
 *     summary: Create a new product requirement
 *     description: Add a new product requirement to the system
 *     tags: [Product Requirements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requirement_id
 *               - feature_description
 *               - priority
 *               - requirement_date
 *               - status
 *             properties:
 *               requirement_id:
 *                 type: string
 *               customer_id:
 *                 type: string
 *               document_source:
 *                 type: string
 *               feature_description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High, Critical]
 *               associated_product:
 *                 type: string
 *               requirement_date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [New, In Progress, Approved, Rejected, Completed]
 *               no_of_sprints:
 *                 type: integer
 *               cost:
 *                 type: number
 *               q_cparameters:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product requirement created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      requirement_id,
      customer_id,
      document_source,
      feature_description,
      priority,
      associated_product,
      requirement_date,
      status,
      no_of_sprints,
      cost,
      q_cparameters
    } = body;

    if (!requirement_id || !feature_description || !priority || !requirement_date || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO product_requirements (
        requirement_id, customer_id, document_source, feature_description,
        priority, associated_product, requirement_date, status,
        no_of_sprints, cost, q_cparameters, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(sql, [
      requirement_id,
      customer_id,
      document_source,
      feature_description,
      priority,
      associated_product,
      requirement_date,
      status,
      no_of_sprints,
      cost,
      q_cparameters
    ]);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product requirement:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}