import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@app/logger';
import * as sgMail from '@sendgrid/mail';
import * as path from 'path';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

jest.mock('path', () => {
  const originalPath = jest.requireActual('path');
  return {
    ...originalPath,
    join: jest.fn(),
  };
});

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'mail.apiKey':
                  return 'dummy-api-key';
                case 'mail.defaultFromEmail':
                  return 'default@example.com';
                case 'mail.defaultFromName':
                  return 'Default Sender';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set the SendGrid API key on initialization', () => {
    expect(sgMail.setApiKey).toHaveBeenCalledWith('dummy-api-key');
  });

  it('should send an email with the correct parameters ', async () => {
    const template = 'test-template'; // Corresponds to email/templates/test-template.ejs
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const data = { name: 'John Doe' };

    const renderedHtml = '<html><body>Hello John Doe</body></html>';
    (path.join as jest.Mock).mockReturnValue(
      __dirname + `/templates/${template}.ejs`,
    );

    await service.send(template, to, subject, data);

    expect(sgMail.send).toHaveBeenCalledWith({
      from: 'Default Sender <default@example.com>',
      to,
      subject,
      html: renderedHtml,
      text: 'Hello John Doe',
    });
  });

  it('should log an error if email sending fails', async () => {
    const template = 'test-template';
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const data = { name: 'John Doe' };

    const error = new Error('Send failed');
    (path.join as jest.Mock).mockReturnValue(
      __dirname + `/templates/${template}.ejs`,
    );
    (sgMail.send as jest.Mock).mockRejectedValue(error);

    await service.send(template, to, subject, data);

    expect(logger.error).toHaveBeenCalledWith(error.message, {
      stack: error.stack,
      error,
      template,
      data,
    });
  });

  it('should throw an error if SendGrid API key is not defined', () => {
    (configService.get as jest.Mock).mockReturnValueOnce(null); // Mock no API key
    expect(() => new EmailService(configService, logger)).toThrowError(
      'SendGrid API key is not defined.',
    );
  });
});
