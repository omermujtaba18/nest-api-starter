import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as ejs from 'ejs';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@app/logger';
import { convert } from 'html-to-text';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private logger: Logger,
  ) {
    const apiKey = this.configService.get<string>('mail.apiKey');

    if (!apiKey) {
      throw new Error('SendGrid API key is not defined.');
    }

    sgMail.setApiKey(apiKey);
  }
  async send(
    template: string,
    to: string,
    subject: string,
    data: {
      [name: string]: any;
    },
    options?: { fromName: string; fromEmail: string },
  ) {
    try {
      const templatePath = path.join(
        __dirname,
        'email',
        'templates',
        `${template}.ejs`,
      );
      const html: string = await new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err: Error | null, str: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(str);
          }
        });
      });

      const fromEmail =
        options?.fromEmail || this.configService.get('mail.defaultFromEmail');
      const fromName =
        options?.fromName || this.configService.get('mail.defaultFromName');

      const text = convert(html);

      await sgMail.send({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject,
        html: html as string,
        text: text,
      });
    } catch (error) {
      this.logger.error((error as any).message, {
        stack: (error as any).stack,
        error: error as any,
        template,
        data,
      });
    }
  }
}
