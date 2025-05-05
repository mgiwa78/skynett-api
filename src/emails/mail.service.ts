import nodemailer from "nodemailer";
import path from "path";
import Handlebars from "handlebars";
import fs from "fs";
import config from "@constants/config";

const infoTransporter = nodemailer.createTransport({
  host: "mail.skynettrenewables.com",
  port: 465,
  secure: true,
  auth: {
    user: "info@skynettrenewables.com",
    pass: ";zlBub1,&ln?",
  },
  tls: {
    rejectUnauthorized: config.nodeEnv === "production",
  },
  pool: true,
  maxConnections: 10,
  maxMessages: 100,
  socketTimeout: 60000,
});

type EmailSection = {
  type: "text" | "list" | "table";
  title?: string;
  content?: string;
  items?: string[];
  headers?: string[];
  rows?: any[][];
};

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("isEmail", function (value) {
  return typeof value === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
});

Handlebars.registerHelper("isUrl", function (value) {
  return (
    typeof value === "string" && /^(https?:\/\/|\/uploads\/|www\.)/.test(value)
  );
});

const dynamicTemplate = Handlebars.compile(
  fs.readFileSync(
    path.join(__dirname, "partials/dynamic-template.hbs"),
    "utf-8"
  )
);

export const sendDynamicMail = async (
  to: string,
  subject: string,
  sections: EmailSection[],
  attachmentPaths?: string[]
) => {
  const content = dynamicTemplate({ sections });

  const mailOptions: any = {
    from: "info@skynettrenewables.com",
    to,
    subject,
    html: content,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "images/logo.png"),
        cid: "logo",
      },
    ],
  };

  if (attachmentPaths && attachmentPaths.length > 0) {
    mailOptions.attachments.push(
      ...attachmentPaths.map((filePath) => ({
        filename: path.basename(filePath),
        path: filePath,
      }))
    );
  }

  return new Promise((resolve, reject) => {
    infoTransporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      console.log("Message sent: %s", info.response);
      resolve(true);
    });
  });
};

interface FormDataParseResult {
  sections: EmailSection[];
  attachmentPaths: string[];
}

const isUploadPath = (value: unknown): value is string => {
  return typeof value === "string" && value.startsWith("/uploads/");
};

export const parseFormDataToTableSection = (
  formData: Record<string, any>
): FormDataParseResult => {
  const sections: EmailSection[] = [];
  const attachmentPaths: string[] = [];

  for (const [sectionKey, sectionData] of Object.entries(formData)) {
    if (typeof sectionData === "object" && sectionData !== null) {
      const rows = Object.entries(sectionData).map(([key, value]) => {
        if (isUploadPath(value)) {
          attachmentPaths.push(`${config.baseUrl}${value}`);
          return [
            key.replace(/([A-Z])/g, " $1").trim(),
            `Attachment: ${key} file`,
          ];
        } else if (Array.isArray(value) && value.every(isUploadPath)) {
          attachmentPaths.push(...value.map((p) => `${config.baseUrl}${p}`));
          return [
            key.replace(/([A-Z])/g, " $1").trim(),
            `Attachment: ${key} files`,
          ];
        } else {
          return [
            key.replace(/([A-Z])/g, " $1").trim(),
            typeof value === "object" ? JSON.stringify(value) : String(value),
          ];
        }
      });

      sections.push({
        type: "table",
        title: sectionKey,
        headers: ["Field", "Value"],
        rows,
      });
    } else {
      if (isUploadPath(sectionData)) {
        attachmentPaths.push(sectionData);
        sections.push({
          type: "table",
          headers: ["Field", "Value"],
          rows: [[sectionKey, `Attachment: ${path.basename(sectionData)}`]],
        });
      } else {
        sections.push({
          type: "table",
          headers: ["Field", "Value"],
          rows: [[sectionKey, String(sectionData)]],
        });
      }
    }
  }

  return {
    sections,
    attachmentPaths,
  };
};
