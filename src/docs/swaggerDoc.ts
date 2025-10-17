export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Zarin-Wallet',
    version: '2.1.0',
    description: 'Zarin Wallet - Payment System',
  },
  servers: [{ url: 'https://zarin-wallet.onrender.com/docs' }],
  tags: [
    {
      name: 'Auth',
      description: 'Routes related to authentication via mobile OTP',
    },
    {
      name: 'Users',
      description: 'All routes about users',
    },
    {
      name: 'Wallet',
      description: 'All routes about wallet',
    },
    {
      name: 'Transactions',
      description: 'All routes about transactions',
    },
  ],
  paths: {
    '/auth/send': {
      post: {
        summary: 'Send OTP',
        tags: ['Auth'],
        description: 'Send a one-time password (OTP) to a user’s mobile number',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/sendOtpDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'کد تایید با موفقیت ارسال شد',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'property mobile should not exist',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/verify': {
      post: {
        summary: 'Verify OTP',
        tags: ['Auth'],
        description: 'Verify user OTP and return access + refresh tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mobile: { type: 'string', example: '09123456789' },
                },
                required: ['mobile'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'ورود با موفقیت انجام شد',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: {
                          type: 'string',
                          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        refreshToken: {
                          type: 'string',
                          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid or expired OTP',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'کد تایید نامعتبر یا منقضی است',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get logged-in user info',
        tags: ['Auth'],
        description: 'Returns current user info (requires Bearer token)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User info retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'number', example: 1 },
                        mobile: { type: 'string', example: '09123456789' },
                        mobileVerify: { type: 'boolean', example: true },
                        emailVerify: { type: 'boolean', example: false },
                        created_at: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized (missing or invalid token)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Authorization header is missing',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh tokens',
        tags: ['Auth'],
        description:
          'Generate new access + refresh tokens using a valid refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  },
                },
                required: ['refreshToken'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Tokens refreshed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'توکن‌ها با موفقیت نوسازی شدند',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid refresh token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'توکن رفرش نامعتبر است',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        summary: 'Get all users',
        tags: ['Users'],
        description: 'Retrieve a paginated list of users (Admin only)',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
          {
            name: 'role',
            in: 'query',
            schema: { type: 'string', enum: ['USER', 'ADMIN'] },
            required: false,
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        totalItems: { type: 'integer', example: 100 },
                        totalPages: { type: 'integer', example: 10 },
                      },
                    },
                    success: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/users/{userId}': {
      get: {
        summary: 'Get a single user',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User retrieved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' },
              },
            },
          },
          404: { description: 'User not found' },
        },
      },
      delete: {
        summary: 'Delete a user',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          404: { description: 'User not found' },
        },
      },
    },
    '/users/{userId}/role': {
      patch: {
        summary: 'Change user role',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['USER', 'ADMIN'] },
                },
                required: ['role'],
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User role updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          404: { description: 'User not found' },
        },
      },
    },
    '/wallet/deposit': {
      post: {
        summary: 'Deposit money to wallet',
        security: [{ bearerAuth: [] }],
        tags: ['Wallet'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDepositDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'Deposit initiated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Deposit transaction created successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        url: {
                          type: 'string',
                          example: 'https://zarinpal.com/payment-url',
                        },
                        authority: { type: 'string', example: 'AUTH123456' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Invalid request' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/wallet/withdraw': {
      post: {
        summary: 'Withdraw money from wallet',
        security: [{ bearerAuth: [] }],

        tags: ['Wallet'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateWithdrawDto' },
            },
          },
        },
        responses: {
          200: {
            description: 'Withdrawal successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Withdrawal successful',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'number', example: 1 },
                        amount: { type: 'string', example: '-30000' },
                        oldBalance: { type: 'string', example: '50000' },
                        newBalance: { type: 'string', example: '20000' },
                        invoiceNumber: { type: 'string', example: '1234' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Insufficient balance or bad request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Insufficient wallet balance',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/wallet/verify': {
      get: {
        summary: 'Verify payment',

        tags: ['Wallet'],
        parameters: [
          {
            name: 'Authority',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'Status',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Payment verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Payment verified successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        invoice_number: { type: 'string', example: '1234' },
                        ref_id: { type: 'string', example: 'REF123456' },
                        newBalance: { type: 'string', example: '80000' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Payment failed or invalid',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: {
                      type: 'string',
                      example: 'Payment failed or transaction not found',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/transactions': {
      get: {
        summary: 'Get all transactions (Admin only)',
        tags: ['Transactions'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          amount: { type: 'number', example: 50000 },
                          type: { type: 'string', example: 'deposit' },
                          isPaid: { type: 'boolean', example: true },
                          userId: { type: 'number', example: 1 },
                          created_at: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        totalItems: { type: 'number', example: 50 },
                        totalPages: { type: 'number', example: 5 },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },

    '/transactions/me': {
      get: {
        summary: 'Get transactions of current user',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          amount: { type: 'number', example: 50000 },
                          type: { type: 'string', example: 'deposit' },
                          isPaid: { type: 'boolean', example: true },
                          created_at: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },

    '/transactions/{id}': {
      get: {
        summary: 'Get transaction by ID (Admin only)',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Transaction detail',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'number', example: 1 },
                        amount: { type: 'number', example: 50000 },
                        type: { type: 'string', example: 'deposit' },
                        isPaid: { type: 'boolean', example: true },
                        userId: { type: 'number', example: 1 },
                        created_at: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          404: { description: 'Transaction not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
      delete: {
        summary: 'Delete transaction by ID (Admin only)',
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Transaction deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Transaction removed successfully',
                    },
                  },
                },
              },
            },
          },
          404: { description: 'Transaction not found' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden' },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          mobile: { type: 'string', example: '09123456789' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
          mobileVerify: { type: 'boolean', example: true },
          emailVerify: { type: 'boolean', example: false },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      sendOtpDto: {
        type: 'object',
        properties: {
          mobile: { type: 'string', example: '09123456789' },
        },
        required: ['mobile'],
      },
      checkOtpDto: {
        type: 'object',
        properties: {
          mobile: { type: 'string', example: '09123456789' },
          code: { type: 'string', example: '1234' },
        },
        required: ['mobile', 'code'],
      },
      UserResponse: {
        type: 'object',
        properties: {
          data: { $ref: '#/components/schemas/User' },
          success: { type: 'boolean', example: true },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Operation completed successfully',
          },
          success: { type: 'boolean', example: true },
        },
      },
      CreateDepositDto: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 50000 },
        },
        required: [ 'amount'],
      },
      CreateWithdrawDto: {
        type: 'object',
        properties: {
          amount: { type: 'number', example: 30000 },
        },
        required: [ 'amount'],
      },
    },
  },
};

