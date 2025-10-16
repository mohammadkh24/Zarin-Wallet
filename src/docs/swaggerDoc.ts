export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Taskino',
      version: '2.1.0',
      description: 'Taskino API - Mobile OTP Authentication',
    },
    servers: [
      { url: 'http://localhost:3000/' },
    ],
    tags: [
      { name: 'Auth', description: 'Routes related to authentication via mobile OTP' },
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
                      message: { type: 'string', example: 'کد تایید با موفقیت ارسال شد' },
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
                      message: { type: 'string', example: 'property mobile should not exist' },
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
                      message: { type: 'string', example: 'ورود با موفقیت انجام شد' },
                      data: {
                        type: 'object',
                        properties: {
                          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
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
                      message: { type: 'string', example: 'کد تایید نامعتبر یا منقضی است' },
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
                      message: { type: 'string', example: 'Authorization header is missing' },
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
          description: 'Generate new access + refresh tokens using a valid refresh token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
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
                      message: { type: 'string', example: 'توکن‌ها با موفقیت نوسازی شدند' },
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
                      message: { type: 'string', example: 'توکن رفرش نامعتبر است' },
                    },
                  },
                },
              },
            },
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
      },
    },
  };
  