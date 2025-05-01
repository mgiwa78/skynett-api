const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

export const loadPartials = () => {
  const partialsDir = path.join(__dirname, "partials");
  const filenames = fs.readdirSync(partialsDir);
  filenames.forEach((filename: any) => {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    const name = matches[1];
    const filepath = path.join(partialsDir, filename);
    const template = fs.readFileSync(filepath, "utf8");

    handlebars.registerPartial(name, handlebars.compile(template));
  });
};

const layoutPath = path.join(__dirname, "partials", "baseLayout.hbs");
const layoutTemplate = fs.readFileSync(layoutPath, "utf-8");
const compileLayout = handlebars.compile(layoutTemplate);

export const generateEmailContent = (data: any, partialName: any) => {
  const partial = handlebars.partials[partialName];
  if (!partial) {
    throw new Error(`Partial ${partialName} not found`);
  }
  data.body = partial(data);
  return compileLayout(data);
};
