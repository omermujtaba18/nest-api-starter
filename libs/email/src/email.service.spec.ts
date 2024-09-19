import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@app/logger';
import * as sgMail from '@sendgrid/mail';
import * as ejs from 'ejs';
import * as path from 'path';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

jest.mock('ejs', () => ({
  renderFile: jest.fn(),
}));

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

  it('should send an email with the correct parameters', async () => {
    const template = 'test-template';
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const data = { name: 'John Doe' };

    const renderedHtml = '<html><body>Test email content</body></html>';
    (ejs.renderFile as jest.Mock).mockImplementation((path, data, callback) => {
      callback(null, renderedHtml);
    });

    await service.send(template, to, subject, data);

    expect(ejs.renderFile).toHaveBeenCalledWith(
      path.join(__dirname, 'email', 'templates', `${template}.ejs`),
      data,
      expect.any(Function),
    );

    expect(sgMail.send).toHaveBeenCalledWith({
      from: 'Default Sender <default@example.com>',
      to,
      subject,
      html: renderedHtml,
      text: expect.any(String),
    });
  });

  it('should log an error if email sending fails', async () => {
    const template = 'test-template';
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const data = { name: 'John Doe' };

    const error = new Error('Send failed');
    (ejs.renderFile as jest.Mock).mockImplementation((path, data, callback) => {
      callback(null, '<html>Test</html>');
    });

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
