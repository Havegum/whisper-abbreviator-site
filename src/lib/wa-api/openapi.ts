export default {
  openapi: '3.1.0',
  info: {
    title: 'Whisper Abbreviator App',
    version: '0.1.0',
  },
  paths: {
    '/': {
      get: {
        tags: ['status'],
        summary: 'Health Check',
        operationId: 'health_check__get',
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthCheck',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/session': {
      get: {
        tags: ['session'],
        summary: 'Get Sessions',
        operationId: 'get_sessions_api_v1_session_get',
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/Session',
                  },
                  type: 'array',
                  title: 'Response Get Sessions Api V1 Session Get',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['session'],
        summary: 'Create Session',
        operationId: 'create_session_api_v1_session_post',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SessionCreate',
              },
            },
          },
          required: true,
        },
        responses: {
          '201': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Session',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/session/{id}': {
      get: {
        tags: ['session'],
        summary: 'Get Session By Id',
        operationId: 'get_session_by_id_api_v1_session__id__get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Session',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['session'],
        summary: 'Delete Session By Id',
        operationId: 'delete_session_by_id_api_v1_session__id__delete',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatusMessage',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ['session'],
        summary: 'Patch Session By Id',
        operationId: 'patch_session_by_id_api_v1_session__id__patch',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Session',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Session',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/session/{id}/recordings': {
      get: {
        tags: ['session'],
        summary: 'Get Session Recordings By Id',
        operationId:
          'get_session_recordings_by_id_api_v1_session__id__recordings_get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/Recording',
                  },
                  type: 'array',
                  title:
                    'Response Get Session Recordings By Id Api V1 Session  Id  Recordings Get',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/recording': {
      get: {
        tags: ['recording'],
        summary: 'Get All Recordings',
        operationId: 'get_all_recordings_api_v1_recording_get',
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/Recording',
                  },
                  type: 'array',
                  title: 'Response Get All Recordings Api V1 Recording Get',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['recording'],
        summary: 'Create Recording',
        operationId: 'create_recording_api_v1_recording_post',
        parameters: [
          {
            required: false,
            schema: {
              type: 'string',
              format: 'uuid',
              title: 'Session Id',
            },
            name: 'session_id',
            in: 'query',
          },
          {
            required: false,
            schema: {
              type: 'boolean',
              title: 'Transcribe',
              default: false,
            },
            name: 'transcribe',
            in: 'query',
          },
          {
            required: false,
            schema: {
              type: 'boolean',
              title: 'Summarize',
              default: false,
            },
            name: 'summarize',
            in: 'query',
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/Body_create_recording_api_v1_recording_post',
              },
            },
          },
          required: true,
        },
        responses: {
          '201': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Recording',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/recording/{id}': {
      get: {
        tags: ['recording'],
        summary: 'Get Recording By Id',
        operationId: 'get_recording_by_id_api_v1_recording__id__get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Recording',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['recording'],
        summary: 'Delete Recording By Id',
        operationId: 'delete_recording_by_id_api_v1_recording__id__delete',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatusMessage',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ['recording'],
        summary: 'Patch Recording By Id',
        operationId: 'patch_recording_by_id_api_v1_recording__id__patch',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Recording',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Recording',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/recording/{id}/transcriptions': {
      get: {
        tags: ['recording'],
        summary: 'Get Recording Transcriptions By Id',
        operationId:
          'get_recording_transcriptions_by_id_api_v1_recording__id__transcriptions_get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/session_note': {
      get: {
        tags: ['session_note'],
        summary: 'Get All Session Notes',
        operationId: 'get_all_session_notes_api_v1_session_note_get',
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/SessionNote',
                  },
                  type: 'array',
                  title:
                    'Response Get All Session Notes Api V1 Session Note Get',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['session_note'],
        summary: 'Create Session Note',
        operationId: 'create_session_note_api_v1_session_note_post',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SessionNoteCreate',
              },
            },
          },
          required: true,
        },
        responses: {
          '201': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionNote',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/session_note/{id}': {
      get: {
        tags: ['session_note'],
        summary: 'Get Session Note By Id',
        operationId: 'get_session_note_by_id_api_v1_session_note__id__get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionNote',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['session_note'],
        summary: 'Delete Session Note By Id',
        operationId:
          'delete_session_note_by_id_api_v1_session_note__id__delete',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatusMessage',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ['session_note'],
        summary: 'Patch Session Note By Id',
        operationId: 'patch_session_note_by_id_api_v1_session_note__id__patch',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SessionNote',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SessionNote',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/transcription/{id}': {
      get: {
        tags: ['transcription'],
        summary: 'Get Transcription By Id',
        operationId: 'get_transcription_by_id_api_v1_transcription__id__get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transcription',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['transcription'],
        summary: 'Delete Transcription By Id',
        operationId:
          'delete_transcription_by_id_api_v1_transcription__id__delete',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatusMessage',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ['transcription'],
        summary: 'Patch Transcription By Id',
        operationId:
          'patch_transcription_by_id_api_v1_transcription__id__patch',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Transcription',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transcription',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auto_summary': {
      get: {
        tags: ['auto_summary'],
        summary: 'Get All Auto Summarys',
        operationId: 'get_all_auto_summarys_api_v1_auto_summary_get',
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/AutoSummary',
                  },
                  type: 'array',
                  title:
                    'Response Get All Auto Summarys Api V1 Auto Summary Get',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auto_summary/{id}': {
      get: {
        tags: ['auto_summary'],
        summary: 'Get Auto Summary By Id',
        operationId: 'get_auto_summary_by_id_api_v1_auto_summary__id__get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AutoSummary',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['auto_summary'],
        summary: 'Delete Auto Summary By Id',
        operationId:
          'delete_auto_summary_by_id_api_v1_auto_summary__id__delete',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatusMessage',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ['auto_summary'],
        summary: 'Patch Auto Summary By Id',
        operationId: 'patch_auto_summary_by_id_api_v1_auto_summary__id__patch',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AutoSummary',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AutoSummary',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/chunk/{id}': {
      get: {
        tags: ['chunk'],
        summary: 'Get Chunk By Id',
        operationId: 'get_chunk_by_id_api_v1_chunk__id__get',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Id',
            },
            name: 'id',
            in: 'path',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Chunk',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/chunk/similar': {
      post: {
        tags: ['chunk'],
        summary: 'Reply Chunk',
        operationId: 'reply_chunk_api_v1_chunk_similar_post',
        parameters: [
          {
            required: true,
            schema: {
              type: 'string',
              title: 'Sentence',
            },
            name: 'sentence',
            in: 'query',
          },
        ],
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {
                  items: {
                    $ref: '#/components/schemas/Chunk',
                  },
                  type: 'array',
                  title: 'Response Reply Chunk Api V1 Chunk Similar Post',
                },
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/agent/stream': {
      post: {
        tags: ['agent'],
        summary: 'Stream',
        operationId: 'stream_api_v1_agent_stream_post',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/StreamRequest',
              },
            },
          },
          required: true,
        },
        responses: {
          '200': {
            description: 'Successful Response',
            content: {
              'application/json': {
                schema: {},
              },
            },
          },
          '422': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPValidationError',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AutoSummary: {
        properties: {
          created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At',
          },
          uuid: {
            type: 'string',
            format: 'uuid',
            title: 'Uuid',
          },
          content: {
            type: 'string',
            title: 'Content',
          },
          transcription_id: {
            type: 'string',
            format: 'uuid',
            title: 'Transcription Id',
          },
        },
        type: 'object',
        required: ['content', 'transcription_id'],
        title: 'AutoSummary',
      },
      Body_create_recording_api_v1_recording_post: {
        properties: {
          audio_file: {
            type: 'string',
            format: 'binary',
            title: 'Audio File',
          },
        },
        type: 'object',
        required: ['audio_file'],
        title: 'Body_create_recording_api_v1_recording_post',
      },
      Chunk: {
        properties: {
          uuid: {
            type: 'string',
            format: 'uuid',
            title: 'Uuid',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At',
          },
          content: {
            type: 'string',
            title: 'Content',
          },
          embedding: {
            items: {
              type: 'number',
            },
            type: 'array',
            title: 'Embedding',
          },
          transcription_id: {
            type: 'string',
            format: 'uuid',
            title: 'Transcription Id',
          },
          session_note_id: {
            type: 'string',
            format: 'uuid',
            title: 'Session Note Id',
          },
          auto_summary_id: {
            type: 'string',
            format: 'uuid',
            title: 'Auto Summary Id',
          },
        },
        type: 'object',
        required: ['content'],
        title: 'Chunk',
      },
      HTTPValidationError: {
        properties: {
          detail: {
            items: {
              $ref: '#/components/schemas/ValidationError',
            },
            type: 'array',
            title: 'Detail',
          },
        },
        type: 'object',
        title: 'HTTPValidationError',
      },
      HealthCheck: {
        properties: {
          name: {
            type: 'string',
            title: 'Name',
          },
          version: {
            type: 'string',
            title: 'Version',
          },
          description: {
            type: 'string',
            title: 'Description',
          },
        },
        type: 'object',
        required: ['name', 'version', 'description'],
        title: 'HealthCheck',
      },
      Recording: {
        properties: {
          created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At',
          },
          uuid: {
            type: 'string',
            format: 'uuid',
            title: 'Uuid',
          },
          name: {
            type: 'string',
            title: 'Name',
          },
          session_id: {
            type: 'string',
            format: 'uuid',
            title: 'Session Id',
          },
        },
        type: 'object',
        required: ['name'],
        title: 'Recording',
      },
      Session: {
        properties: {
          uuid: {
            type: 'string',
            format: 'uuid',
            title: 'Uuid',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At',
          },
          number: {
            type: 'string',
            title: 'Number',
          },
        },
        type: 'object',
        title: 'Session',
      },
      SessionCreate: {
        properties: {
          number: {
            type: 'string',
            title: 'Number',
          },
        },
        type: 'object',
        title: 'SessionCreate',
      },
      SessionNote: {
        properties: {
          uuid: {
            type: 'string',
            format: 'uuid',
            title: 'Uuid',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At',
          },
          session: {
            type: 'string',
            format: 'uuid',
            title: 'Session',
          },
          content: {
            type: 'string',
            title: 'Content',
          },
        },
        type: 'object',
        required: ['content'],
        title: 'SessionNote',
      },
      SessionNoteCreate: {
        properties: {
          content: {
            type: 'string',
            title: 'Content',
          },
        },
        type: 'object',
        required: ['content'],
        title: 'SessionNoteCreate',
      },
      StatusMessage: {
        properties: {
          status: {
            type: 'boolean',
            title: 'Status',
          },
          message: {
            type: 'string',
            title: 'Message',
          },
        },
        type: 'object',
        required: ['status', 'message'],
        title: 'StatusMessage',
      },
      StreamRequest: {
        properties: {
          message: {
            type: 'string',
            title: 'Message',
          },
        },
        type: 'object',
        required: ['message'],
        title: 'StreamRequest',
        description: 'Request body for streaming.',
      },
      Transcription: {
        properties: {
          uuid: {
            type: 'string',
            format: 'uuid',
            title: 'Uuid',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            title: 'Created At',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            title: 'Updated At',
          },
          content: {
            type: 'string',
            title: 'Content',
          },
          recording_id: {
            type: 'string',
            format: 'uuid',
            title: 'Recording Id',
          },
        },
        type: 'object',
        required: ['content', 'recording_id'],
        title: 'Transcription',
      },
      ValidationError: {
        properties: {
          loc: {
            items: {
              anyOf: [
                {
                  type: 'string',
                },
                {
                  type: 'integer',
                },
              ],
            },
            type: 'array',
            title: 'Location',
          },
          msg: {
            type: 'string',
            title: 'Message',
          },
          type: {
            type: 'string',
            title: 'Error Type',
          },
        },
        type: 'object',
        required: ['loc', 'msg', 'type'],
        title: 'ValidationError',
      },
    },
  },
} as const;
