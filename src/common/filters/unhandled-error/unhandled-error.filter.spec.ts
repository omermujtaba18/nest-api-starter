import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@app/logger';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { UnhandledErrorFilter } from './unhandled-error.filter';

describe('UnhandledErrorFilter', () => {
  let filter: UnhandledErrorFilter;
  let logger: Logger;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UnhandledErrorFilter,
        {
          provide: Logger,
          useValue: { error: jest.fn() },
        },
      ],
    }).compile();

    filter = moduleRef.get<UnhandledErrorFilter>(UnhandledErrorFilter);
    logger = moduleRef.get<Logger>(Logger);
  });

  it('should log the error and send a 500 response', () => {
    const exception = new Error('Test error');
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;

    filter.catch(exception, mockArgumentsHost);

    expect(logger.error).toHaveBeenCalledWith('Unhandled error', {
      stack: exception.stack,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Something went wrong!',
    });
  });
});
